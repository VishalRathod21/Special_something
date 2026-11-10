import { Heart, Sparkles, Star } from 'lucide-react';
import CursorSparkles from './CursorSparkles';

function FlowerPetal({ color, left, delay, duration }) {
  return (
    <svg
      viewBox="0 0 24 28"
      aria-hidden="true"
      style={{
        left,
        animationDelay: delay,
        animationDuration: duration,
      }}
      className="anim-petal pointer-events-none absolute -top-8 h-5 w-4 opacity-0 select-none"
    >
      <path
        d="M12 2 C19 6, 22 16, 15 24 C12 27, 9 27, 7 23 C2 16, 5 6, 12 2 Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/**
 * Ambient pastel hearts, stars, sparkles, clouds, occasional flower petals,
 * and desktop cursor sparkles — strictly non-blocking (pointer-events: none).
 */
export default function FloatingDecorations({ density = 'normal' }) {
  const items =
    density === 'festive'
      ? [
          { id: 'd1', type: 'heart', top: '8%', left: '6%', size: 22, delay: '0s' },
          { id: 'd2', type: 'star', top: '14%', right: '8%', size: 20, delay: '0.6s' },
          { id: 'd3', type: 'sparkle', top: '34%', left: '4%', size: 18, delay: '1.1s' },
          { id: 'd4', type: 'heart', top: '42%', right: '5%', size: 20, delay: '1.5s' },
          { id: 'd5', type: 'star', bottom: '18%', left: '8%', size: 18, delay: '0.9s' },
          { id: 'd6', type: 'heart', bottom: '12%', right: '7%', size: 24, delay: '0.3s' },
          { id: 'd7', type: 'sparkle', top: '20%', left: '18%', size: 15, delay: '1.9s' },
          { id: 'd8', type: 'star', bottom: '28%', right: '14%', size: 16, delay: '1.3s' },
        ]
      : [
          { id: 'd1', type: 'heart', top: '12%', left: '5%', size: 18, delay: '0s' },
          { id: 'd2', type: 'star', top: '16%', right: '6%', size: 18, delay: '0.8s' },
          { id: 'd3', type: 'sparkle', bottom: '20%', left: '6%', size: 16, delay: '1.2s' },
          { id: 'd4', type: 'heart', bottom: '16%', right: '6%', size: 19, delay: '0.5s' },
        ];

  const petals =
    density === 'festive'
      ? [
          { id: 'p1', color: '#F8C8DC', left: '14%', delay: '0s', duration: '12s' },
          { id: 'p2', color: '#FCE4EC', left: '36%', delay: '3.2s', duration: '14s' },
          { id: 'p3', color: '#E9DDF8', left: '62%', delay: '1.8s', duration: '13s' },
          { id: 'p4', color: '#F8C8DC', left: '84%', delay: '5.1s', duration: '15s' },
        ]
      : [
          { id: 'p1', color: '#F8C8DC', left: '16%', delay: '1.2s', duration: '14s' },
          { id: 'p2', color: '#E9DDF8', left: '78%', delay: '5.5s', duration: '15s' },
        ];

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Subtle floating clouds */}
        <div
          className="anim-cloud absolute -top-6 left-[8%] h-14 w-36 rounded-full bg-white/55 blur-[1px]"
          style={{ boxShadow: '26px 8px 0 6px rgba(255,255,255,0.45)' }}
        />
        <div
          className="anim-cloud absolute top-[22%] right-[5%] hidden h-12 w-28 rounded-full bg-white/45 blur-[1px] md:block"
          style={{
            animationDelay: '1.6s',
            boxShadow: '20px 6px 0 4px rgba(255,255,255,0.4)',
          }}
        />

        {/* Occasional pastel flower petals */}
        {petals.map((petal) => (
          <FlowerPetal
            key={petal.id}
            color={petal.color}
            left={petal.left}
            delay={petal.delay}
            duration={petal.duration}
          />
        ))}

        {items.map((item) => {
          const pos = {
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            animationDelay: item.delay,
          };
          if (item.type === 'heart') {
            return (
              <Heart
                key={item.id}
                size={item.size}
                style={pos}
                className="anim-float-heart absolute fill-[#F8C8DC]/75 text-[#EFA9C2]"
              />
            );
          }
          if (item.type === 'star') {
            return (
              <Star
                key={item.id}
                size={item.size}
                style={pos}
                className="anim-twinkle absolute fill-[#E9DDF8]/90 text-[#C96B91]/60"
              />
            );
          }
          return (
            <Sparkles
              key={item.id}
              size={item.size}
              style={pos}
              className="anim-twinkle absolute text-[#C96B91]/65"
            />
          );
        })}
      </div>
      <CursorSparkles />
    </>
  );
}
