import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, Gift, Heart, Mail, Sparkles } from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import TeddyIllustration from './TeddyIllustration';
import { RibbonBow } from './ScrapbookAccents';
import { launchElementConfetti } from '../utils/effects';

const GIFT_META = [
  {
    key: 'gift1',
    number: 'Gift 01',
    title: birthdayConfig.gifts.complimentsTitle,
    boxColor: '#F8C8DC',
    lidColor: '#FCE4EC',
    ribbonColor: '#9E3C65',
    icon: Sparkles,
  },
  {
    key: 'gift2',
    number: 'Gift 02',
    title: birthdayConfig.gifts.memoryGiftTitle,
    boxColor: '#E9DDF8',
    lidColor: '#F5EEFD',
    ribbonColor: '#9E3C65',
    icon: Camera,
  },
  {
    key: 'gift3',
    number: 'Gift 03',
    title: birthdayConfig.gifts.secretLetterTitle,
    boxColor: '#FCE4EC',
    lidColor: '#FFF8F3',
    ribbonColor: '#C96B91',
    icon: Mail,
  },
];

export default function GiftBoxes({
  openedGifts,
  onOpenGift,
  playChime,
}) {
  const [selectedGift, setSelectedGift] = useState(
    () => GIFT_META.find((g) => openedGifts[g.key])?.key || null
  );
  const [giftImgFailed, setGiftImgFailed] = useState(false);

  const handleGiftClick = (giftKey, targetElement) => {
    const isFirstOpen = !openedGifts[giftKey];
    if (isFirstOpen) {
      onOpenGift(giftKey);
      playChime?.('gift');
      launchElementConfetti(targetElement);
    }
    setSelectedGift(giftKey);
  };

  const openedCount = Object.values(openedGifts).filter(Boolean).length;

  return (
    <section
      aria-labelledby="gifts-heading"
      className="relative z-10 mx-auto w-full max-w-4xl px-4 pt-5 pb-4"
    >
      <div className="paper-card lace-border relative rounded-[2.25rem] px-5 py-7 sm:px-9 sm:py-9">
        <div className="mb-7 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] px-3 py-1 text-xs font-semibold text-[#9E3C65]">
              <Gift className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{openedCount} of 3 Gifts Opened</span>
            </span>
            <h1
              id="gifts-heading"
              className="font-display mt-2 text-2xl font-bold text-[#513B48] sm:text-4xl"
            >
              {birthdayConfig.gifts.heading} 🎁
            </h1>
            <p className="mt-1 text-sm text-[#6F5564] sm:text-base">
              {birthdayConfig.gifts.subheading}
            </p>
          </div>
          <TeddyIllustration mood="gift" className="h-24 w-24 shrink-0" />
        </div>

        {/* 3 Gift Boxes */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {GIFT_META.map((gift) => {
            const isOpened = Boolean(openedGifts[gift.key]);
            const isSelected = selectedGift === gift.key;
            const Icon = gift.icon;

            return (
              <motion.button
                key={gift.key}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => handleGiftClick(gift.key, e.currentTarget)}
                aria-expanded={isSelected}
                className={`group relative flex flex-col items-center rounded-3xl border-2 p-5 text-center transition-all ${
                  isSelected
                    ? 'border-[#9E3C65] bg-[#FCE4EC]/75 shadow-md'
                    : 'border-[#F8C8DC] bg-[#FFF8F3] shadow-xs hover:border-[#EFA9C2]'
                }`}
              >
                {/* Status Badge */}
                <span
                  className={`mb-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${
                    isOpened
                      ? 'bg-[#9E3C65] text-white'
                      : 'bg-white text-[#9E3C65] ring-1 ring-[#EFA9C2]'
                  }`}
                >
                  {isOpened ? (
                    <>
                      <Check className="h-3 w-3" aria-hidden="true" />
                      <span>Opened</span>
                    </>
                  ) : (
                    <span>Tap to Unwrap</span>
                  )}
                </span>

                {/* Gift Box Graphic */}
                <div
                  className={`relative my-2 flex h-28 w-28 flex-col items-center justify-end ${
                    !isOpened ? 'anim-gift-shiver' : ''
                  }`}
                  aria-hidden="true"
                >
                  {/* Lid (pops up & tilts when opened) */}
                  <motion.div
                    animate={
                      isOpened
                        ? { y: -16, rotate: -14, x: -6 }
                        : { y: 0, rotate: 0, x: 0 }
                    }
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                    className="relative z-20 flex flex-col items-center"
                  >
                    <RibbonBow className="-mb-2 h-6 w-12" />
                    <div
                      className="h-6 w-24 rounded-lg border-2 border-[#C96B91] shadow-xs"
                      style={{ backgroundColor: gift.lidColor }}
                    >
                      <div
                        className="mx-auto h-full w-4"
                        style={{ backgroundColor: gift.ribbonColor }}
                      />
                    </div>
                  </motion.div>

                  {/* Box Base */}
                  <div
                    className="relative z-10 -mt-1 flex h-16 w-22 items-center justify-center rounded-b-xl border-2 border-[#C96B91] shadow-sm"
                    style={{ backgroundColor: gift.boxColor }}
                  >
                    <div
                      className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2"
                      style={{ backgroundColor: gift.ribbonColor }}
                    />
                    <Icon className="relative z-10 h-5 w-5 text-white drop-shadow-xs" />
                  </div>
                </div>

                <span className="mt-2 text-xs font-semibold tracking-wider text-[#9E3C65] uppercase">
                  {gift.number}
                </span>
                <span className="font-display mt-0.5 text-lg font-bold text-[#513B48]">
                  {gift.title}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Gift Content Reveal Panel */}
        <AnimatePresence mode="wait">
          {selectedGift && (
            <motion.div
              key={selectedGift}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-7 rounded-3xl border-2 border-[#EFA9C2] bg-[#FFF8F3] p-5 shadow-sm sm:p-7"
            >
              {selectedGift === 'gift1' && (
                <div>
                  <h2 className="font-display text-center text-2xl font-bold text-[#513B48]">
                    10 Reasons You&apos;re Amazing ✨
                  </h2>
                  <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {birthdayConfig.gifts.compliments.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-2.5 rounded-2xl border border-[#F8C8DC] bg-white px-3.5 py-2.5 text-sm text-[#513B48] shadow-2xs"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FCE4EC] text-xs font-bold text-[#9E3C65]">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedGift === 'gift2' && (
                <div className="mx-auto max-w-sm text-center">
                  <h2 className="font-display mb-4 text-2xl font-bold text-[#513B48]">
                    {birthdayConfig.gifts.memoryGiftTitle} 📸
                  </h2>
                  <div className="mx-auto rounded-2xl border border-[#F8C8DC] bg-white p-3.5 pb-5 shadow-md">
                    <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[#FCE4EC]">
                      {giftImgFailed ? (
                        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-xs text-[#6F5564]">
                          <Sparkles className="mb-1 h-5 w-5 text-[#9E3C65]" />
                          <span>Image missing — check {birthdayConfig.gifts.memoryGift.src}</span>
                        </div>
                      ) : (
                        <img
                          src={birthdayConfig.gifts.memoryGift.src}
                          alt={birthdayConfig.gifts.memoryGift.alt}
                          onError={() => setGiftImgFailed(true)}
                          className="h-full w-full object-cover object-[50%_18%]"
                        />
                      )}
                    </div>
                    <p className="font-hand mt-3 text-2xl font-semibold text-[#513B48]">
                      {birthdayConfig.gifts.memoryGift.caption}
                    </p>
                  </div>
                </div>
              )}

              {selectedGift === 'gift3' && (
                <div className="mx-auto max-w-xl text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FCE4EC]">
                    <Heart
                      className="h-6 w-6 fill-[#9E3C65] text-[#9E3C65]"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#513B48]">
                    {birthdayConfig.gifts.secretLetterTitle} 💌
                  </h2>
                  <div className="mt-4 rounded-2xl border border-[#F8C8DC] bg-white p-5 text-left shadow-xs sm:p-6">
                    <p className="font-hand text-2xl font-bold text-[#9E3C65]">
                      {birthdayConfig.gifts.secretLetter.salutation}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#513B48] sm:text-base">
                      {birthdayConfig.gifts.secretLetter.body}
                    </p>
                    <p className="font-hand mt-3 text-right text-2xl font-semibold text-[#9E3C65]">
                      {birthdayConfig.gifts.secretLetter.closing}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

