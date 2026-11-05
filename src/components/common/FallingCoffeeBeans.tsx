import React, { useEffect, useRef } from 'react';

interface FallingCoffeeBeansProps {
  active?: boolean;
  count?: number;
  durationMs?: number;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  vRot: number;
  flip: number;
  vFlip: number;
  color: string;
  isGold: boolean;
  opacity: number;
}

const ROAST_COLORS = [
  '#2C160B', // Very dark French roast
  '#3E2214', // Rich dark espresso roast
  '#4A2A1A', // Medium-dark Vienna roast
  '#583321', // Medium Coorg roast
  '#633A26', // Cinnamon / City roast
];

export const FallingCoffeeBeans: React.FC<FallingCoffeeBeansProps> = ({
  active = true,
  count = 50,
  durationMs = 6500,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();

    // Set canvas dimensions to viewport
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize particles
    const particles: Particle[] = [];
    const w = window.innerWidth;

    for (let i = 0; i < count; i++) {
      const isGold = i % 6 === 0; // 1 in 6 is a shiny golden celebratory particle
      const baseSize = isGold ? 7 + Math.random() * 6 : 14 + Math.random() * 12;

      particles.push({
        x: Math.random() * w,
        // Stagger entrance above viewport
        y: -30 - Math.random() * (window.innerHeight * 0.9),
        vx: (Math.random() - 0.5) * 2.2,
        vy: 2.5 + Math.random() * 4.5,
        width: baseSize * 0.7,
        height: baseSize,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.08,
        flip: Math.random() * Math.PI * 2,
        vFlip: 0.04 + Math.random() * 0.06,
        color: ROAST_COLORS[Math.floor(Math.random() * ROAST_COLORS.length)] || '#3E2214',
        isGold,
        opacity: 1,
      });
    }

    const drawBean = (p: Particle) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      // Realistic 3D flip effect on x-axis
      const flipScale = Math.cos(p.flip);
      ctx.scale(Math.abs(flipScale) < 0.15 ? 0.15 : flipScale, 1);

      if (p.isGold) {
        // Gold Celebration Sparkle Star
        ctx.fillStyle = '#C89B3C';
        const s = p.height * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.35, -s * 0.35);
        ctx.lineTo(s, 0);
        ctx.lineTo(s * 0.35, s * 0.35);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.35, s * 0.35);
        ctx.lineTo(-s, 0);
        ctx.lineTo(-s * 0.35, -s * 0.35);
        ctx.closePath();
        ctx.fill();

        // Little center glint
        ctx.fillStyle = '#FFF8EB';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Roasted Coffee Bean Oval Body
        const rw = p.width;
        const rh = p.height;

        ctx.beginPath();
        ctx.ellipse(0, 0, rw / 2, rh / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // 3D edge shading
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#180B05';
        ctx.stroke();

        // Realistic curved center cleft line of coffee bean
        ctx.beginPath();
        ctx.moveTo(0, -rh / 2 + 2);
        ctx.bezierCurveTo(
          -rw * 0.22,
          -rh * 0.15,
          rw * 0.22,
          rh * 0.15,
          0,
          rh / 2 - 2
        );
        ctx.strokeStyle = '#140702';
        ctx.lineWidth = Math.max(1.5, rw * 0.14);
        ctx.lineCap = 'round';
        ctx.stroke();

        // Gentle surface sheen
        ctx.beginPath();
        ctx.moveTo(rw * 0.1, -rh * 0.3);
        ctx.bezierCurveTo(rw * 0.15, -rh * 0.1, rw * 0.15, rh * 0.1, rw * 0.08, rh * 0.25);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      ctx.restore();
    };

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = elapsed / durationMs;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      let allDone = true;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.flip += p.vFlip;

        // Subtle air drift sway
        p.vx += Math.sin(now * 0.002 + i) * 0.04;

        // Fade out toward end of animation
        if (progress > 0.75) {
          p.opacity = Math.max(0, 1 - (progress - 0.75) / 0.25);
        }

        if (p.y < window.innerHeight + 60 && p.opacity > 0) {
          allDone = false;
        }

        drawBean(p);
      }

      if (progress < 1 && !allDone) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (onComplete) onComplete();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, count, durationMs, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
      aria-hidden="true"
    />
  );
};
