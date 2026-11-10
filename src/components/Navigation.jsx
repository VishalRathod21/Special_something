import {
  ChevronLeft,
  ChevronRight,
  Home,
  Music2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';

export const JOURNEY_STEPS = [
  { id: 'lock', label: 'Lock', title: 'Secret Code' },
  { id: 'welcome', label: 'Welcome', title: 'Welcome' },
  { id: 'music', label: 'Music', title: 'Music Room' },
  { id: 'memories', label: 'Memories', title: 'Scrapbook' },
  { id: 'gifts', label: 'Gifts', title: 'Secret Gifts' },
  { id: 'cake', label: 'Cake', title: 'Make A Wish' },
  { id: 'letter', label: 'Letter', title: 'Birthday Letter' },
  { id: 'nurse', label: 'Future Nurse', title: "Vanshika's Future Nurse Journey" },
  { id: 'wishes', label: 'Wishes', title: 'Wish Wall' },
  { id: 'finale', label: 'Finale', title: 'Grand Finale' },
];

export function TopUniverseBar({
  currentStepIndex,
  onSelectStep,
  onRestart,
  audio,
}) {
  const { isPlaying, isMuted, currentTrack, togglePlay, toggleMute } = audio;

  return (
    <header className="sticky top-0 z-30 border-b border-[#F8C8DC]/80 bg-[#FFF8F3]/88 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-5">
        {/* Left: Home / Universe Title */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#EFA9C2] bg-white px-3 py-1.5 text-xs font-semibold text-[#513B48] shadow-xs transition-colors hover:bg-[#FCE4EC]"
            aria-label="Return to start screen"
          >
            <Home className="h-3.5 w-3.5 text-[#9E3C65]" aria-hidden="true" />
            <span className="hidden sm:inline">{birthdayConfig.siteName}</span>
            <span className="sm:hidden">Home</span>
          </button>
        </div>

        {/* Right: Persistent Music Controls */}
        <div
          className="flex items-center gap-1.5 rounded-full border border-[#EFA9C2] bg-white/95 px-2 py-1 shadow-xs"
          role="region"
          aria-label="Persistent music controls"
        >
          <button
            type="button"
            onClick={() => onSelectStep(2)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors hover:bg-[#FCE4EC] ${
              currentStepIndex === 2
                ? 'bg-[#FCE4EC] text-[#9E3C65]'
                : 'text-[#513B48]'
            }`}
            aria-label="Open Birthday Music Room"
          >
            <Music2
              className={`h-3.5 w-3.5 shrink-0 text-[#9E3C65] ${
                isPlaying ? 'animate-pulse' : ''
              }`}
              aria-hidden="true"
            />
            <span className="max-w-[9.5rem] truncate sm:max-w-[13rem]">
              {currentTrack?.title || 'Birthday Music'}
            </span>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full bg-[#9E3C65] text-white transition-colors hover:bg-[#843054]"
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5 translate-x-[0.5px]" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full text-[#513B48] transition-colors hover:bg-[#FCE4EC]"
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            aria-pressed={isMuted}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-[#9E3C65]" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4 text-[#513B48]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Navigation({
  currentStepIndex,
  onPrev,
  onNext,
  onSelectStep,
}) {
  // Unlocked journey steps exclude lock screen (index 0)
  const unlockedSteps = JOURNEY_STEPS.slice(1);
  const currentStep = JOURNEY_STEPS[currentStepIndex];
  const isFirstUnlocked = currentStepIndex <= 1;
  const isLast = currentStepIndex >= JOURNEY_STEPS.length - 1;

  return (
    <nav
      aria-label="Birthday journey progress"
      className="relative z-20 mx-auto mt-6 w-full max-w-4xl px-3 pb-8 sm:px-6"
    >
      <div className="paper-card rounded-3xl px-4 py-3.5 sm:px-6">
        {/* Progress Indicator Pills */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold tracking-wide text-[#9E3C65] uppercase">
            Chapter {currentStepIndex} of {JOURNEY_STEPS.length - 1} ·{' '}
            {currentStep?.title}
          </span>
          <span className="font-hand text-base text-[#6F5564]">
            {birthdayConfig.tagline}
          </span>
        </div>

        <ol className="mb-3.5 flex items-center gap-1.5 overflow-x-auto pb-1">
          {unlockedSteps.map((step, idx) => {
            const actualIndex = idx + 1;
            const isActive = actualIndex === currentStepIndex;
            const isPast = actualIndex < currentStepIndex;
            return (
              <li key={step.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectStep(actualIndex)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#9E3C65] text-white shadow-xs'
                      : isPast
                        ? 'bg-[#F8C8DC]/75 text-[#513B48] hover:bg-[#F8C8DC]'
                        : 'bg-[#FCE4EC]/75 text-[#6F5564] hover:bg-[#F8C8DC]/60'
                  }`}
                >
                  <span>{step.label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Prev / Next Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirstUnlocked}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-[#EFA9C2] bg-white px-4 py-2 text-sm font-semibold text-[#513B48] transition-colors hover:bg-[#FCE4EC] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Previous</span>
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#9E3C65] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#843054]"
            >
              <span>Next Surprise</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectStep(1)}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-[#EFA9C2] bg-[#FCE4EC] px-5 py-2 text-sm font-semibold text-[#513B48] transition-colors hover:bg-[#F8C8DC]"
            >
              <Home className="h-4 w-4 text-[#9E3C65]" aria-hidden="true" />
              <span>Back to Welcome</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

