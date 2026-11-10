import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, Heart, MailOpen, Sparkles } from 'lucide-react';
import { birthdayConfig, getFormattedLetter } from '../data/birthdayConfig';
import TeddyIllustration from './TeddyIllustration';
import { launchMiniBurst } from '../utils/effects';

export default function BirthdayLetter({
  isOpened,
  onOpenLetter,
  playChime,
}) {
  const fullLetter = useMemo(() => getFormattedLetter(), []);
  const [typedCount, setTypedCount] = useState(isOpened ? fullLetter.length : 0);
  const [showInstant, setShowInstant] = useState(isOpened);

  useEffect(() => {
    if (!isOpened) {
      setTypedCount(0);
      setShowInstant(false);
      return undefined;
    }

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced || showInstant) {
      setTypedCount(fullLetter.length);
      return undefined;
    }

    if (typedCount >= fullLetter.length) return undefined;

    const timer = window.setTimeout(() => {
      setTypedCount((c) => Math.min(fullLetter.length, c + 2));
    }, 24);
    return () => window.clearTimeout(timer);
  }, [isOpened, typedCount, showInstant, fullLetter]);

  const handleOpen = () => {
    if (isOpened) return;
    playChime?.('letter');
    launchMiniBurst({ x: 0.5, y: 0.45 });
    onOpenLetter();
  };

  const visibleText = fullLetter.slice(0, typedCount);
  const isTypingDone = typedCount >= fullLetter.length;

  return (
    <section
      aria-labelledby="letter-heading"
      className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-5 pb-4"
    >
      {/* Cozy pastel highlight glow when opened */}
      <div
        className={`rounded-[2.25rem] transition-all duration-700 ${
          isOpened
            ? 'bg-[#FFF8F3]/95 shadow-[0_20px_60px_rgba(201,107,145,0.22)]'
            : ''
        }`}
      >
        <div className="paper-card lace-border relative overflow-hidden rounded-[2.25rem] px-5 py-7 sm:px-9 sm:py-9">
          <div className="mb-5 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] px-3 py-1 text-xs font-semibold text-[#9E3C65]">
              <Heart className="h-3.5 w-3.5 fill-[#9E3C65]" aria-hidden="true" />
              <span>Birthday Friendship Note</span>
            </span>
            <h1
              id="letter-heading"
              className="font-display mt-2 text-2xl font-bold text-[#513B48] sm:text-4xl"
            >
              {birthdayConfig.letter.heading}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {!isOpened ? (
              <motion.div
                key="sealed-envelope"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center py-4 text-center"
              >
                <TeddyIllustration mood="letter" className="mb-3 h-32 w-32" />

                {/* Interactive Sealed Cream & Pink Envelope */}
                <button
                  type="button"
                  onClick={handleOpen}
                  aria-label={birthdayConfig.letter.buttonLabel}
                  className="group relative mx-auto my-2 flex h-44 w-72 flex-col items-center justify-center rounded-2xl border-2 border-[#EFA9C2] bg-[#FFF8F3] shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg sm:h-48 sm:w-80"
                >
                  {/* Envelope Top Flap */}
                  <svg
                    viewBox="0 0 320 190"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 6 L160 110 L316 6"
                      fill="#FCE4EC"
                      stroke="#EFA9C2"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 184 L125 95 M316 184 L195 95"
                      stroke="#F8C8DC"
                      strokeWidth="2.5"
                    />
                  </svg>

                  {/* Heart Wax Seal */}
                  <span className="relative z-10 mt-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[#9E3C65] text-white shadow-md transition-transform group-hover:scale-110">
                    <Heart className="h-6 w-6 fill-white" aria-hidden="true" />
                  </span>
                  <span className="font-hand relative z-10 mt-3 text-xl font-bold text-[#513B48]">
                    For {birthdayConfig.recipientName} 🎀
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleOpen}
                  className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#9E3C65] px-7 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#843054]"
                >
                  <MailOpen className="h-4 w-4" aria-hidden="true" />
                  <span>{birthdayConfig.letter.buttonLabel}</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="opened-letter"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="mx-auto max-w-xl"
              >
                {/* Stationery Paper Card */}
                <div
                  className="relative rounded-3xl border-2 border-[#F8C8DC] bg-[#FFFDF9] p-6 shadow-md sm:p-9"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(transparent 0px, transparent 31px, rgba(239, 169, 194, 0.22) 32px)',
                  }}
                >
                  <img
                    src="/stickers/heart-seal.svg"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-5 -right-3 h-12 w-12 rotate-12 drop-shadow-xs sm:h-14 sm:w-14"
                  />
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] px-3 py-1 text-xs font-semibold text-[#9E3C65]">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Special Delivery</span>
                    </span>

                    {!isTypingDone && (
                      <button
                        type="button"
                        onClick={() => setShowInstant(true)}
                        className="inline-flex min-h-9 items-center gap-1 rounded-full border border-[#EFA9C2] bg-white px-3 py-1 text-xs font-semibold text-[#513B48] hover:bg-[#FCE4EC]"
                      >
                        <FastForward className="h-3 w-3" aria-hidden="true" />
                        <span>Show Full Letter</span>
                      </button>
                    )}
                  </div>

                  <div className="font-hand text-2xl leading-[32px] whitespace-pre-line text-[#513B48] sm:text-[1.65rem]">
                    {visibleText}
                    {!isTypingDone && (
                      <span
                        aria-hidden="true"
                        className="ml-0.5 inline-block h-6 w-0.5 animate-pulse bg-[#9E3C65] align-middle"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

