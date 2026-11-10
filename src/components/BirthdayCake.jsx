import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Mic, MicOff, RotateCcw, Sparkles, Utensils } from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import TeddyIllustration from './TeddyIllustration';
import { launchPastelConfetti } from '../utils/effects';

export default function BirthdayCake({
  isExtinguished,
  onExtinguish,
  onRelight,
  playChime,
}) {
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState('');
  const [blowLevel, setBlowLevel] = useState(0);
  const [justExtinguished, setJustExtinguished] = useState(false);

  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);

  const stopMic = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setMicActive(false);
    setBlowLevel(0);
  };

  useEffect(() => {
    return () => stopMic();
  }, []);

  const extinguishCandle = () => {
    if (isExtinguished) return;
    stopMic();
    setJustExtinguished(true);
    onExtinguish();
    playChime?.('wish');
    launchPastelConfetti();
  };

  const handleRelight = () => {
    setJustExtinguished(false);
    setMicError('');
    onRelight();
  };

  const startMicBlowDetection = async () => {
    if (isExtinguished) return;
    if (micActive) {
      stopMic();
      return;
    }
    setMicError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Microphone detection is unavailable here — tap the candle instead!');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      setMicActive(true);

      let sustainedFrames = 0;
      const monitor = () => {
        if (!streamRef.current) return;
        analyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i += 1) {
          sum += buffer[i];
        }
        const avg = sum / buffer.length;
        const normalized = Math.min(100, Math.round((avg / 95) * 100));
        setBlowLevel(normalized);

        if (avg > 44) {
          sustainedFrames += 1;
        } else {
          sustainedFrames = Math.max(0, sustainedFrames - 1);
        }

        if (sustainedFrames >= 7) {
          extinguishCandle();
          return;
        }

        rafRef.current = requestAnimationFrame(monitor);
      };

      rafRef.current = requestAnimationFrame(monitor);
    } catch {
      stopMic();
      setMicError(
        'Microphone permission was declined or unavailable — tapping the candle works just as magically!'
      );
    }
  };

  return (
    <section
      aria-labelledby="cake-heading"
      className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-5 pb-4"
    >
      <div className="paper-card lace-border relative overflow-hidden rounded-[2.25rem] px-5 py-7 text-center sm:px-9 sm:py-9">
        <div className="mb-2 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] px-3 py-1 text-xs font-semibold text-[#9E3C65]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Birthday Wish Ritual</span>
          </span>
        </div>

        <h1
          id="cake-heading"
          className="font-display text-2xl font-bold text-[#513B48] sm:text-4xl"
        >
          {birthdayConfig.cake.heading} 🎂
        </h1>
        <p className="mx-auto mt-1.5 max-w-lg text-sm text-[#6F5564] sm:text-base">
          {birthdayConfig.cake.subheading}
        </p>

        {/* Cake Stage + Teddy Helper */}
        <div className="relative mx-auto mt-6 flex max-w-md flex-col items-center justify-center overflow-hidden rounded-3xl border border-[#F8C8DC] bg-[#FFF8F3] px-4 pt-6 pb-6 shadow-inner">
          {/* Decorative Pink Balloons & Floating Stars */}
          <svg
            viewBox="0 0 46 72"
            aria-hidden="true"
            className="anim-balloon pointer-events-none absolute top-3 left-3 h-14 w-9 opacity-85"
          >
            <path d="M23 50 Q20 62 24 71" fill="none" stroke="#C96B91" strokeWidth="1.5" />
            <ellipse cx="23" cy="26" rx="18" ry="23" fill="#F8C8DC" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
          <svg
            viewBox="0 0 46 72"
            aria-hidden="true"
            style={{ animationDelay: '0.8s' }}
            className="anim-balloon pointer-events-none absolute top-3 right-3 h-14 w-9 opacity-85"
          >
            <path d="M23 50 Q26 62 22 71" fill="none" stroke="#C96B91" strokeWidth="1.5" />
            <ellipse cx="23" cy="26" rx="18" ry="23" fill="#EFA9C2" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
          <img
            src="/stickers/star-sparkle.svg"
            alt=""
            aria-hidden="true"
            className="anim-twinkle pointer-events-none absolute bottom-14 left-4 h-7 w-7 opacity-80"
          />
          <img
            src="/stickers/star-sparkle.svg"
            alt=""
            aria-hidden="true"
            style={{ animationDelay: '0.7s' }}
            className="anim-twinkle pointer-events-none absolute right-4 bottom-16 h-6 w-6 opacity-80"
          />

          <div className="flex w-full flex-col-reverse items-center justify-center gap-2 sm:flex-row sm:items-end sm:gap-5">
            <TeddyIllustration
              mood="cake"
              className="h-20 w-20 shrink-0 sm:h-28 sm:w-28"
            />

            {/* Interactive Cake Button */}
            <motion.button
              type="button"
              whileHover={!isExtinguished ? { scale: 1.025 } : undefined}
              whileTap={!isExtinguished ? { scale: 0.985 } : undefined}
              onClick={extinguishCandle}
              disabled={isExtinguished}
              aria-label={
                isExtinguished
                  ? 'Birthday candle extinguished'
                  : 'Tap to blow out the birthday candle'
              }
              className="group relative flex flex-col items-center rounded-3xl p-2 transition-transform focus-visible:outline-3 disabled:cursor-default"
            >
              {/* Candle & Flame */}
              <div className="relative z-20 -mb-2.5 flex flex-col items-center">
                {!isExtinguished ? (
                  <div className="anim-candle-flame relative mb-0.5 flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-3 rounded-full bg-[#FFD166]/35 blur-md"
                    />
                    <span className="relative h-8 w-5 rounded-full bg-gradient-to-t from-[#FF9A62] via-[#FFD166] to-[#FFF6CC] shadow-[0_0_20px_rgba(255,193,102,0.92)]" />
                    <span className="relative -mt-4 h-3.5 w-2 rounded-full bg-white/85" />
                  </div>
                ) : (
                  <div className="relative h-8 w-8">
                    {justExtinguished && (
                      <>
                        <span
                          aria-hidden="true"
                          className="anim-smoke mx-auto block h-5 w-3 rounded-full bg-[#C96B91]/40 blur-[2px]"
                        />
                        <span
                          aria-hidden="true"
                          style={{ animationDelay: '0.18s' }}
                          className="anim-smoke absolute top-1 left-1 h-4 w-2.5 rounded-full bg-[#EFA9C2]/45 blur-[2px]"
                        />
                        <span
                          aria-hidden="true"
                          style={{ animationDelay: '0.32s' }}
                          className="anim-smoke absolute top-0 right-1 h-3.5 w-2 rounded-full bg-[#9E3C65]/30 blur-[1.5px]"
                        />
                      </>
                    )}
                  </div>
                )}
                {/* Striped Pink Candle */}
                <div
                  className="h-12 w-4 rounded-t-md border-2 border-[#C96B91] shadow-xs"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(-45deg, #FFF8F3 0 5px, #F8C8DC 5px 10px)',
                  }}
                />
              </div>

              {/* Strawberry Pink 2-Tier Cake SVG */}
              <svg
                viewBox="0 34 240 140"
                className="h-36 w-56 drop-shadow-md sm:h-40 sm:w-64"
                aria-hidden="true"
              >
                {/* Cake Stand */}
                <ellipse cx="120" cy="158" rx="95" ry="12" fill="#FFFFFF" stroke="#EFA9C2" strokeWidth="2.5" />
                <rect x="104" y="158" width="32" height="12" rx="4" fill="#FCE4EC" />

                {/* Bottom Tier */}
                <rect x="38" y="96" width="164" height="58" rx="18" fill="#F8C8DC" stroke="#C96B91" strokeWidth="2.5" />
                {/* Frosting Drips Bottom */}
                <path
                  d="M38 104 Q52 120 66 104 Q80 124 94 104 Q108 120 120 104 Q134 124 148 104 Q162 120 176 104 Q190 120 202 104 V96 H38 Z"
                  fill="#FFF8F3"
                />
                {/* Cute Dots on Bottom Tier */}
                <circle cx="70" cy="134" r="4" fill="#FFFFFF" opacity="0.8" />
                <circle cx="120" cy="136" r="4.5" fill="#9E3C65" opacity="0.65" />
                <circle cx="170" cy="134" r="4" fill="#FFFFFF" opacity="0.8" />

                {/* Top Tier */}
                <rect x="64" y="46" width="112" height="50" rx="15" fill="#EFA9C2" stroke="#C96B91" strokeWidth="2.5" />
                {/* Frosting Drips Top */}
                <path
                  d="M64 56 Q76 72 88 56 Q102 74 114 56 Q126 70 138 56 Q152 74 164 56 Q172 68 176 56 V46 H64 Z"
                  fill="#FFF8F3"
                />

                {/* Strawberries */}
                <circle cx="84" cy="44" r="8" fill="#D95D82" />
                <circle cx="156" cy="44" r="8" fill="#D95D82" />
                <path d="M80 37 L84 40 L88 37" stroke="#6B9E78" strokeWidth="2.5" fill="none" />
                <path d="M152 37 L156 40 L160 37" stroke="#6B9E78" strokeWidth="2.5" fill="none" />

                {/* Heart Badge */}
                <path
                  d="M120 84 C120 84 110 77 110 71 C110 67.5 112.8 65 116 65 C118.2 65 119.5 66.5 120 68 C120.5 66.5 121.8 65 124 65 C127.2 65 130 67.5 130 71 C130 77 120 84 120 84 Z"
                  fill="#FFF8F3"
                />
              </svg>
            </motion.button>
          </div>

          {/* Controls below cake */}
          {!isExtinguished ? (
            <div className="mt-4 flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={extinguishCandle}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#9E3C65] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#843054]"
                >
                  <Flame className="h-4 w-4" aria-hidden="true" />
                  <span>Tap To Blow Out Candle</span>
                </button>

                <button
                  type="button"
                  onClick={startMicBlowDetection}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    micActive
                      ? 'border-[#9E3C65] bg-[#FCE4EC] text-[#9E3C65]'
                      : 'border-[#EFA9C2] bg-white text-[#513B48] hover:bg-[#FCE4EC]'
                  }`}
                >
                  {micActive ? (
                    <>
                      <MicOff className="h-4 w-4" aria-hidden="true" />
                      <span>Listening... Blow Gently!</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 text-[#9E3C65]" aria-hidden="true" />
                      <span>Use Mic To Blow</span>
                    </>
                  )}
                </button>
              </div>

              {micActive && (
                <div className="w-56">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#FCE4EC]">
                    <div
                      className="h-full rounded-full bg-[#9E3C65] transition-all duration-75"
                      style={{ width: `${blowLevel}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#6F5564]">
                    Blow gently into your microphone!
                  </p>
                </div>
              )}

              {micError && (
                <p role="status" className="max-w-sm text-xs text-[#9E3C65]">
                  {micError}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Wish Revealed + Cake Cut Slice Reveal */}
        <AnimatePresence>
          {isExtinguished && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-6 rounded-3xl border-2 border-[#EFA9C2] bg-[#FCE4EC]/70 p-5 text-center sm:p-6"
            >
              {/* Animated Cake Slice Cut Reveal */}
              <motion.div
                initial={{ x: -18, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-3 inline-flex items-center gap-3 rounded-2xl border border-white bg-white/95 px-4 py-2.5 shadow-xs"
              >
                <svg viewBox="0 0 64 48" className="h-10 w-12" aria-hidden="true">
                  <polygon points="8,34 54,18 54,42 8,42" fill="#F8C8DC" stroke="#C96B91" strokeWidth="2" />
                  <polygon points="8,34 54,18 32,10" fill="#FFF8F3" stroke="#EFA9C2" strokeWidth="2" />
                  <line x1="8" y1="38" x2="54" y2="30" stroke="#FFFFFF" strokeWidth="3" />
                  <circle cx="34" cy="14" r="4.5" fill="#D95D82" />
                </svg>
                <div className="text-left">
                  <p className="inline-flex items-center gap-1 text-xs font-bold text-[#9E3C65] uppercase">
                    <Utensils className="h-3 w-3" aria-hidden="true" />
                    <span>First Slice For Vanshika!</span>
                  </p>
                  <p className="font-hand text-lg font-semibold text-[#513B48]">
                    Strawberry Vanilla Birthday Slice 🍓
                  </p>
                </div>
              </motion.div>

              <h2 className="font-display text-2xl font-bold text-[#513B48]">
                {birthdayConfig.cake.wishRevealedTitle}
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#513B48] sm:text-base">
                {birthdayConfig.cake.wishRevealedMessage}
              </p>

              <button
                type="button"
                onClick={handleRelight}
                className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#EFA9C2] bg-white px-4 py-2 text-xs font-semibold text-[#513B48] hover:bg-[#FCE4EC]"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#9E3C65]" aria-hidden="true" />
                <span>Relight Candle</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

