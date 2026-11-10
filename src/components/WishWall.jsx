import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import TeddyIllustration from './TeddyIllustration';

const NOTE_STYLES = {
  pink: 'bg-[#FCE4EC] border-[#F8C8DC]',
  cream: 'bg-[#FFFDF5] border-[#F2DCC4]',
  lavender: 'bg-[#E9DDF8] border-[#D5C2F0]',
  rose: 'bg-[#F8C8DC]/70 border-[#EFA9C2]',
};

export default function WishWall({ openedWishes, onToggleWish, playChime }) {
  const notes = birthdayConfig.wishWall.notes;
  const discoveredCount = notes.filter((n) => openedWishes[n.id]).length;

  const handleFlip = (id) => {
    if (!openedWishes[id]) {
      playChime?.('sparkle');
    }
    onToggleWish(id);
  };

  return (
    <section
      aria-labelledby="wishes-heading"
      className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-5 pb-4"
    >
      <div className="scrapbook-paper lace-border relative rounded-[2.25rem] border-2 border-[#F8C8DC] px-5 py-7 shadow-md sm:px-9 sm:py-9">
        <div className="mb-7 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#9E3C65] shadow-xs">
              <Star
                className="h-3.5 w-3.5 fill-[#F8C8DC] text-[#9E3C65]"
                aria-hidden="true"
              />
              <span>
                {discoveredCount} of {notes.length} Wishes Revealed
              </span>
            </span>
            <h1
              id="wishes-heading"
              className="font-display mt-2 text-2xl font-bold text-[#513B48] sm:text-4xl"
            >
              {birthdayConfig.wishWall.heading} ⭐
            </h1>
            <p className="mt-1 text-sm text-[#6F5564] sm:text-base">
              {birthdayConfig.wishWall.subheading}
            </p>
          </div>
          <TeddyIllustration mood="wish" className="h-24 w-24 shrink-0" />
        </div>

        {/* Special Highlighted Friendship Note */}
        {birthdayConfig.wishWall.highlightedNote && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-8 max-w-2xl rounded-3xl border-2 border-[#EFA9C2] bg-white px-5 py-4 text-center shadow-sm sm:px-7"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] px-3 py-0.5 text-xs font-bold text-[#9E3C65]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Special Note</span>
            </span>
            <p className="font-hand mt-2 text-2xl font-bold text-[#513B48] sm:text-3xl">
              {birthdayConfig.wishWall.highlightedNote}
            </p>
          </motion.div>
        )}

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note, idx) => {
            const isFlipped = Boolean(openedWishes[note.id]);
            const palette = NOTE_STYLES[note.color] || NOTE_STYLES.pink;

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ delay: idx * 0.05, duration: 0.38 }}
                className="scroll-reveal-card"
              >
                <button
                  type="button"
                  onClick={() => handleFlip(note.id)}
                  aria-pressed={isFlipped}
                  style={{ '--note-tilt': `${note.tilt || 0}deg` }}
                  className={`group relative flex min-h-48 w-full rotate-[var(--note-tilt)] flex-col justify-between rounded-2xl border-2 p-5 text-left shadow-md transition-all duration-300 hover:rotate-0 hover:-translate-y-1.5 hover:shadow-lg focus-visible:rotate-0 ${palette}`}
                >
                  {/* Floating Heart Pin */}
                  <span
                    aria-hidden="true"
                    style={{ animationDelay: `${idx * 0.4}s` }}
                    className="anim-gentle-bob mx-auto -mt-8 mb-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#9E3C65] text-white shadow-sm"
                  >
                    <Heart className="h-3.5 w-3.5 fill-white" />
                  </span>

                  <div className="flex flex-1 flex-col justify-center">
                    {!isFlipped ? (
                      <>
                        <p className="font-hand text-center text-2xl leading-snug font-bold text-[#513B48] sm:text-[1.65rem]">
                          &ldquo;{note.front}&rdquo;
                        </p>
                        <p className="mt-3 text-center text-xs font-semibold text-[#9E3C65]">
                          Tap to read secret note ✨
                        </p>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-xl bg-white/80 p-3.5 text-center shadow-2xs"
                      >
                        <p className="mb-1 inline-flex items-center gap-1 text-[0.7rem] font-bold tracking-wide text-[#9E3C65] uppercase">
                          <Sparkles className="h-3 w-3" aria-hidden="true" />
                          <span>Hidden Wish</span>
                        </p>
                        <p className="text-sm leading-relaxed font-medium text-[#513B48]">
                          {note.back}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[0.72rem] font-medium text-[#6F5564]">
                    <span>Wish #{idx + 1}</span>
                    <span>{isFlipped ? 'Tap to fold back' : '✨ Sealed'}</span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

