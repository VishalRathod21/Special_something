import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import TeddyIllustration from './TeddyIllustration';
import { WashiTape } from './ScrapbookAccents';

const photoSlideVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir === 0 ? 0 : dir > 0 ? 28 : -28,
    scale: dir === 0 ? 0.96 : 0.985,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir === 0 ? 0 : dir > 0 ? -28 : 28,
    scale: 0.985,
  }),
};

export default function PhotoGallery() {
  const photos = birthdayConfig.memories.items;
  const [activeIdx, setActiveIdx] = useState(null);
  const [direction, setDirection] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const dialogRef = useRef(null);

  const activePhoto = activeIdx !== null ? photos[activeIdx] : null;

  const openPhoto = (idx) => {
    setDirection(0);
    setActiveIdx(idx);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  };

  const closeLightbox = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
    }
    setActiveIdx(null);
  };

  const goPrev = () => {
    setDirection(-1);
    setActiveIdx((prev) =>
      prev === null ? 0 : (prev - 1 + photos.length) % photos.length
    );
  };

  const goNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev === null ? 0 : (prev + 1) % photos.length));
  };

  const goToIndex = (targetIdx) => {
    if (activeIdx === null || targetIdx === activeIdx) return;
    setDirection(targetIdx > activeIdx ? 1 : -1);
    setActiveIdx(targetIdx);
  };

  // Fallback light dismiss when browser lacks <dialog closedby="any"> + keyboard arrows
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const handleClose = () => {
      dialog.returnValue = '';
      setActiveIdx(null);
    };

    const handleKeyDown = (e) => {
      if (!dialog.open) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };

    let pressedOutside = false;
    const isOutside = (e) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };

    const handlePointerDown = (e) => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        pressedOutside = isOutside(e);
      }
    };
    const handlePointerUp = (e) => {
      if (
        !('closedBy' in HTMLDialogElement.prototype) &&
        pressedOutside &&
        isOutside(e)
      ) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('keydown', handleKeyDown);
    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('keydown', handleKeyDown);
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length]);

  return (
    <section
      aria-labelledby="moments-heading"
      className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-5 pb-4"
    >
      <div className="scrapbook-paper lace-border relative rounded-[2.25rem] border-2 border-[#F8C8DC] px-5 py-7 shadow-md sm:px-9 sm:py-9">
        {/* Cute Scrapbook Stickers */}
        <img
          src="/stickers/pink-bow.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-4 right-5 hidden h-9 w-16 rotate-12 opacity-90 sm:block"
        />
        <img
          src="/stickers/star-sparkle.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-5 hidden h-10 w-10 -rotate-12 opacity-85 sm:block"
        />

        {/* Header Row */}
        <div className="mb-7 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#9E3C65] shadow-xs">
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Birthday Photo Scrapbook</span>
            </span>
            <h1
              id="moments-heading"
              className="font-display mt-2 text-2xl font-bold text-[#513B48] sm:text-4xl"
            >
              {birthdayConfig.memories.heading}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-[#6F5564] sm:text-base">
              {birthdayConfig.memories.subheading}
            </p>
          </div>
          <TeddyIllustration mood="camera" className="h-24 w-24 shrink-0" />
        </div>

        {/* Hanging Twine Divider */}
        <div
          aria-hidden="true"
          className="mb-6 hidden h-4 w-full border-t-2 border-dashed border-[#C96B91]/45 sm:block"
        />

        {/* Hanging Polaroid Grid */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, idx) => {
            const hasFailed = failedImages[photo.id];
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="scroll-reveal-card relative flex flex-col items-center"
              >
                {/* Decorative Photo Clip + Washi Tape */}
                <div
                  aria-hidden="true"
                  className="z-10 -mb-2.5 flex flex-col items-center"
                >
                  <span className="h-5 w-3 rounded-t-full border-2 border-[#C96B91] bg-[#FFF8F3] shadow-xs" />
                  <WashiTape color={photo.tapeColor} className="-mt-1" />
                </div>

                <button
                  type="button"
                  onClick={() => openPhoto(idx)}
                  style={{ '--tilt': `${photo.tilt || 0}deg` }}
                  className="group relative w-full max-w-[20rem] rotate-[var(--tilt)] rounded-xl border border-[#F8C8DC] bg-white p-3.5 pb-5 text-left shadow-md transition-transform duration-300 hover:scale-[1.02] hover:rotate-0 focus-visible:rotate-0"
                  aria-label={`Zoom in on photo ${idx + 1}: ${photo.caption}`}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-[#FCE4EC]">
                    {hasFailed ? (
                      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-xs text-[#6F5564]">
                        <Sparkles className="mb-1 h-5 w-5 text-[#9E3C65]" />
                        <span>Image missing — check {photo.src}</span>
                      </div>
                    ) : (
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        width={400}
                        height={400}
                        onError={() =>
                          setFailedImages((prev) => ({
                            ...prev,
                            [photo.id]: true,
                          }))
                        }
                        className="h-full w-full object-cover object-[50%_18%] transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-2">
                    <p className="font-hand text-xl leading-snug font-semibold text-[#513B48]">
                      {photo.caption}
                    </p>
                  </div>
                  {photo.tag && (
                    <span className="mt-2 inline-block rounded-full bg-[#FCE4EC] px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#9E3C65]">
                      {photo.tag}
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Simple Quick-Open Hint & Browse Action */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F8C8DC] bg-white/85 px-4 py-3 text-xs text-[#6F5564]">
          <span>
            Tap any Polaroid above to zoom in and flip through with Next /
            Previous ✨
          </span>
          <button
            type="button"
            onClick={() => openPhoto(0)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#FCE4EC] px-3.5 py-1.5 text-xs font-semibold text-[#9E3C65] transition-colors hover:bg-[#F8C8DC]"
          >
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            <span>View Photos One by One</span>
          </button>
        </div>
      </div>

      {/* Native <dialog> Lightbox Modal */}
      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby="lightbox-caption"
        className="w-full"
      >
        {activePhoto && (
          <div className="paper-card relative mx-auto overflow-hidden rounded-[2rem] border-2 border-[#F8C8DC] p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#FCE4EC] px-3 py-1 text-xs font-semibold text-[#9E3C65]">
                {activePhoto.tag || `Photo ${activeIdx + 1}`} ·{' '}
                {activeIdx + 1} / {photos.length}
              </span>
              <button
                type="button"
                autoFocus
                onClick={closeLightbox}
                aria-label="Close photo preview"
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-[#EFA9C2] bg-white text-[#513B48] transition-colors hover:bg-[#FCE4EC]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex min-h-56 w-full items-center justify-center overflow-hidden rounded-2xl border border-[#F8C8DC] bg-[#FCE4EC]/75 p-2">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activePhoto.id}
                  custom={direction}
                  variants={photoSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="flex w-full items-center justify-center"
                >
                  {failedImages[activePhoto.id] ? (
                    <div className="flex h-64 w-full flex-col items-center justify-center p-6 text-center text-sm text-[#6F5564]">
                      <Sparkles className="mb-2 h-6 w-6 text-[#9E3C65]" />
                      <span>Image missing — check {activePhoto.src}</span>
                    </div>
                  ) : (
                    <img
                      src={activePhoto.src}
                      alt={activePhoto.alt}
                      onError={() =>
                        setFailedImages((prev) => ({
                          ...prev,
                          [activePhoto.id]: true,
                        }))
                      }
                      className="max-h-[60dvh] w-auto max-w-full rounded-xl object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators for jumping between photos */}
            <div
              className="mt-3 flex flex-wrap items-center justify-center gap-1"
              role="group"
              aria-label="Select photo"
            >
              {photos.map((item, idx) => {
                const isCurrent = idx === activeIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToIndex(idx)}
                    aria-label={`View photo ${idx + 1} of ${photos.length}`}
                    aria-current={isCurrent ? 'true' : undefined}
                    className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full px-0.5"
                  >
                    <span
                      className={`block h-2.5 rounded-full transition-all ${
                        isCurrent
                          ? 'w-7 bg-[#9E3C65]'
                          : 'w-2.5 bg-[#EFA9C2]/80 hover:bg-[#C96B91]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <h2
                id="lightbox-caption"
                className="font-hand text-center text-2xl font-bold text-[#513B48] sm:text-left sm:text-3xl"
              >
                {activePhoto.caption}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous photo"
                  className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[#EFA9C2] bg-white px-4 py-2 text-sm font-semibold text-[#513B48] transition-colors hover:bg-[#FCE4EC]"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next photo"
                  className="inline-flex min-h-11 items-center gap-1 rounded-full bg-[#9E3C65] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#843054]"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
