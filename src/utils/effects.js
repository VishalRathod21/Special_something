import confetti from 'canvas-confetti';

const PASTEL_COLORS = [
  '#F8C8DC',
  '#EFA9C2',
  '#C96B91',
  '#E9DDF8',
  '#FFF8F3',
  '#FFD1E3',
  '#FFE2A8',
];

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function launchMiniBurst(origin = { x: 0.5, y: 0.55 }) {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 45,
    spread: 65,
    origin,
    colors: PASTEL_COLORS,
    disableForReducedMotion: true,
    scalar: 0.9,
  });
}

export function launchElementConfetti(element) {
  if (prefersReducedMotion()) return;
  if (!element || typeof element.getBoundingClientRect !== 'function') {
    launchMiniBurst();
    return;
  }
  const rect = element.getBoundingClientRect();
  const x = Math.min(0.9, Math.max(0.1, (rect.left + rect.width / 2) / window.innerWidth));
  const y = Math.min(0.9, Math.max(0.1, (rect.top + rect.height / 2) / window.innerHeight));
  launchMiniBurst({ x, y });
}

export function launchPastelConfetti() {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 80,
    spread: 85,
    origin: { y: 0.6 },
    colors: PASTEL_COLORS,
    disableForReducedMotion: true,
  });
}

export function launchBirthdayFireworks() {
  if (prefersReducedMotion()) return undefined;
  const duration = 3200;
  const animationEnd = Date.now() + duration;

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      window.clearInterval(interval);
      return;
    }
    const particleCount = Math.max(16, Math.round(38 * (timeLeft / duration)));
    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 68,
      origin: {
        x: 0.14 + Math.random() * 0.72,
        y: 0.14 + Math.random() * 0.36,
      },
      colors: PASTEL_COLORS,
      disableForReducedMotion: true,
    });
  }, 340);

  return () => window.clearInterval(interval);
}
