/**
 * Application Security Service
 * Provides sanitization, rate-limiting, brute-force mitigation, and security policies.
 * No sensitive secrets or passwords are hardcoded here.
 */

/**
 * Strips dangerous HTML tags, javascript: URIs, and event attributes from user inputs.
 * Prevents Cross-Site Scripting (XSS) in stored reviews, customer queries, and address inputs.
 */
export function sanitizeInput(input: string | undefined | null): string {
  if (!input) return '';
  if (typeof input !== 'string') return String(input);

  return input
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe, embed, object, frame tags
    .replace(/<(iframe|embed|object|frameset|frame)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
    // Remove inline event handlers like onload, onerror, onclick, etc.
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/on\w+\s*=\s*[^>\s]+/gi, '')
    // Remove javascript: and data: URIs in tags
    .replace(/href\s*=\s*(['"])\s*(javascript|data):.*?\1/gi, '')
    .replace(/src\s*=\s*(['"])\s*(javascript|data):.*?\1/gi, '')
    // Strip raw HTML tags to plain text
    .replace(/<[^>]*>/g, '')
    // Trim extra surrounding whitespace
    .trim();
}

/**
 * Recursively sanitizes all string fields within an object before sending to Firestore or localStorage.
 */
export function sanitizeObject<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    return sanitizeInput(data) as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      cleaned[key] = sanitizeObject(value);
    }
    return cleaned as T;
  }
  return data;
}

/**
 * Client-Side Rate Limiter & Brute Force Lockout
 * Limits repeated sensitive operations (e.g. Admin login attempts, password updates)
 */
interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
}

const RATE_LIMIT_PREFIX = 'coorg_sec_rl_';

export function checkRateLimit(
  actionKey: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes window
  lockoutDurationMs: number = 5 * 60 * 1000 // 5 minutes lockout
): {
  isLocked: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
  recordAttempt: () => void;
  resetAttempts: () => void;
} {
  if (typeof window === 'undefined') {
    return {
      isLocked: false,
      remainingAttempts: maxAttempts,
      retryAfterSeconds: 0,
      recordAttempt: () => {},
      resetAttempts: () => {},
    };
  }

  const storageKey = `${RATE_LIMIT_PREFIX}${actionKey}`;
  const now = Date.now();

  let record: RateLimitRecord;
  try {
    const raw = localStorage.getItem(storageKey);
    record = raw
      ? JSON.parse(raw)
      : { attempts: 0, firstAttemptAt: now, lockedUntil: null };
  } catch {
    record = { attempts: 0, firstAttemptAt: now, lockedUntil: null };
  }

  // Check if currently locked
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      isLocked: true,
      remainingAttempts: 0,
      retryAfterSeconds: retryAfter,
      recordAttempt: () => {},
      resetAttempts: () => localStorage.removeItem(storageKey),
    };
  }

  // Reset window if expired
  if (now - record.firstAttemptAt > windowMs) {
    record.attempts = 0;
    record.firstAttemptAt = now;
    record.lockedUntil = null;
  }

  const isLocked = record.attempts >= maxAttempts;
  const remaining = Math.max(0, maxAttempts - record.attempts);

  return {
    isLocked,
    remainingAttempts: remaining,
    retryAfterSeconds: isLocked && record.lockedUntil ? Math.ceil((record.lockedUntil - now) / 1000) : 0,
    recordAttempt: () => {
      record.attempts += 1;
      if (record.attempts >= maxAttempts) {
        record.lockedUntil = Date.now() + lockoutDurationMs;
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(record));
      } catch (e) {
        console.warn('Could not persist rate limit state:', e);
      }
    },
    resetAttempts: () => {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    },
  };
}

/**
 * Validates password entropy and complexity
 */
export function validatePasswordSecurity(password: string): {
  isValid: boolean;
  score: number; // 0 to 4
  reasons: string[];
} {
  const reasons: string[] = [];
  if (!password) {
    return { isValid: false, score: 0, reasons: ['Password cannot be empty.'] };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  else reasons.push('Must be at least 8 characters long.');

  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 0.5;
  else reasons.push('Include at least one uppercase letter.');

  if (/[a-z]/.test(password)) score += 0.5;
  if (/[0-9]/.test(password)) score += 0.5;
  else reasons.push('Include at least one number.');

  if (/[^A-Za-z0-9]/.test(password)) score += 0.5;
  else reasons.push('Include at least one special symbol (!@#$%^&*).');

  const finalScore = Math.min(4, Math.floor(score));
  return {
    isValid: password.length >= 8 && reasons.length <= 1,
    score: finalScore,
    reasons,
  };
}
