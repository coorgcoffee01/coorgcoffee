/**
 * Payment Audio Feedback System
 * Provides instant, satisfying audio feedback upon payment completion.
 * Combines an optimized audio file playback with a synthesized Web Audio fallback.
 */

let cachedAudio: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;

/**
 * Prime audio context on user interaction (e.g. clicking Pay Now)
 * Ensures sound plays smoothly on mobile Safari / Chrome without autoplay block.
 */
export function primeAudio() {
  try {
    if (typeof window === 'undefined') return;

    // Pre-create and unlock HTMLAudio
    if (!cachedAudio) {
      cachedAudio = new Audio('/sounds/payment-success.wav');
      cachedAudio.preload = 'auto';
      cachedAudio.volume = 0.85;
    }

    // Initialize or resume AudioContext
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      if (!audioContext) {
        audioContext = new AudioCtx();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }
  } catch (err) {
    console.debug('[Audio] Prime notice:', err);
  }
}

/**
 * Web Audio API synthesized payment chime
 * Joyful 4-stage ascending chime (C5 -> E5 -> G5 -> C6) with register clink transient
 */
function playSynthesizedPaymentChime(): boolean {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return false;

    if (!audioContext || audioContext.state === 'closed') {
      audioContext = new AudioCtx();
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const ctx = audioContext;
    const now = ctx.currentTime;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, now);
    masterGain.connect(ctx.destination);

    // 1. Initial metallic coin / register clink
    const clinkFreqs = [2800, 3900, 5200];
    clinkFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    });

    // 2. Uplifting 4-note ascending bell chime (C5 -> E5 -> G5 -> C6)
    const chordNotes = [
      { freq: 523.25, time: 0.10, dur: 0.7 }, // C5
      { freq: 659.25, time: 0.20, dur: 0.7 }, // E5
      { freq: 783.99, time: 0.30, dur: 0.8 }, // G5
      { freq: 1046.50, time: 0.40, dur: 1.1 }, // C6 (sparkling octave)
    ];

    chordNotes.forEach(({ freq, time, dur }) => {
      const noteTime = now + time;

      // Fundamental tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.35, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

      // Bell shimmer harmonic
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(freq * 2, noteTime);

      shimmerGain.gain.setValueAtTime(0.001, noteTime);
      shimmerGain.gain.exponentialRampToValueAtTime(0.12, noteTime + 0.015);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur * 0.7);

      osc.connect(gain);
      shimmer.connect(shimmerGain);

      gain.connect(masterGain);
      shimmerGain.connect(masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + dur);
      shimmer.start(noteTime);
      shimmer.stop(noteTime + dur);
    });

    return true;
  } catch (err) {
    console.debug('[Audio] Synthesizer error:', err);
    return false;
  }
}

/**
 * Play payment completion sound effect.
 * Uses the preloaded high-fidelity WAV file with instant Web Audio fallback.
 */
export function playPaymentSuccessSound() {
  if (typeof window === 'undefined') return;

  try {
    // 1. Try playing audio element
    if (!cachedAudio) {
      cachedAudio = new Audio('/sounds/payment-success.wav');
      cachedAudio.volume = 0.85;
    }

    cachedAudio.currentTime = 0;
    const playPromise = cachedAudio.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.debug('[Audio] HTML5 audio blocked or delayed, using Web Audio synthesizer:', err);
        playSynthesizedPaymentChime();
      });
    }
  } catch (e) {
    // Fallback directly to Web Audio synth
    playSynthesizedPaymentChime();
  }
}
