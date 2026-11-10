import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  Heart,
  HeartHandshake,
  HeartPulse,
  Sparkles,
  Star,
  Stethoscope,
} from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import TeddyIllustration from './TeddyIllustration';
import { WashiTape } from './ScrapbookAccents';
import { launchMiniBurst } from '../utils/effects';

function StethoscopeSticker({ className = 'h-12 w-12', style }) {
  return (
    <svg
      viewBox="0 0 64 64"
      style={style}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="28" fill="#FCE4EC" stroke="#FFFFFF" strokeWidth="3" />
      <path
        d="M21 18 V28 A11 11 0 0 0 43 28 V18"
        fill="none"
        stroke="#9E3C65"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="21" cy="17" r="2.6" fill="#C96B91" />
      <circle cx="43" cy="17" r="2.6" fill="#C96B91" />
      <path
        d="M32 39 V45 Q32 51 39 51 Q45 51 45 43"
        fill="none"
        stroke="#9E3C65"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="45" cy="40" r="4.5" fill="#F8C8DC" stroke="#9E3C65" strokeWidth="2.2" />
    </svg>
  );
}

function PinkMedicalBagSticker({ className = 'h-12 w-12', style }) {
  return (
    <svg
      viewBox="0 0 64 64"
      style={style}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="28" fill="#E9DDF8" stroke="#FFFFFF" strokeWidth="3" />
      <path
        d="M25 22 V19 A3 3 0 0 1 28 16 H36 A3 3 0 0 1 39 19 V22"
        fill="none"
        stroke="#9E3C65"
        strokeWidth="2.6"
      />
      <rect
        x="16"
        y="22"
        width="32"
        height="24"
        rx="6"
        fill="#F8C8DC"
        stroke="#9E3C65"
        strokeWidth="2.4"
      />
      <circle cx="32" cy="34" r="7" fill="#FFFFFF" />
      <path
        d="M32 30 V38 M28 34 H36"
        stroke="#9E3C65"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PastelBandaidSticker({ className = 'h-12 w-12' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g transform="rotate(-24 32 32)">
        <rect
          x="10"
          y="21"
          width="44"
          height="22"
          rx="11"
          fill="#FCE4EC"
          stroke="#C96B91"
          strokeWidth="2.2"
        />
        <rect x="24" y="22" width="16" height="20" rx="3" fill="#FFF8F3" />
        <path
          d="M32 36 C32 36 27 32.5 27 29.5 C27 27.8 28.5 26.8 30 26.8 C31 26.8 31.7 27.4 32 28.1 C32.3 27.4 33 26.8 34 26.8 C35.5 26.8 37 27.8 37 29.5 C37 32.5 32 36 32 36 Z"
          fill="#EFA9C2"
        />
      </g>
    </svg>
  );
}

const TIMELINE_ICONS = [BookOpen, Stethoscope, Sparkles, HeartHandshake, Star];

export default function FutureNurseJourney({ playChime }) {
  const config = birthdayConfig.nurseJourney;
  const [openCards, setOpenCards] = useState({
    dream: true,
    journey: false,
    wishes: false,
    motivation: false,
  });
  const [futureWishSent, setFutureWishSent] = useState(false);

  const toggleCard = (key) => {
    setOpenCards((prev) => {
      const nextState = !prev[key];
      if (nextState) playChime?.('sparkle');
      return { ...prev, [key]: nextState };
    });
  };

  const handleSendFutureWish = () => {
    if (!futureWishSent) {
      playChime?.('wish');
      launchMiniBurst({ x: 0.5, y: 0.58 });
    }
    setFutureWishSent(true);
  };

  return (
    <section
      aria-labelledby="nurse-journey-heading"
      className="relative z-10 mx-auto w-full max-w-4xl px-4 pt-5 pb-4"
    >
      <div className="scrapbook-paper lace-border relative overflow-hidden rounded-[2.25rem] border-2 border-[#F8C8DC] px-5 py-7 shadow-md sm:px-9 sm:py-9">
        {/* Floating pastel medical icons & hearts inside the dream journal */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <Stethoscope
            size={22}
            className="anim-float-heart absolute top-5 left-5 text-[#C96B91]/35"
          />
          <HeartPulse
            size={22}
            style={{ animationDelay: '0.8s' }}
            className="anim-float-heart absolute top-28 right-5 text-[#9E3C65]/30"
          />
          <Star
            size={18}
            style={{ animationDelay: '1.2s' }}
            className="anim-twinkle absolute bottom-20 left-4 fill-[#F8C8DC]/60 text-[#C96B91]/40"
          />
          <Heart
            size={18}
            style={{ animationDelay: '0.4s' }}
            className="anim-float-heart absolute right-6 bottom-12 fill-[#E9DDF8] text-[#C96B91]/35"
          />
        </div>

        {/* Dream Journal Header */}
        <div className="relative z-10 mb-7 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-[#9E3C65] shadow-xs">
              <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{config.screenTitle}</span>
            </span>

            <h1
              id="nurse-journey-heading"
              className="font-display mt-2.5 text-2xl font-bold text-[#513B48] sm:text-4xl"
            >
              {config.heading} 🩺✨
            </h1>

            <p className="mt-1.5 text-sm text-[#6F5564] sm:text-base">
              {config.subheading}
            </p>
          </div>

          {/* Cute Medical-Themed Sticker Trio */}
          <div
            aria-hidden="true"
            className="flex shrink-0 items-center justify-center gap-2"
          >
            <StethoscopeSticker className="anim-gentle-bob h-13 w-13 sm:h-15 sm:w-15" />
            <PinkMedicalBagSticker
              className="anim-gentle-bob h-14 w-14 sm:h-16 sm:w-16"
              style={{ animationDelay: '0.45s' }}
            />
            <PastelBandaidSticker className="anim-gentle-bob h-12 w-12 sm:h-14 sm:w-14" />
          </div>
        </div>

        {/* 4 Interactive Dream Board Cards */}
        <div className="relative z-10 grid grid-cols-1 gap-5">
          {/* CARD 01 — The Dream */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.35 }}
            className="paper-card scroll-reveal-card relative rounded-3xl border-2 border-[#F8C8DC] p-5 transition-shadow hover:shadow-md sm:p-6"
          >
            <div className="pointer-events-none absolute -top-2.5 left-6">
              <WashiTape color="pink" />
            </div>

            <button
              type="button"
              onClick={() => toggleCard('dream')}
              aria-expanded={openCards.dream}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <span className="text-xs font-bold tracking-wider text-[#9E3C65] uppercase">
                  {config.cards.dream.badge}
                </span>
                <h2 className="font-display mt-0.5 text-xl font-bold text-[#513B48] sm:text-2xl">
                  {config.cards.dream.heading}
                </h2>
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCE4EC] text-[#9E3C65]">
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openCards.dream ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {openCards.dream && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl border border-[#F8C8DC] bg-[#FFF8F3] p-4 sm:flex-row sm:p-5">
                    <div className="polka-pastel flex h-34 w-34 shrink-0 items-center justify-center rounded-2xl border-2 border-white shadow-xs">
                      <TeddyIllustration mood="nurse" className="h-30 w-30" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-[#9E3C65]">
                        <Heart className="h-3 w-3 fill-[#F8C8DC]" aria-hidden="true" />
                        <span>Dream Card ✨</span>
                      </div>
                      <p className="text-sm leading-relaxed text-[#513B48] sm:text-base">
                        {config.cards.dream.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CARD 02 — Your Journey (Animated Career Timeline) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ delay: 0.05, duration: 0.35 }}
            className="paper-card scroll-reveal-card relative rounded-3xl border-2 border-[#E9DDF8] p-5 transition-shadow hover:shadow-md sm:p-6"
          >
            <div className="pointer-events-none absolute -top-2.5 right-6">
              <WashiTape color="lavender" />
            </div>

            <button
              type="button"
              onClick={() => toggleCard('journey')}
              aria-expanded={openCards.journey}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <span className="text-xs font-bold tracking-wider text-[#9E3C65] uppercase">
                  {config.cards.journey.badge}
                </span>
                <h2 className="font-display mt-0.5 text-xl font-bold text-[#513B48] sm:text-2xl">
                  {config.cards.journey.heading}
                </h2>
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9DDF8] text-[#513B48]">
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openCards.journey ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {openCards.journey && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ol className="relative mt-5 space-y-3 border-l-2 border-dashed border-[#EFA9C2] pl-5 sm:ml-3">
                    {config.cards.journey.steps.map((stepText, idx) => {
                      const StepIcon = TIMELINE_ICONS[idx % TIMELINE_ICONS.length];
                      return (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08, duration: 0.35 }}
                          className="relative rounded-2xl border border-[#F8C8DC] bg-[#FFF8F3] p-3.5 shadow-2xs"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute top-1/2 -left-[1.95rem] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#FCE4EC] text-[#9E3C65] shadow-xs"
                          >
                            <StepIcon className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-[0.7rem] font-bold tracking-wide text-[#9E3C65] uppercase">
                            Chapter Step 0{idx + 1}
                          </span>
                          <p className="mt-0.5 text-sm font-medium text-[#513B48] sm:text-base">
                            {stepText}
                          </p>
                        </motion.li>
                      );
                    })}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CARD 03 — Future Wishes */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ delay: 0.08, duration: 0.35 }}
            className="paper-card scroll-reveal-card relative rounded-3xl border-2 border-[#F8C8DC] p-5 transition-shadow hover:shadow-md sm:p-6"
          >
            <div className="pointer-events-none absolute -top-2.5 left-8">
              <WashiTape color="cream" />
            </div>

            <button
              type="button"
              onClick={() => toggleCard('wishes')}
              aria-expanded={openCards.wishes}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <span className="text-xs font-bold tracking-wider text-[#9E3C65] uppercase">
                  {config.cards.wishes.badge}
                </span>
                <h2 className="font-display mt-0.5 text-xl font-bold text-[#513B48] sm:text-2xl">
                  {config.cards.wishes.heading}
                </h2>
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCE4EC] text-[#9E3C65]">
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openCards.wishes ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {openCards.wishes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {config.cards.wishes.items.map((wish, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="flex items-start gap-2.5 rounded-2xl border border-[#F8C8DC] bg-[#FFF8F3] p-3.5 text-sm font-medium text-[#513B48]"
                      >
                        <Star
                          className="mt-0.5 h-4 w-4 shrink-0 fill-[#F8C8DC] text-[#9E3C65]"
                          aria-hidden="true"
                        />
                        <span>{wish}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CARD 04 — A Little Motivation + Future Self Note */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="paper-card scroll-reveal-card relative rounded-3xl border-2 border-[#EFA9C2] p-5 transition-shadow hover:shadow-md sm:p-6"
          >
            <div className="pointer-events-none absolute -top-2.5 right-8">
              <WashiTape color="pink" />
            </div>

            <button
              type="button"
              onClick={() => toggleCard('motivation')}
              aria-expanded={openCards.motivation}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <span className="text-xs font-bold tracking-wider text-[#9E3C65] uppercase">
                  {config.cards.motivation.badge}
                </span>
                <h2 className="font-display mt-0.5 text-xl font-bold text-[#513B48] sm:text-2xl">
                  {config.cards.motivation.heading}
                </h2>
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCE4EC] text-[#9E3C65]">
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openCards.motivation ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {openCards.motivation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 rounded-2xl border border-[#F8C8DC] bg-[#FFF8F3] p-4 sm:p-5">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <PinkMedicalBagSticker className="h-14 w-14 shrink-0" />
                      <p className="text-sm leading-relaxed text-[#513B48] sm:text-base">
                        {config.cards.motivation.message}
                      </p>
                    </div>

                    <div className="mt-5 flex justify-center">
                      <button
                        type="button"
                        onClick={handleSendFutureWish}
                        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#9E3C65] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#843054]"
                      >
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        <span>{config.cards.motivation.futureWishButtonLabel}</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {futureWishSent && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="mt-5 rounded-2xl border-2 border-[#EFA9C2] bg-white p-5 shadow-xs"
                        >
                          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] px-3 py-0.5 text-xs font-bold text-[#9E3C65]">
                            <Heart className="h-3 w-3 fill-[#9E3C65]" aria-hidden="true" />
                            <span>A Note Sealed For Your Future</span>
                          </p>
                          <p className="font-hand text-2xl leading-relaxed whitespace-pre-line font-semibold text-[#513B48]">
                            {config.cards.motivation.futureSelfNote}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
