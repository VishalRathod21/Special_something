import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { birthdayConfig } from '../data/birthdayConfig';
import { useAudio } from '../hooks/useAudio';
import FloatingDecorations from '../components/FloatingDecorations';
import Navigation, { JOURNEY_STEPS, TopUniverseBar } from '../components/Navigation';
import PasswordLock from '../components/PasswordLock';
import WelcomeScreen from '../components/WelcomeScreen';
import MusicPlayer from '../components/MusicPlayer';
import PhotoGallery from '../components/PhotoGallery';
import GiftBoxes from '../components/GiftBoxes';
import BirthdayCake from '../components/BirthdayCake';
import BirthdayLetter from '../components/BirthdayLetter';
import FutureNurseJourney from '../components/FutureNurseJourney';
import WishWall from '../components/WishWall';
import FinalSurprise from '../components/FinalSurprise';

const STORAGE_KEY = 'vanshika_birthday_universe_session_v1';

const DEFAULT_SESSION = {
  unlocked: false,
  step: 0,
  openedGifts: { gift1: false, gift2: false, gift3: false },
  cakeExtinguished: false,
  letterOpened: false,
  openedWishes: {},
};

function loadSession() {
  if (typeof window === 'undefined') return DEFAULT_SESSION;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION,
      ...parsed,
      step:
        parsed.unlocked && parsed.step >= 1 && parsed.step <= 9
          ? parsed.step
          : parsed.unlocked
            ? 1
            : 0,
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

export default function BirthdayExperience() {
  const [session, setSession] = useState(loadSession);
  const audio = useAudio();

  // Persist progress within the active browser session
  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [session]);

  // Keep page <title> descriptive per current screen (SPA accessibility)
  useEffect(() => {
    const activeMeta = JOURNEY_STEPS[session.step];
    document.title = activeMeta
      ? `${activeMeta.title} | ${birthdayConfig.siteName}`
      : birthdayConfig.siteName;
  }, [session.step]);

  const goToStep = (nextStep) => {
    const clamped = Math.max(0, Math.min(JOURNEY_STEPS.length - 1, nextStep));
    setSession((prev) => ({
      ...prev,
      step: prev.unlocked ? Math.max(1, clamped) : 0,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlock = () => {
    setSession((prev) => ({
      ...prev,
      unlocked: true,
      step: 1,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayAll = () => {
    setSession(DEFAULT_SESSION);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoWelcome = () => {
    goToStep(1);
  };

  const handleOpenGift = (giftKey) => {
    setSession((prev) => ({
      ...prev,
      openedGifts: {
        ...prev.openedGifts,
        [giftKey]: true,
      },
    }));
  };

  const handleToggleWish = (wishId) => {
    setSession((prev) => ({
      ...prev,
      openedWishes: {
        ...prev.openedWishes,
        [wishId]: !prev.openedWishes[wishId],
      },
    }));
  };

  const currentStep = session.unlocked ? Math.max(1, session.step) : 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-[100dvh] flex-col">
        <a
          href="#main-content"
          className="visually-hidden rounded-full bg-[#9E3C65] px-4 py-2 text-sm font-semibold text-white focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to main content
        </a>

        <FloatingDecorations
          density={currentStep === 1 || currentStep === 9 ? 'festive' : 'normal'}
        />

        {session.unlocked && (
          <TopUniverseBar
            currentStepIndex={currentStep}
            onSelectStep={goToStep}
            onRestart={handleGoWelcome}
            audio={audio}
          />
        )}

        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 12, scale: 0.992 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.992 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentStep === 0 && (
                <PasswordLock
                  onUnlock={handleUnlock}
                  playChime={audio.playChime}
                />
              )}

              {currentStep === 1 && (
                <WelcomeScreen
                  onStart={() => goToStep(2)}
                  playChime={audio.playChime}
                />
              )}

              {currentStep === 2 && (
                <MusicPlayer audio={audio} onNext={() => goToStep(3)} />
              )}

              {currentStep === 3 && <PhotoGallery />}

              {currentStep === 4 && (
                <GiftBoxes
                  openedGifts={session.openedGifts}
                  onOpenGift={handleOpenGift}
                  playChime={audio.playChime}
                />
              )}

              {currentStep === 5 && (
                <BirthdayCake
                  isExtinguished={session.cakeExtinguished}
                  onExtinguish={() =>
                    setSession((prev) => ({ ...prev, cakeExtinguished: true }))
                  }
                  onRelight={() =>
                    setSession((prev) => ({ ...prev, cakeExtinguished: false }))
                  }
                  playChime={audio.playChime}
                />
              )}

              {currentStep === 6 && (
                <BirthdayLetter
                  isOpened={session.letterOpened}
                  onOpenLetter={() =>
                    setSession((prev) => ({ ...prev, letterOpened: true }))
                  }
                  playChime={audio.playChime}
                />
              )}

              {currentStep === 7 && (
                <FutureNurseJourney playChime={audio.playChime} />
              )}

              {currentStep === 8 && (
                <WishWall
                  openedWishes={session.openedWishes}
                  onToggleWish={handleToggleWish}
                  playChime={audio.playChime}
                />
              )}

              {currentStep === 9 && (
                <FinalSurprise onReplay={handleReplayAll} audio={audio} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {session.unlocked && (
          <Navigation
            currentStepIndex={currentStep}
            onPrev={() => goToStep(currentStep - 1)}
            onNext={() => goToStep(currentStep + 1)}
            onSelectStep={goToStep}
          />
        )}
      </div>
    </MotionConfig>
  );
}

