import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FastForward,
  Heart,
  MailOpen,
  Music2,
  RotateCcw,
  Sparkles,
  Star,
} from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import TeddyIllustration from './TeddyIllustration';
import { LottieSparkleLayer, RibbonBow } from './ScrapbookAccents';
import {
  launchBirthdayFireworks,
  launchMiniBurst,
  launchPastelConfetti,
} from '../utils/effects';

function FinaleBalloon({ color, className = '', delay = '0s' }) {
  return (
    <div
      className={`anim-balloon pointer-events-none select-none ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 54 84" className="h-16 w-10 sm:h-20 sm:w-12">
        <path
          d="M27 58 Q23 72 28 83"
          fill="none"
          stroke="#C96B91"
          strokeWidth="1.5"
        />
        <ellipse
          cx="27"
          cy="29"
          rx="20"
          ry="25"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="2.2"
        />
        <ellipse cx="20" cy="19" rx="4.5" ry="7.5" fill="#FFFFFF" opacity="0.55" />
        <polygon points="23,54 31,54 27,59" fill={color} />
      </svg>
    </div>
  );
}

function FireworkBurst({ className = '', delay = '0s', color = '#EFA9C2' }) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden="true"
      style={{ animationDelay: delay }}
      className={`anim-firework-ring pointer-events-none select-none ${className}`}
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="40"
          y1="14"
          x2="40"
          y2="25"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          transform={`rotate(${deg} 40 40)`}
        />
      ))}
      <circle cx="40" cy="40" r="4" fill="#FFE2A8" />
    </svg>
  );
}

function FinaleMiniCake() {
  return (
    <svg
      viewBox="0 0 96 86"
      className="h-20 w-24 shrink-0 drop-shadow-xs sm:h-24 sm:w-28"
      aria-hidden="true"
    >
      <ellipse
        cx="48"
        cy="78"
        rx="38"
        ry="6"
        fill="#FFFFFF"
        stroke="#EFA9C2"
        strokeWidth="2"
      />
      <rect
        x="18"
        y="48"
        width="60"
        height="28"
        rx="9"
        fill="#F8C8DC"
        stroke="#C96B91"
        strokeWidth="2"
      />
      <path
        d="M18 54 Q26 62 34 54 Q42 62 48 54 Q54 62 62 54 Q70 62 78 54 V48 H18 Z"
        fill="#FFF8F3"
      />
      <rect
        x="28"
        y="28"
        width="40"
        height="22"
        rx="8"
        fill="#EFA9C2"
        stroke="#C96B91"
        strokeWidth="2"
      />
      <path
        d="M28 34 Q36 42 44 34 Q52 42 60 34 Q65 39 68 34 V28 H28 Z"
        fill="#FFF8F3"
      />
      <rect
        x="45.5"
        y="13"
        width="5"
        height="15"
        rx="2"
        fill="#FFF8F3"
        stroke="#C96B91"
        strokeWidth="1.6"
      />
      <ellipse
        cx="48"
        cy="8"
        rx="4"
        ry="5.5"
        fill="#FFD166"
        className="anim-candle-flame"
      />
    </svg>
  );
}

export default function FinalSurprise({ onReplay, audio }) {
  const [musicBoostMsg, setMusicBoostMsg] = useState(false);
  const [failedCollage, setFailedCollage] = useState({});
  const [secretOpen, setSecretOpen] = useState(false);
  const [envelopeFlapOpen, setEnvelopeFlapOpen] = useState(false);
  const [secretTypedCount, setSecretTypedCount] = useState(0);
  const [secretShowInstant, setSecretShowInstant] = useState(false);

  const secretMessage = birthdayConfig.finale.secretSurpriseMessage || '';
  const isSecretTypingDone = secretTypedCount >= secretMessage.length;

  useEffect(() => {
    const stopFireworks = launchBirthdayFireworks();
    return () => {
      if (stopFireworks) stopFireworks();
    };
  }, []);

  // Typewriter reveal for Secret Birthday Surprise once envelope opens
  useEffect(() => {
    if (!secretOpen || !envelopeFlapOpen) return undefined;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced || secretShowInstant) {
      setSecretTypedCount(secretMessage.length);
      return undefined;
    }

    if (secretTypedCount >= secretMessage.length) return undefined;

    const timer = window.setTimeout(() => {
      setSecretTypedCount((c) => Math.min(secretMessage.length, c + 2));
    }, 24);
    return () => window.clearTimeout(timer);
  }, [
    secretOpen,
    envelopeFlapOpen,
    secretTypedCount,
    secretShowInstant,
    secretMessage.length,
  ]);

  const handleLaunchMoreFireworks = () => {
    launchBirthdayFireworks();
    launchPastelConfetti();
    audio.playChime?.('wish');
  };

  const handlePlayBirthdayMusic = async () => {
    await audio.playFromStart();
    setMusicBoostMsg(true);
    window.setTimeout(() => setMusicBoostMsg(false), 3000);
  };

  const handleOpenSecretSurprise = (e) => {
    audio.playChime?.('letter');
    const rect = e.currentTarget.getBoundingClientRect();
    launchMiniBurst({
      x: Math.min(0.9, Math.max(0.1, (rect.left + rect.width / 2) / window.innerWidth)),
      y: Math.min(0.85, Math.max(0.15, rect.top / window.innerHeight)),
    });
    setSecretOpen(true);
    setEnvelopeFlapOpen(false);
    setSecretTypedCount(0);
    setSecretShowInstant(false);
    window.setTimeout(() => {
      setEnvelopeFlapOpen(true);
    }, 180);
  };

  const memories = birthdayConfig.memories.items;

  return (
    <section
      aria-labelledby="finale-heading"
      className="relative z-10 mx-auto w-full max-w-4xl px-4 pt-5 pb-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="paper-card lace-border relative overflow-hidden rounded-[2.25rem] px-5 py-8 text-center sm:px-10 sm:py-11"
      >
        {/* Decorative Firework Bursts & Floating Balloons */}
        <FireworkBurst
          color="#EFA9C2"
          delay="0s"
          className="absolute top-6 left-10 hidden h-20 w-20 sm:block"
        />
        <FireworkBurst
          color="#C96B91"
          delay="1.1s"
          className="absolute top-8 right-12 hidden h-20 w-20 sm:block"
        />
        <FinaleBalloon
          color="#F8C8DC"
          className="absolute top-3 left-3 sm:left-8"
          delay="0s"
        />
        <FinaleBalloon
          color="#E9DDF8"
          className="absolute top-4 right-3 sm:right-8"
          delay="0.7s"
        />
        <FinaleBalloon
          color="#EFA9C2"
          className="absolute top-36 left-4 hidden md:block"
          delay="1.2s"
        />
        <FinaleBalloon
          color="#FCE4EC"
          className="absolute top-40 right-4 hidden md:block"
          delay="1.6s"
        />

        <LottieSparkleLayer
          src="/animations/celebration-hearts.json"
          className="pointer-events-none absolute top-2 left-1/2 h-48 w-64 -translate-x-1/2 opacity-75"
        />

        <div className="anim-breathe relative z-10 mx-auto mb-3 flex justify-center">
          <RibbonBow className="h-9 w-16" />
        </div>

        {/* Celebrating Nurse Teddy + Birthday Cake + Cute Teddy Holding a Birthday Gift */}
        <div className="relative z-10 flex flex-wrap items-end justify-center gap-2 sm:gap-5">
          <TeddyIllustration
            mood="nurse"
            bubblePlacement="bottom"
            className="h-24 w-24 sm:h-30 sm:w-30"
          />
          <FinaleMiniCake />
          <TeddyIllustration
            mood="gift"
            bubblePlacement="bottom"
            className="h-28 w-28 sm:h-34 sm:w-34"
          />
        </div>

        {/* Animated Glowing Heading */}
        <motion.h1
          id="finale-heading"
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="font-display anim-title-glow relative z-10 mt-4 text-3xl font-bold tracking-tight text-[#9E3C65] sm:text-5xl"
        >
          {birthdayConfig.finale.heading}
        </motion.h1>

        <p className="font-hand relative z-10 mt-3 text-2xl font-bold text-[#513B48] sm:text-3xl">
          {birthdayConfig.finale.subheading}
        </p>

        {/* Fireworks Button */}
        <div className="relative z-10 mt-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLaunchMoreFireworks}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#EFA9C2] bg-[#FCE4EC] px-4 py-1.5 text-xs font-semibold text-[#9E3C65] transition-colors hover:bg-[#F8C8DC]"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Launch More Fireworks 🎆</span>
          </motion.button>
        </div>

        {/* Mini Keepsake Photo Collage */}
        {memories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.45 }}
            className="scroll-reveal-card relative z-10 mx-auto mt-7 max-w-2xl rounded-3xl border border-[#F8C8DC] bg-[#FFF8F3] p-4 shadow-inner sm:p-5"
          >
            <p className="mb-3 text-xs font-bold tracking-wider text-[#9E3C65] uppercase">
              Vanshika&apos;s Birthday Collage 📸
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {memories.map((item, idx) => (
                <div
                  key={item.id}
                  style={{ '--card-tilt': `${idx % 2 === 0 ? -2 : 2}deg` }}
                  className="rotate-[var(--card-tilt)] rounded-xl border border-[#F8C8DC] bg-white p-2 pb-3 shadow-xs transition-transform duration-300 hover:scale-[1.03] hover:rotate-0"
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-[#FCE4EC]">
                    {failedCollage[item.id] ? (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[#9E3C65]">
                        ✨
                      </div>
                    ) : (
                      <img
                        src={item.src}
                        alt={item.alt}
                        onError={() =>
                          setFailedCollage((prev) => ({
                            ...prev,
                            [item.id]: true,
                          }))
                        }
                        className="h-full w-full object-cover object-[50%_18%]"
                      />
                    )}
                  </div>
                  <p className="font-hand mt-1.5 line-clamp-1 text-sm font-semibold text-[#513B48]">
                    {item.caption}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Final Personal Friendship Message */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.45 }}
          className="scroll-reveal-card relative z-10 mx-auto mt-6 max-w-xl rounded-3xl border border-[#F8C8DC] bg-white/95 p-5 shadow-xs sm:p-6"
        >
          <Heart
            className="anim-breathe mx-auto mb-2 h-6 w-6 fill-[#F8C8DC] text-[#9E3C65]"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed whitespace-pre-line text-[#513B48] sm:text-base">
            {birthdayConfig.finale.personalMessage}
          </p>
          <p className="font-hand mt-3 text-2xl font-bold text-[#9E3C65]">
            Your friend, {birthdayConfig.senderName} 🎀
          </p>
        </motion.div>

        {/* Secret Birthday Surprise Interaction */}
        <div className="relative z-10 mx-auto mt-6 max-w-xl">
          {!secretOpen ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenSecretSurprise}
              aria-expanded={secretOpen}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[#EFA9C2] bg-gradient-to-r from-[#FCE4EC] via-[#FFF8F3] to-[#E9DDF8]/70 px-6 py-3 text-sm font-bold text-[#9E3C65] shadow-sm transition-shadow hover:shadow-md"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>{birthdayConfig.finale.secretSurpriseButtonLabel}</span>
            </motion.button>
          ) : (
            <AnimatePresence>
              <motion.div
                key="secret-envelope-stage"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative rounded-3xl border-2 border-[#EFA9C2] bg-[#FFF8F3] p-5 text-center shadow-md sm:p-7"
              >
                {/* Floating Hearts & Sparkles Around the Envelope */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
                >
                  <Heart
                    size={16}
                    className="anim-float-heart absolute top-3 left-4 fill-[#F8C8DC] text-[#C96B91]"
                  />
                  <Sparkles
                    size={16}
                    style={{ animationDelay: '0.5s' }}
                    className="anim-twinkle absolute top-4 right-5 text-[#9E3C65]/70"
                  />
                  <Star
                    size={14}
                    style={{ animationDelay: '1.1s' }}
                    className="anim-twinkle absolute bottom-4 left-5 fill-[#E9DDF8] text-[#C96B91]/60"
                  />
                  <Heart
                    size={15}
                    style={{ animationDelay: '0.8s' }}
                    className="anim-float-heart absolute right-5 bottom-4 fill-[#FCE4EC] text-[#C96B91]"
                  />
                </div>

                {/* Animated Envelope Header */}
                <div className="relative z-10 mx-auto mb-4 w-44">
                  <div className="relative h-24 w-44 overflow-visible rounded-b-2xl border-2 border-[#EFA9C2] bg-[#FCE4EC] shadow-xs">
                    {/* Animated Top Flap */}
                    <motion.div
                      initial={{ rotateX: 0 }}
                      animate={{ rotateX: envelopeFlapOpen ? -165 : 0 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      style={{
                        transformOrigin: 'top center',
                        transformPerspective: 500,
                      }}
                      className="absolute inset-x-0 top-0 z-20 h-13 origin-top"
                    >
                      <svg viewBox="0 0 176 52" className="h-full w-full" aria-hidden="true">
                        <polygon
                          points="0,0 176,0 88,50"
                          fill="#F8C8DC"
                          stroke="#C96B91"
                          strokeWidth="2"
                        />
                      </svg>
                    </motion.div>

                    {/* Rising Mini Letter Card */}
                    <motion.div
                      initial={{ y: 8, opacity: 0.7 }}
                      animate={{
                        y: envelopeFlapOpen ? -12 : 8,
                        opacity: 1,
                      }}
                      transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
                      className="absolute inset-x-3 top-2 z-10 flex h-16 items-center justify-center rounded-xl border border-[#F8C8DC] bg-white shadow-2xs"
                    >
                      <MailOpen className="h-5 w-5 text-[#9E3C65]" aria-hidden="true" />
                    </motion.div>

                    {/* Envelope Pocket Front */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 z-15 h-12 rounded-b-xl border-t border-[#EFA9C2]/60 bg-[#FFF8F3]/90"
                    />
                  </div>
                </div>

                {/* Personalized Typewriter Reveal */}
                <div className="relative z-10 rounded-2xl border border-[#F8C8DC] bg-white p-4 text-left shadow-2xs sm:p-5">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-bold text-[#9E3C65]">
                      {birthdayConfig.finale.secretSurpriseTitle}
                    </h2>
                    {!isSecretTypingDone && (
                      <button
                        type="button"
                        onClick={() => setSecretShowInstant(true)}
                        className="inline-flex min-h-8 items-center gap-1 rounded-full border border-[#EFA9C2] bg-[#FFF8F3] px-2.5 py-1 text-xs font-semibold text-[#513B48] hover:bg-[#FCE4EC]"
                      >
                        <FastForward className="h-3 w-3" aria-hidden="true" />
                        <span>Show Full Note</span>
                      </button>
                    )}
                  </div>

                  <p className="font-hand text-xl leading-relaxed whitespace-pre-line font-semibold text-[#513B48] sm:text-2xl">
                    {secretMessage.slice(0, secretTypedCount)}
                    {!isSecretTypingDone && (
                      <span
                        aria-hidden="true"
                        className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-[#9E3C65] align-middle"
                      />
                    )}
                  </p>
                </div>

                <div className="relative z-10 mt-3 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSecretOpen(false)}
                    className="inline-flex min-h-9 items-center rounded-full border border-[#EFA9C2] bg-white px-3.5 py-1 text-xs font-semibold text-[#6F5564] hover:bg-[#FCE4EC]"
                  >
                    Tuck Envelope Away
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReplay}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[#EFA9C2] bg-white px-6 py-3 text-sm font-semibold text-[#513B48] shadow-xs transition-colors hover:bg-[#FCE4EC]"
          >
            <RotateCcw className="h-4 w-4 text-[#9E3C65]" aria-hidden="true" />
            <span>{birthdayConfig.finale.replayLabel}</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePlayBirthdayMusic}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#9E3C65] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#843054]"
          >
            <Music2 className="h-4 w-4" aria-hidden="true" />
            <span>{birthdayConfig.finale.musicAgainLabel}</span>
          </motion.button>
        </div>

        {musicBoostMsg && (
          <p
            role="status"
            className="mt-3 text-xs font-semibold text-[#9E3C65]"
          >
            Playing from Track 01: {audio.currentTrack?.title} 🎵
          </p>
        )}
      </motion.div>
    </section>
  );
}
