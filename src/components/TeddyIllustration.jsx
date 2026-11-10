import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TEDDY_MESSAGES = [
  'Happy Birthday, Vanshika! Wishing you a super joyful day! 🎂',
  'Teddy is cheering for your bright future as an amazing nurse! 🩺✨',
  'Hope your day is filled with smiles, cake, and great music! 🎀',
  'Sending warm friendship cheers and pastel sparkles your way! 🧸💗',
  'Keep shining, keep smiling, and enjoy every bit of today! 🌟',
  'You deserve the happiest birthday celebration, Vanshika! 🎉',
];

/**
 * Bespoke kawaii pastel teddy bear SVG illustration with blinking eyes,
 * scene-specific poses/props, and click-for-birthday-message interaction.
 */
export default function TeddyIllustration({
  mood = 'wave',
  className = 'w-36 h-36',
  animated = true,
  interactive = true,
  bubblePlacement = 'top',
}) {
  const uid = useId().replace(/:/g, '');
  const furId = `teddyFur-${uid}`;
  const bellyId = `teddyBelly-${uid}`;

  const [msgIndex, setMsgIndex] = useState(null);

  useEffect(() => {
    if (msgIndex === null) return undefined;
    const timer = window.setTimeout(() => {
      setMsgIndex(null);
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [msgIndex]);

  const handleTeddyTap = () => {
    if (!interactive) return;
    setMsgIndex((prev) => {
      let next = Math.floor(Math.random() * TEDDY_MESSAGES.length);
      if (next === prev) {
        next = (next + 1) % TEDDY_MESSAGES.length;
      }
      return next;
    });
  };

  const showHeadphones = mood === 'dj';
  const showCamera = mood === 'camera';
  const showPartyHat = mood === 'cake' || mood === 'party';
  const showEnvelope = mood === 'letter';
  const showNurse = mood === 'nurse';
  const showStar = mood === 'wish';
  const showGift = mood === 'gift';
  const isWaving = mood === 'wave' || mood === 'party';

  const svgContent = (
    <svg
      viewBox="0 0 220 220"
      className={`${className} ${animated ? 'anim-gentle-bob' : ''} select-none drop-shadow-[0_10px_18px_rgba(201,107,145,0.22)]`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={furId} cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F3D1BA" />
          <stop offset="70%" stopColor="#E4B596" />
          <stop offset="100%" stopColor="#D69F7E" />
        </radialGradient>
        <radialGradient id={bellyId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="100%" stopColor="#FCEEE5" />
        </radialGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="110" cy="202" rx="56" ry="10" fill="#EFA9C2" opacity="0.28" />

      {/* Ears */}
      <g>
        <circle cx="62" cy="58" r="24" fill={`url(#${furId})`} />
        <circle cx="62" cy="58" r="13" fill="#F8C8DC" />
        <circle cx="158" cy="58" r="24" fill={`url(#${furId})`} />
        <circle cx="158" cy="58" r="13" fill="#F8C8DC" />
      </g>

      {/* DJ Headphones band */}
      {showHeadphones && (
        <path
          d="M46 92 C46 34, 174 34, 174 92"
          fill="none"
          stroke="#C96B91"
          strokeWidth="9"
          strokeLinecap="round"
        />
      )}

      {/* Nurse Cap */}
      {showNurse && (
        <g transform="translate(76 14)">
          <path
            d="M8 32 L14 8 Q34 2 54 8 L60 32 Z"
            fill="#FFFFFF"
            stroke="#C96B91"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <rect x="29" y="13" width="10" height="10" rx="2" fill="#F8C8DC" />
          <path
            d="M34 15 V21 M31 18 H37"
            stroke="#9E3C65"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Party Hat */}
      {showPartyHat && (
        <g transform="translate(88 6) rotate(-8 22 40)">
          <polygon
            points="22,0 44,44 0,44"
            fill="#F8C8DC"
            stroke="#C96B91"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="28" r="3.5" fill="#FFF8F3" />
          <circle cx="28" cy="34" r="3" fill="#E9DDF8" />
          <circle cx="22" cy="18" r="2.8" fill="#FFFFFF" />
          <circle cx="22" cy="0" r="7" fill="#C96B91" />
        </g>
      )}

      {/* Body */}
      <ellipse cx="110" cy="154" rx="48" ry="44" fill={`url(#${furId})`} />
      <ellipse cx="110" cy="158" rx="29" ry="27" fill={`url(#${bellyId})`} />

      {/* Tiny heart on tummy */}
      {!showGift && (
        <path
          d="M110 166 C110 166 98 158 98 150 C98 146 101 143 105 143 C108 143 110 145 110 147 C110 145 112 143 115 143 C119 143 122 146 122 150 C122 158 110 166 110 166 Z"
          fill="#F8C8DC"
        />
      )}

      {/* Feet */}
      <g>
        <ellipse cx="78" cy="190" rx="18" ry="13" fill={`url(#${furId})`} />
        <ellipse cx="78" cy="190" rx="10" ry="7" fill="#FCE4EC" />
        <ellipse cx="142" cy="190" rx="18" ry="13" fill={`url(#${furId})`} />
        <ellipse cx="142" cy="190" rx="10" ry="7" fill="#FCE4EC" />
      </g>

      {/* Arms (hug birthday gift cleanly when mood === 'gift') */}
      {showGift ? (
        <>
          <g transform="translate(80 143)">
            <rect
              x="0"
              y="10"
              width="60"
              height="40"
              rx="8"
              fill="#F8C8DC"
              stroke="#9E3C65"
              strokeWidth="2.2"
            />
            <rect
              x="-3"
              y="4"
              width="66"
              height="12"
              rx="5"
              fill="#FCE4EC"
              stroke="#9E3C65"
              strokeWidth="2.2"
            />
            <rect x="26" y="4" width="8" height="46" fill="#9E3C65" />
            <ellipse
              cx="23"
              cy="1"
              rx="8"
              ry="5"
              fill="#EFA9C2"
              stroke="#9E3C65"
              strokeWidth="1.8"
            />
            <ellipse
              cx="37"
              cy="1"
              rx="8"
              ry="5"
              fill="#EFA9C2"
              stroke="#9E3C65"
              strokeWidth="1.8"
            />
            <circle cx="30" cy="2" r="3.5" fill="#9E3C65" />
          </g>
          <ellipse
            cx="74"
            cy="163"
            rx="14"
            ry="18"
            transform="rotate(-18 74 163)"
            fill={`url(#${furId})`}
          />
          <ellipse
            cx="146"
            cy="163"
            rx="14"
            ry="18"
            transform="rotate(18 146 163)"
            fill={`url(#${furId})`}
          />
        </>
      ) : (
        <>
          {/* Left Arm */}
          <ellipse
            cx="60"
            cy="144"
            rx="16"
            ry="24"
            transform="rotate(24 60 144)"
            fill={`url(#${furId})`}
          />

          {/* Right Arm (waving if welcome/party) */}
          <g className={isWaving && animated ? 'anim-teddy-wave' : ''}>
            <ellipse
              cx={isWaving ? '168' : '160'}
              cy={isWaving ? '122' : '144'}
              rx="16"
              ry="24"
              transform={
                isWaving ? 'rotate(42 168 122)' : 'rotate(-24 160 144)'
              }
              fill={`url(#${furId})`}
            />
            {isWaving && (
              <circle cx="177" cy="107" r="6" fill="#FCE4EC" opacity="0.85" />
            )}
          </g>
        </>
      )}

      {/* Head */}
      <ellipse cx="110" cy="96" rx="54" ry="47" fill={`url(#${furId})`} />

      {/* DJ Ear Cups */}
      {showHeadphones && (
        <g>
          <rect
            x="38"
            y="76"
            width="18"
            height="34"
            rx="9"
            fill="#F8C8DC"
            stroke="#C96B91"
            strokeWidth="2.5"
          />
          <rect
            x="164"
            y="76"
            width="18"
            height="34"
            rx="9"
            fill="#F8C8DC"
            stroke="#C96B91"
            strokeWidth="2.5"
          />
        </g>
      )}

      {/* Pink Satin Ear Bow */}
      {!showPartyHat && !showNurse && (
        <g transform="translate(132 45) rotate(18)">
          <ellipse
            cx="8"
            cy="10"
            rx="9"
            ry="7"
            fill="#F8C8DC"
            stroke="#C96B91"
            strokeWidth="1.8"
          />
          <ellipse
            cx="26"
            cy="10"
            rx="9"
            ry="7"
            fill="#F8C8DC"
            stroke="#C96B91"
            strokeWidth="1.8"
          />
          <circle cx="17" cy="10" r="4.5" fill="#C96B91" />
        </g>
      )}

      {/* Muzzle */}
      <ellipse cx="110" cy="108" rx="22" ry="17" fill={`url(#${bellyId})`} />

      {/* Blinking Eyes */}
      <g className="anim-teddy-blink">
        <circle cx="88" cy="90" r="6" fill="#513B48" />
        <circle cx="86" cy="88" r="2" fill="#FFFFFF" />
        <circle cx="132" cy="90" r="6" fill="#513B48" />
        <circle cx="130" cy="88" r="2" fill="#FFFFFF" />
      </g>

      {/* Rosy Cheeks */}
      <ellipse cx="73" cy="102" rx="9" ry="5.5" fill="#EFA9C2" opacity="0.72" />
      <ellipse
        cx="147"
        cy="102"
        rx="9"
        ry="5.5"
        fill="#EFA9C2"
        opacity="0.72"
      />

      {/* Nose & Cute Smile */}
      <ellipse cx="110" cy="103" rx="6" ry="4.2" fill="#513B48" />
      <path
        d="M110 107 L110 112 M102 113 Q106 117 110 112 Q114 117 118 113"
        fill="none"
        stroke="#513B48"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bowtie around neck (hidden when wearing nurse uniform or holding gift) */}
      {!showNurse && !showGift && (
        <g transform="translate(89 131)">
          <path
            d="M16 9 L0 2 L0 16 Z"
            fill="#EFA9C2"
            stroke="#C96B91"
            strokeWidth="1.6"
          />
          <path
            d="M26 9 L42 2 L42 16 Z"
            fill="#EFA9C2"
            stroke="#C96B91"
            strokeWidth="1.6"
          />
          <circle cx="21" cy="9" r="4.5" fill="#C96B91" />
        </g>
      )}

      {/* Nurse Uniform Collar & Stethoscope */}
      {showNurse && (
        <g>
          <path
            d="M72 137 Q110 150 148 137 L152 178 Q110 190 68 178 Z"
            fill="#FCE4EC"
            stroke="#C96B91"
            strokeWidth="2.2"
          />
          <path
            d="M90 140 L110 154 L130 140"
            fill="#FFFFFF"
            stroke="#C96B91"
            strokeWidth="1.8"
          />
          <path
            d="M84 134 C76 150 84 169 110 169 C136 169 144 150 136 134"
            fill="none"
            stroke="#9E3C65"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="110"
            y1="169"
            x2="110"
            y2="183"
            stroke="#9E3C65"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle
            cx="110"
            cy="187"
            r="7"
            fill="#FFFFFF"
            stroke="#9E3C65"
            strokeWidth="2.5"
          />
          <circle cx="110" cy="187" r="3" fill="#F8C8DC" />
        </g>
      )}

      {/* Scene Props */}
      {showCamera && (
        <g transform="translate(132 130) rotate(-10)">
          <rect
            x="0"
            y="6"
            width="44"
            height="30"
            rx="8"
            fill="#FCE4EC"
            stroke="#C96B91"
            strokeWidth="2.2"
          />
          <rect
            x="14"
            y="0"
            width="16"
            height="8"
            rx="3"
            fill="#F8C8DC"
            stroke="#C96B91"
            strokeWidth="1.8"
          />
          <circle
            cx="22"
            cy="21"
            r="9"
            fill="#FFFFFF"
            stroke="#C96B91"
            strokeWidth="2.2"
          />
          <circle cx="22" cy="21" r="4.5" fill="#E9DDF8" />
          <circle cx="35" cy="13" r="2.5" fill="#C96B91" />
        </g>
      )}

      {showEnvelope && (
        <g transform="translate(76 146)">
          <rect
            x="0"
            y="0"
            width="68"
            height="44"
            rx="8"
            fill="#FFF8F3"
            stroke="#C96B91"
            strokeWidth="2.2"
          />
          <path
            d="M2 2 L34 25 L66 2"
            fill="none"
            stroke="#EFA9C2"
            strokeWidth="2.2"
          />
          <circle cx="34" cy="25" r="7.5" fill="#C96B91" />
          <path
            d="M34 28 C34 28 29.5 25 29.5 22.5 C29.5 21 31 20 32.5 20 C33.5 20 34 20.8 34 21.4 C34 20.8 34.5 20 35.5 20 C37 20 38.5 21 38.5 22.5 C38.5 25 34 28 34 28 Z"
            fill="#FFF8F3"
          />
        </g>
      )}

      {showStar && (
        <g transform="translate(148 118)">
          <line
            x1="16"
            y1="24"
            x2="4"
            y2="56"
            stroke="#C96B91"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M18 0 L23 12 L36 13 L26 21 L29 34 L18 27 L7 34 L10 21 L0 13 L13 12 Z"
            fill="#FFE6B3"
            stroke="#C96B91"
            strokeWidth="2"
          />
        </g>
      )}

      {mood === 'peek' && (
        <g transform="translate(88 150)">
          <rect
            x="4"
            y="14"
            width="36"
            height="28"
            rx="8"
            fill="#F8C8DC"
            stroke="#9E3C65"
            strokeWidth="2.2"
          />
          <path
            d="M12 14 V8 A10 10 0 0 1 32 8 V14"
            fill="none"
            stroke="#9E3C65"
            strokeWidth="3"
          />
          <circle cx="22" cy="27" r="3.5" fill="#9E3C65" />
        </g>
      )}
    </svg>
  );

  if (!interactive) {
    return svgContent;
  }

  const bubblePositionClass =
    bubblePlacement === 'bottom'
      ? 'top-full mt-1.5'
      : 'bottom-full mb-1.5';

  return (
    <div className="relative inline-flex flex-col items-center">
      <AnimatePresence>
        {msgIndex !== null && (
          <motion.div
            key={msgIndex}
            role="status"
            initial={{ opacity: 0, y: bubblePlacement === 'bottom' ? -6 : 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`pointer-events-none absolute left-1/2 z-30 w-max max-w-[13.5rem] -translate-x-1/2 rounded-2xl border-2 border-[#EFA9C2] bg-white/98 px-3 py-2 text-center text-xs leading-snug font-semibold text-[#513B48] shadow-md ${bubblePositionClass}`}
          >
            {TEDDY_MESSAGES[msgIndex]}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleTeddyTap}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Tap teddy for a cute birthday message"
        className="group relative inline-flex cursor-pointer items-center justify-center rounded-3xl focus-visible:outline-3"
      >
        {svgContent}
      </motion.button>
    </div>
  );
}
