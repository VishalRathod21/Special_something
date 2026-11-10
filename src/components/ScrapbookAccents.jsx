import { useEffect, useState } from 'react';
import { LottieLight as Lottie } from 'lottie-react';

export function RibbonBow({ className = 'w-14 h-8' }) {
  return (
    <svg
      viewBox="0 0 120 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M52 32 C34 10, 8 18, 12 36 C16 52, 42 46, 54 35 Z"
        fill="#F8C8DC"
        stroke="#C96B91"
        strokeWidth="2.5"
      />
      <path
        d="M68 32 C86 10, 112 18, 108 36 C104 52, 78 46, 66 35 Z"
        fill="#F8C8DC"
        stroke="#C96B91"
        strokeWidth="2.5"
      />
      <path
        d="M52 36 L34 58 L46 54 L55 39 Z"
        fill="#EFA9C2"
        stroke="#C96B91"
        strokeWidth="2"
      />
      <path
        d="M68 36 L86 58 L74 54 L65 39 Z"
        fill="#EFA9C2"
        stroke="#C96B91"
        strokeWidth="2"
      />
      <circle
        cx="60"
        cy="33"
        r="9"
        fill="#EFA9C2"
        stroke="#C96B91"
        strokeWidth="2.5"
      />
    </svg>
  );
}

const TAPE_PALETTES = {
  pink: 'bg-[#F8C8DC]/85 border-[#EFA9C2]/70',
  lavender: 'bg-[#E9DDF8]/90 border-[#C9B3EC]/70',
  cream: 'bg-[#FFF3E4]/95 border-[#F2D5B8]/80',
};

export function WashiTape({ color = 'pink', className = '' }) {
  const palette = TAPE_PALETTES[color] || TAPE_PALETTES.pink;
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-5 w-20 rounded-xs border shadow-xs backdrop-blur-[1px] ${palette} ${className}`}
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.45) 6px 12px)',
      }}
    />
  );
}

export function LottieSparkleLayer({
  src = '/animations/sparkles.json',
  className = 'w-24 h-24',
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <Lottie src={src} className="h-full w-full" loop autoplay />
    </div>
  );
}
