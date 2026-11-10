import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import TeddyIllustration from './TeddyIllustration';
import { LottieSparkleLayer, RibbonBow } from './ScrapbookAccents';
import { launchPastelConfetti } from '../utils/effects';

function Balloon({ color, className = '', delay = '0s' }) {
  return (
    <div
      className={`anim-balloon pointer-events-none select-none ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 60 95" className="h-20 w-12 sm:h-24 sm:w-14">
        <path
          d="M30 68 Q26 82 32 94"
          fill="none"
          stroke="#C96B91"
          strokeWidth="1.6"
        />
        <ellipse
          cx="30"
          cy="34"
          rx="23"
          ry="29"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        <ellipse cx="22" cy="22" rx="5" ry="9" fill="#FFFFFF" opacity="0.55" />
        <polygon points="26,63 34,63 30,68" fill={color} />
      </svg>
    </div>
  );
}

function FluffyCloud({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 68"
      aria-hidden="true"
      className={`anim-cloud pointer-events-none select-none ${className}`}
    >
      <path
        d="M26 56 H94 A18 18 0 0 0 96 22 A24 24 0 0 0 52 14 A20 20 0 0 0 22 30 A14 14 0 0 0 26 56 Z"
        fill="#FFFFFF"
        stroke="#F8C8DC"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export default function WelcomeScreen({ onStart, playChime }) {
  const handleStartClick = () => {
    playChime?.('unlock');
    launchPastelConfetti();
    onStart();
  };

  return (
    <section
      aria-labelledby="welcome-heading"
      className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-6 pb-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="paper-card lace-border relative overflow-hidden rounded-[2.25rem] px-6 py-10 text-center sm:px-10 sm:py-12"
      >
        {/* Floating Balloons & Fluffy Clouds */}
        <FluffyCloud className="absolute top-12 left-10 hidden h-12 w-24 opacity-90 sm:block" />
        <FluffyCloud className="absolute top-14 right-10 hidden h-11 w-22 opacity-85 sm:block" />
        <Balloon color="#F8C8DC" className="absolute top-3 left-3 sm:left-8" delay="0s" />
        <Balloon color="#E9DDF8" className="absolute top-5 right-3 sm:right-8" delay="0.9s" />
        <Balloon color="#EFA9C2" className="absolute bottom-8 left-6 hidden sm:block" delay="1.4s" />
        <Balloon color="#FCE4EC" className="absolute right-6 bottom-8 hidden sm:block" delay="0.5s" />

        {/* Decorative Clouds */}
        <div
          aria-hidden="true"
          className="anim-cloud pointer-events-none mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-[#F8C8DC] bg-[#FFF8F3] px-4 py-1.5 text-xs font-semibold text-[#9E3C65] shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{birthdayConfig.tagline}</span>
        </div>

        {/* Waving Teddy Centerpiece */}
        <div className="relative mx-auto my-2 flex w-fit items-center justify-center">
          <LottieSparkleLayer
            src="/animations/celebration-hearts.json"
            className="absolute -inset-8 z-0 opacity-90"
          />
          <div className="polka-pastel relative z-10 flex h-44 w-44 items-center justify-center rounded-full border-4 border-white shadow-md sm:h-52 sm:w-52">
            <TeddyIllustration mood="wave" className="h-40 w-40 sm:h-48 sm:w-48" />
          </div>
        </div>

        <div className="anim-breathe mx-auto mt-2 flex justify-center">
          <RibbonBow className="h-8 w-16" />
        </div>

        <h1
          id="welcome-heading"
          className="font-display mt-3 text-3xl font-bold tracking-tight text-[#513B48] sm:text-5xl"
        >
          {birthdayConfig.welcomeScreen.heading}
        </h1>

        <p className="font-hand mt-3 text-2xl font-semibold text-[#9E3C65] sm:text-3xl">
          {birthdayConfig.welcomeScreen.subheading}
        </p>

        <p className="mx-auto mt-3 max-w-md text-sm text-[#6F5564] sm:text-base">
          {birthdayConfig.welcomeScreen.description}
        </p>

        <div className="mt-7 flex justify-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStartClick}
            className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-[#9E3C65] px-8 py-3.5 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#843054]"
          >
            <Heart className="h-5 w-5 fill-white" aria-hidden="true" />
            <span>{birthdayConfig.welcomeScreen.ctaLabel}</span>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

