import { useEffect, useRef, useState } from 'react';

const SPARKLE_COLORS = ['#F8C8DC', '#EFA9C2', '#C96B91', '#E9DDF8', '#FFE2A8'];
const MAX_PARTICLES = 36;

function drawFourPointStar(ctx, x, y, radius) {
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const r = i % 2 === 0 ? radius : radius * 0.36;
    const angle = (i * Math.PI) / 4;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Lightweight desktop-only cursor sparkle canvas.
 * Spawns only for mouse/pen pointers, stops rAF when idle (0% CPU),
 * and stays disabled when prefers-reduced-motion: reduce is active.
 */
export default function CursorSparkles() {
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointerMq = window.matchMedia('(any-pointer: fine)');

    const syncCapability = () => {
      setEnabled(!reducedMotionMq.matches);
    };

    syncCapability();
    reducedMotionMq.addEventListener('change', syncCapability);
    finePointerMq.addEventListener('change', syncCapability);

    return () => {
      reducedMotionMq.removeEventListener('change', syncCapability);
      finePointerMq.removeEventListener('change', syncCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const particles = [];
    let rafId = null;
    let lastSpawn = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.025;
        p.life -= p.decay;
        p.rotation += p.spin;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        if (p.kind === 'dot') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawFourPointStar(ctx, 0, 0, p.size);
        }
        ctx.restore();
      }

      if (particles.length > 0) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const handlePointerMove = (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        return;
      }
      const now = performance.now();
      if (now - lastSpawn < 32) return;
      lastSpawn = now;

      const count = particles.length < MAX_PARTICLES - 2 ? 2 : 1;
      for (let i = 0; i < count; i += 1) {
        if (particles.length >= MAX_PARTICLES) particles.shift();
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 14,
          y: e.clientY + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 0.9,
          vy: -0.35 - Math.random() * 0.65,
          size: 4 + Math.random() * 4.5,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.08,
          life: 0.9,
          decay: 0.028 + Math.random() * 0.015,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          kind: Math.random() > 0.32 ? 'star' : 'dot',
        });
      }

      if (rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
