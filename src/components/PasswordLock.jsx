import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Heart, HelpCircle, Lock, RotateCcw, Sparkles, Unlock } from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import TeddyIllustration from './TeddyIllustration';
import { LottieSparkleLayer, RibbonBow } from './ScrapbookAccents';
import { launchMiniBurst } from '../utils/effects';

export default function PasswordLock({ onUnlock, playChime }) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const expectedPin = String(birthdayConfig.secretPin || '2006').slice(0, 4);

  const attemptUnlock = (candidatePin = pin) => {
    if (isUnlocking) return;
    if (candidatePin.length < expectedPin.length) {
      setErrorMsg(`Please enter all ${expectedPin.length} digits first 🎀`);
      triggerShake();
      return;
    }

    if (candidatePin === expectedPin) {
      setErrorMsg('');
      setIsUnlocking(true);
      playChime?.('unlock');
      launchMiniBurst({ x: 0.5, y: 0.5 });
      window.setTimeout(() => {
        onUnlock();
      }, 950);
    } else {
      const msgs = birthdayConfig.lockScreen.wrongPinMessages;
      const nextMsg = msgs[wrongCount % msgs.length];
      setWrongCount((c) => c + 1);
      setErrorMsg(nextMsg);
      triggerShake();
      setPin('');
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    window.setTimeout(() => setIsShaking(false), 450);
  };

  const appendDigit = (digit) => {
    if (isUnlocking || pin.length >= expectedPin.length) return;
    setErrorMsg('');
    const next = `${pin}${digit}`;
    setPin(next);
  };

  const handleDelete = () => {
    if (isUnlocking) return;
    setErrorMsg('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isUnlocking) return;
    setErrorMsg('');
    setPin('');
  };

  // Support desktop keyboard typing naturally without needing an extra text box focus
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[0-9]$/.test(e.key)) {
        appendDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter') {
        attemptUnlock();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, isUnlocking]);

  const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <section
      aria-labelledby="lock-heading"
      className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col items-center justify-center px-4 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={
          isUnlocking
            ? { opacity: 1, scale: 1.03 }
            : isShaking
              ? { x: [-8, 8, -6, 6, 0] }
              : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="paper-card lace-border relative w-full rounded-[2rem] px-5 pt-7 pb-6 text-center sm:px-8 sm:pt-8 sm:pb-7"
      >
        {/* Top Ribbon */}
        <div className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2">
          <RibbonBow className="h-9 w-16 drop-shadow-xs" />
        </div>

        {/* Heart Decorative Frame + Teddy */}
        <div className="relative mx-auto mb-3 flex w-fit flex-col items-center">
          <LottieSparkleLayer
            src="/animations/sparkles.json"
            className="absolute -inset-4 z-0 opacity-85"
          />
          <div className="polka-pastel relative z-10 flex h-36 w-36 items-center justify-center rounded-full border-4 border-white shadow-md sm:h-40 sm:w-40">
            <TeddyIllustration
              mood="peek"
              className="h-32 w-32 sm:h-36 sm:w-36"
            />
            <span
              className={`absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-sm transition-colors ${isUnlocking ? 'bg-[#9E3C65] text-white' : 'bg-[#F8C8DC] text-[#513B48]'
                }`}
              aria-hidden="true"
            >
              {isUnlocking ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </span>
          </div>
        </div>

        {/* Headings */}
        <h1
          id="lock-heading"
          className="font-display text-3xl font-bold tracking-tight text-[#513B48] sm:text-4xl"
        >
          {birthdayConfig.lockScreen.heading}
        </h1>
        <p className="mt-1.5 text-sm text-[#6F5564] sm:text-base">
          {birthdayConfig.lockScreen.subheading}
        </p>

        {/* PIN Display */}
        <div className="mt-5">
          <p id="pin-prompt-label" className="text-xs font-semibold tracking-wide text-[#9E3C65] uppercase">
            {birthdayConfig.lockScreen.inputLabel}
          </p>

          <div
            role="group"
            aria-labelledby="pin-prompt-label"
            className="mt-2.5 flex items-center justify-center gap-3"
          >
            {Array.from({ length: expectedPin.length }).map((_, idx) => {
              const filled = idx < pin.length;
              return (
                <div
                  key={idx}
                  className={`flex h-13 w-12 items-center justify-center rounded-2xl border-2 text-lg font-bold transition-all sm:h-14 sm:w-14 ${filled
                    ? 'border-[#9E3C65] bg-[#FCE4EC] text-[#9E3C65] shadow-xs'
                    : 'border-[#F8C8DC] bg-[#FFF8F3] text-[#C96B91]/40'
                    }`}
                  aria-hidden="true"
                >
                  {filled ? (
                    <Heart className="h-5 w-5 fill-[#9E3C65] text-[#9E3C65]" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-[#EFA9C2]/65" />
                  )}
                </div>
              );
            })}
          </div>
          <span className="visually-hidden" aria-live="polite">
            {pin.length} of {expectedPin.length} digits entered.
          </span>
        </div>

        {/* Feedback / Unlocking State */}
        <div className="mt-3 min-h-6" aria-live="polite">
          <AnimatePresence mode="wait">
            {isUnlocking ? (
              <motion.p
                key="unlocking"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9E3C65]"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Yay! Unlocking your birthday universe...</span>
              </motion.p>
            ) : errorMsg ? (
              <motion.p
                key={errorMsg}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FCE4EC] px-3 py-1 text-xs font-medium text-[#9E3C65]"
              >
                <span aria-hidden="true">🧸</span>
                <span>{errorMsg}</span>
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Numeric Keypad */}
        <div className="mx-auto mt-3 grid max-w-[18.5rem] grid-cols-3 gap-2.5">
          {keypadDigits.map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => appendDigit(digit)}
              disabled={isUnlocking}
              className="min-h-12 rounded-2xl border border-[#F8C8DC] bg-[#FFF8F3] text-lg font-semibold text-[#513B48] shadow-xs transition-all hover:bg-[#FCE4EC] active:scale-95 disabled:opacity-50"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            disabled={isUnlocking || pin.length === 0}
            aria-label="Clear code"
            className="inline-flex min-h-12 items-center justify-center gap-1 rounded-2xl border border-[#F8C8DC] bg-white px-2 text-xs font-semibold text-[#6F5564] shadow-xs transition-all hover:bg-[#FCE4EC] active:scale-95 disabled:opacity-45"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={() => appendDigit('0')}
            disabled={isUnlocking}
            className="min-h-12 rounded-2xl border border-[#F8C8DC] bg-[#FFF8F3] text-lg font-semibold text-[#513B48] shadow-xs transition-all hover:bg-[#FCE4EC] active:scale-95 disabled:opacity-50"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isUnlocking || pin.length === 0}
            aria-label="Delete last digit"
            className="inline-flex min-h-12 items-center justify-center gap-1 rounded-2xl border border-[#F8C8DC] bg-white px-2 text-xs font-semibold text-[#6F5564] shadow-xs transition-all hover:bg-[#FCE4EC] active:scale-95 disabled:opacity-45"
          >
            <Delete className="h-4 w-4" aria-hidden="true" />
            <span>Del</span>
          </button>
        </div>

        {/* Unlock CTA */}
        <div className="mx-auto mt-4 max-w-[18.5rem]">
          <button
            type="button"
            onClick={() => attemptUnlock()}
            disabled={isUnlocking}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#9E3C65] px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-[#843054] active:scale-[0.98] disabled:opacity-65"
          >
            <Unlock className="h-4 w-4" aria-hidden="true" />
            <span>Unlock Surprise</span>
          </button>
        </div>

        {/* Optional Hint Disclosure */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            aria-expanded={showHint}
            className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-[#6F5564] underline decoration-[#EFA9C2] underline-offset-4 hover:text-[#9E3C65]"
          >
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{showHint ? 'Hide hint' : 'Need a hint?'}</span>
          </button>
          {showHint && (
            <p className="mt-1.5 text-xs text-[#6F5564]">
              {birthdayConfig.pinHint}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

