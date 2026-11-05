import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, Navigate } from '@tanstack/react-router';
import { ShieldCheck, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { checkRateLimit } from '../../lib/services/security-service';

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
});

function isStorefrontDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return host === 'coorgcoffees.in' || host === 'www.coorgcoffees.in';
}

function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin, isAdminLoggedIn } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutCountdown, setLockoutCountdown] = useState<number>(0);

  // Check rate limit on mount
  useEffect(() => {
    const rateCheck = checkRateLimit('admin_login', 10, 15 * 60 * 1000, 2 * 60 * 1000);
    if (rateCheck.isLocked) {
      setLockoutCountdown(rateCheck.retryAfterSeconds);
    }
  }, []);

  // Live countdown timer for lockout duration
  useEffect(() => {
    if (lockoutCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockoutCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutCountdown]);

  // Never allow admin login to render on the public storefront domain
  if (isStorefrontDomain()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#12100E] px-4 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-7xl font-display font-bold text-[#C89B3C]">404</h1>
          <h2 className="text-xl font-semibold text-white">Page not found</h2>
          <p className="text-sm text-[#8E7E6E]">
            The requested page does not exist or has been removed.
          </p>
          <div>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#C89B3C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#b08732]"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = password.trim();

    // If correct passphrase, authenticate immediately and clear any lockout
    const success = loginAdmin(cleanPass);
    if (success) {
      const rateCheck = checkRateLimit('admin_login', 10, 15 * 60 * 1000, 2 * 60 * 1000);
      rateCheck.resetAttempts();
      navigate({ to: '/admin' });
      return;
    }

    // Invalid attempt: enforce rate limit & brute force lockout
    const rateCheck = checkRateLimit('admin_login', 10, 15 * 60 * 1000, 2 * 60 * 1000);
    if (rateCheck.isLocked) {
      setErrorMsg(`Brute-force protection: Login locked for ${rateCheck.retryAfterSeconds} seconds.`);
      setLockoutCountdown(rateCheck.retryAfterSeconds);
      return;
    }

    rateCheck.recordAttempt();
    const updatedCheck = checkRateLimit('admin_login', 10, 15 * 60 * 1000, 2 * 60 * 1000);
    if (updatedCheck.isLocked) {
      setLockoutCountdown(updatedCheck.retryAfterSeconds);
      setErrorMsg(`Too many failed attempts. Security lockout active for ${updatedCheck.retryAfterSeconds}s.`);
    } else {
      setErrorMsg(`Invalid Admin Passphrase. Access denied. (${updatedCheck.remainingAttempts} attempts remaining)`);
    }
  };

  return (
    <div className="min-h-screen bg-[#12100E] text-[#E8D9C5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1C1612] border border-[#3D3025] rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <img
            src="/coorg-logo-circle.png"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== '/coorg-logo.jpg') target.src = '/coorg-logo.jpg';
            }}
            alt="Authentic Coorg Coffee Logo"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#C89B3C] shadow-xl shadow-[#C89B3C]/20 bg-white p-1 mx-auto"
          />
          <h1 className="font-display text-2xl text-white tracking-wider font-bold">COORG ESTATE CONSOLE</h1>
          <p className="text-xs text-[#B5A490]">
            Gated management console for estate orders, stock, and DTDC shipping.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1 text-[#E8D9C5]">Admin Passphrase</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter master admin passphrase..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                disabled={lockoutCountdown > 0}
                className="w-full pl-9 pr-10 py-3 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={lockoutCountdown > 0}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C89B3C] transition-colors cursor-pointer disabled:opacity-30"
                title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={lockoutCountdown > 0}
            className="w-full py-3.5 rounded-xl bg-[#C89B3C] text-black font-extrabold uppercase tracking-widest hover:bg-[#b08732] transition-colors shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {lockoutCountdown > 0 ? `LOCKED OUT (${lockoutCountdown}s)` : 'LOG IN TO CONSOLE'}
          </button>
        </form>

        <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-[#B5A490]">
          <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
          <span>Encrypted Session • Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
}
