/**
 * ============================================================================
 * VANSHIKA'S LITTLE BIRTHDAY UNIVERSE — PERSONALIZATION CONFIG
 * ============================================================================
 * Edit ONLY this file to customize names, PIN, songs, photos, gifts,
 * birthday letter, Future Nurse Journey board, wish wall notes, and finale.
 * No React or component code edits needed!
 */

export const birthdayConfig = {
  // --------------------------------------------------------------------------
  // 1. IDENTITY & THEME META
  // --------------------------------------------------------------------------
  siteName: "Vanshika's Little Birthday Universe",
  tagline: 'A Little World Made Especially For My Friend.',
  recipientName: 'Vanshika',
  senderName: 'Vishal Rathod',
  birthdayDate: 'Happy Birthday!',

  // --------------------------------------------------------------------------
  // 2. SCREEN 01 — SECRET BIRTHDAY LOCK
  // --------------------------------------------------------------------------
  secretPin: '2006',
  pinHint: 'Psst! Think of your special year 🎀 (code: 2006)',
  lockScreen: {
    heading: 'Hey Vanshika! 🎀',
    subheading: 'A little birthday surprise from a friend is waiting for you...',
    inputLabel: 'Enter your secret birthday code',
    wrongPinMessages: [
      "Oops! Close, but teddy says try again! 🧸",
      'Hmm, that secret code needs another sprinkle of birthday magic ✨',
      "Not quite that one! Tap 'Need a hint?' if you'd like a clue 🎀",
    ],
  },

  // --------------------------------------------------------------------------
  // 3. SCREEN 02 — WELCOME SCREEN
  // --------------------------------------------------------------------------
  welcomeScreen: {
    heading: 'YAYYYY! YOU MADE IT!',
    subheading: 'Welcome to your little birthday universe, Vanshika!',
    description:
      'Take a cheerful stroll through your birthday music room, friendship scrapbook, secret gifts, birthday cake, future nurse dream board, and birthday wishes made especially for you.',
    ctaLabel: 'Start The Surprise',
  },

  // --------------------------------------------------------------------------
  // 4. SCREEN 03 — BIRTHDAY MUSIC ROOM
  // --------------------------------------------------------------------------
  music: {
    playlistHeading: "Vanshika's Bollywood Birthday Playlist 🎀",
    tracks: [
      {
        id: 'pretty-woman',
        title: 'Pretty Woman',
        artist: 'Shankar-Ehsaan-Loy, Shankar Mahadevan, Ravi Khote',
        movie: 'Kal Ho Naa Ho',
        note: 'Feel-good celebration rhythm made for smiling all day 💖',
        src: 'https://p.scdn.co/mp3-preview/ae326eb1c53ff4e484917f826025b819a216251e',
        fallbackSrc:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d3/f0/68/d3f06820-4398-f6e4-4603-1c93f11450f6/mzaf_13445506147409921183.plus.aac.p.m4a',
        coverArt:
          'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02a2055e0b847ff66fb5206099',
        spotifyId: '3rsx3pDYM3a08O0Yu3Tq6V',
        spotifyUri: 'spotify:track:3rsx3pDYM3a08O0Yu3Tq6V',
        spotifyUrl: 'https://open.spotify.com/track/3rsx3pDYM3a08O0Yu3Tq6V',
        spotifyEmbedUrl:
          'https://open.spotify.com/embed/track/3rsx3pDYM3a08O0Yu3Tq6V?utm_source=generator',
        accent: '#EFA9C2',
      },
      {
        id: 'ooo-jaane-jana',
        title: 'Ooo Jaane Jana',
        artist: 'RH Rahat',
        movie: 'Single',
        note: 'Sweet acoustic-vibe track added specially for your playlist ✨',
        duration: 21,
        coverArt: 'https://i.ytimg.com/vi/9Ej9zkwJi1A/hqdefault.jpg',
        youtubeId: '9Ej9zkwJi1A',
        youtubeUrl: 'https://www.youtube.com/watch?v=9Ej9zkwJi1A',
        youtubeEmbedUrl:
          'https://www.youtube.com/embed/9Ej9zkwJi1A?enablejsapi=1&rel=0',
        accent: '#F8C8DC',
      },
      {
        id: 'hosanna',
        title: 'Hosanna',
        artist: "A.R. Rahman, Leon D'souza, Suzanne D'Mello",
        movie: 'Ekk Deewana Tha',
        note: 'Starting from "Udti hui titli..." — A.R. Rahman magic for your birthday ✨',
        startSeconds: 197,
        duration: 137,
        coverArt:
          'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025e231170542621d8db3fc7fb',
        youtubeId: 'b8vDgqGNwKw',
        youtubeUrl: 'https://www.youtube.com/watch?v=b8vDgqGNwKw&t=197s',
        youtubeEmbedUrl:
          'https://www.youtube.com/embed/b8vDgqGNwKw?enablejsapi=1&rel=0&start=197',
        accent: '#E9DDF8',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 5. SCREEN 04 — VANSHIKA'S BEAUTIFUL MOMENTS (PHOTO GALLERY)
  // --------------------------------------------------------------------------
  memories: {
    heading: "Vanshika's Beautiful Moments 📸",
    subheading:
      'A little collection of your lovely pictures, because every picture has its own charm. 💗',
    items: [
      {
        id: 'mem-1',
        src: '/photos/photo-1.jpg',
        alt: 'Vanshika playing an acoustic guitar in a floral dress',
        caption: 'Strumming gentle melodies & cozy vibes 🎸',
        tag: 'Moment 01',
        tilt: -2.5,
        tapeColor: 'pink',
      },
      {
        id: 'mem-2',
        src: '/photos/photo-2.jpg',
        alt: 'Vanshika smiling while reading a notebook',
        caption: 'Stories, smiles & quiet pages ✨',
        tag: 'Moment 02',
        tilt: 2,
        tapeColor: 'lavender',
      },
      {
        id: 'mem-3',
        src: '/photos/photo-3.jpg',
        alt: 'Vanshika smiling beside tropical monstera leaves',
        caption: 'Golden glow & bright smiles 🌿',
        tag: 'Moment 03',
        tilt: -1.5,
        tapeColor: 'cream',
      },
      {
        id: 'mem-4',
        src: '/photos/photo-4.jpg',
        alt: 'Vanshika dressed in navy and gold embroidery under festive lights',
        caption: 'Sparkling lights & festive elegance ✨',
        tag: 'Moment 04',
        tilt: 2.5,
        tapeColor: 'pink',
      },
      {
        id: 'mem-5',
        src: '/photos/photo-5.jpg',
        alt: 'Vanshika wearing a flower in her hair with a warm pastel collage',
        caption: 'Flowers, sunshine & cheerful energy 🌸',
        tag: 'Moment 05',
        tilt: -2,
        tapeColor: 'lavender',
      },
      {
        id: 'mem-6',
        src: '/photos/photo-6.jpg',
        alt: 'Vanshika in a classic monochrome portrait with a flower behind her ear',
        caption: 'Classic black & white smile 🤍',
        tag: 'Moment 06',
        tilt: 1.5,
        tapeColor: 'cream',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 6. SCREEN 05 — THREE SECRET GIFTS
  // --------------------------------------------------------------------------
  gifts: {
    heading: 'Three Little Gifts For You',
    subheading: 'Tap each ribbon-tied box to unwrap what is tucked inside.',
    complimentsTitle: "Reasons You're Amazing",
    compliments: [
      'You bring such a warm, cheerful brightness into every conversation.',
      'Your sense of humor turns ordinary days into fun ones.',
      'You are genuinely kind, thoughtful, and easy to talk to as a friend.',
      'You notice small details that make people feel appreciated.',
      'Your determination toward your nursing goals is truly inspiring.',
      'You handle busy days with quiet strength and grace.',
      'Even through a screen, your positivity lifts the mood right away.',
      'You make random everyday chats genuinely fun and memorable.',
      'You care deeply about helping others and staying true to yourself.',
      "I'm glad to have you as a friend — you make every chat brighter!",
    ],
    memoryGiftTitle: 'A Little Memory',
    memoryGift: {
      src: '/photos/photo-5.jpg',
      alt: 'Keepsake portrait of Vanshika with a flower tucked in her hair',
      caption: 'A bright keepsake portrait saved for my friend on her birthday 🌼',
      note: 'Swap this image in /public/photos/ and update birthdayConfig.js anytime!',
    },
    secretLetterTitle: 'A Secret Friendship Note',
    secretLetter: {
      salutation: 'Hey Vanshika —',
      body: "I'm genuinely glad to have you as a friend. No matter how busy life gets, I hope you always remember someone is cheering loudly for your happiness, your peace of mind, and your dream of becoming an amazing nurse.",
      closing: 'Your friend cheering you on! 🎀',
    },
  },

  // --------------------------------------------------------------------------
  // 7. SCREEN 06 — MAKE A WISH (BIRTHDAY CAKE)
  // --------------------------------------------------------------------------
  cake: {
    heading: 'Make A Wish, Birthday Girl!',
    subheading:
      'Close your eyes, make a big birthday wish, and tap the candle (or use your mic to blow it out!).',
    wishRevealedTitle: 'Wish Sent To The Stars! ✨',
    wishRevealedMessage:
      'May every good wish you made today come true with happiness, strength, and success. Happy Birthday, Vanshika!',
  },

  // --------------------------------------------------------------------------
  // 8. SCREEN 07 — BIRTHDAY LETTER
  // --------------------------------------------------------------------------
  letter: {
    heading: 'A Little Birthday Note For You 💌',
    buttonLabel: 'Open Your Birthday Letter',
    bodyTemplate: `Dear Vanshika,

Happiest Birthday to you! 🎂

I hope your special day brings you lots of happiness, laughter and beautiful memories.

I'm genuinely glad that we became friends. Even though our friendship started online, it is always nice to have someone with whom you can share random conversations, funny moments and little things from everyday life.

As you step into another year of your life, I wish you endless happiness, good health, confidence and success.

And one special wish for your future: I hope you achieve your dream of becoming a nurse. May your hard work, dedication and patience take you towards the career you have always wanted.

I hope you become a confident, skilled and compassionate nurse who makes a positive difference in people's lives.

There may be challenging days along the way, but never give up on yourself or your dreams.

Keep learning, keep smiling and keep moving forward.

Wishing you an amazing birthday and an even more amazing year ahead!

Stay happy, stay blessed and keep being yourself.

Your friend,
{{senderName}}`,
  },

  // --------------------------------------------------------------------------
  // 9. SCREEN 08 — VANSHIKA'S FUTURE NURSE JOURNEY
  // --------------------------------------------------------------------------
  nurseJourney: {
    screenTitle: "Vanshika's Future Nurse Journey",
    heading: 'Your Future Is Full Of Beautiful Possibilities!',
    subheading:
      'One little dream, a thousand beautiful possibilities. Keep believing in yourself, Vanshika!',
    cards: {
      dream: {
        badge: 'CARD 01 — The Dream',
        heading: 'Your Dream To Become A Nurse',
        message:
          'Every big achievement starts with a dream. Keep learning, keep growing and never stop believing in yourself.',
      },
      journey: {
        badge: 'CARD 02 — Your Journey',
        heading: 'Steps Towards Your Dream',
        steps: [
          'Learning something new every day.',
          'Building medical knowledge.',
          'Developing practical skills.',
          'Becoming confident in patient care.',
          'Working towards becoming a qualified nurse.',
        ],
      },
      wishes: {
        badge: 'CARD 03 — Future Wishes',
        heading: 'Warm Wishes For Your Path',
        items: [
          'May you achieve your nursing dreams.',
          'May your hard work open beautiful opportunities.',
          'May you become a confident and compassionate nurse.',
          'May you always find strength during difficult days.',
          'May your future be filled with success and happiness.',
        ],
      },
      motivation: {
        badge: 'CARD 04 — A Little Motivation',
        heading: 'Keep Believing In Yourself',
        message:
          'Some dreams require patience, courage and countless efforts. Never underestimate how far your dedication can take you. Keep going, future nurse!',
        futureWishButtonLabel: 'Send A Little Wish To My Future Self ✨',
        futureSelfNote: `Dear Future Vanshika,

I hope you are proud of the journey you have taken. Never forget the dreams you started with.

Keep shining!`,
      },
    },
  },

  // --------------------------------------------------------------------------
  // 10. SCREEN 09 — YOUR BIRTHDAY WISH WALL
  // --------------------------------------------------------------------------
  wishWall: {
    heading: 'A Few Little Wishes For You',
    subheading:
      'Tap each pastel sticky note to flip it and reveal an encouraging birthday note.',
    highlightedNote:
      'To my friend Vanshika — keep dreaming big. Your future is waiting for you! 🎀',
    notes: [
      {
        id: 'w1',
        front: 'May your days always be filled with happiness.',
        back: 'May every morning bring you good vibes, genuine smiles, and joyful little moments! 😊',
        color: 'pink',
        tilt: -2.2,
      },
      {
        id: 'w2',
        front: 'May your dreams turn into beautiful achievements.',
        back: 'Every step you take and every hour you study brings those big goals closer to reality ✨',
        color: 'cream',
        tilt: 1.8,
      },
      {
        id: 'w3',
        front: 'May you become the nurse you aspire to be.',
        back: 'Skilled, steady, compassionate, and proud of the difference you make in people’s lives 🩺',
        color: 'lavender',
        tilt: -1.4,
      },
      {
        id: 'w4',
        front: 'May your hard work bring you the success you deserve.',
        back: 'Your patience and dedication will open wonderful doors when the time is right 🌟',
        color: 'rose',
        tilt: 2.3,
      },
      {
        id: 'w5',
        front: 'May you always have the courage to face new challenges.',
        back: 'Even on tough days, remember how resilient and capable you really are 💪',
        color: 'cream',
        tilt: -1.9,
      },
      {
        id: 'w6',
        front: 'May this new year of your life bring countless reasons to smile.',
        back: 'Wishing you health, good energy, awesome memories, and laughter all year long! 🎂',
        color: 'pink',
        tilt: 1.6,
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 11. SCREEN 10 — THE GRAND BIRTHDAY FINALE
  // --------------------------------------------------------------------------
  finale: {
    heading: 'Happy Birthday Vanshika! 🎂',
    subheading:
      'Another year, another chapter, and so many beautiful dreams waiting to come true!',
    personalMessage: `Wishing you happiness, good health, success and a wonderful future. May you achieve your dreams and become the amazing nurse you aspire to be.

Keep smiling, keep growing and never stop believing in yourself.

Happy Birthday, my friend! ❤️`,
    replayLabel: 'Replay Your Surprise',
    musicAgainLabel: 'Play Birthday Music Again',
    secretSurpriseButtonLabel: 'One Last Little Surprise 💌',
    secretSurpriseTitle: 'A Final Little Birthday Note For You ✨',
    secretSurpriseMessage: `Hey Vanshika,

Thank you for being such a genuine, kind, and cheerful friend. Before this birthday universe closes, remember that someone is always cheering for your happiness, your confidence, and your dream of becoming an amazing nurse.

Wishing you a year filled with proud milestones, good health, and countless reasons to smile. Happy Birthday once again! 🎀`,
  },
};

export function getFormattedLetter() {
  return birthdayConfig.letter.bodyTemplate.replace(
    /\{\{senderName\}\}/g,
    birthdayConfig.senderName
  );
}
