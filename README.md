# Vanshika's Little Birthday Universe 🎀

**Tagline:** *A Little World Made Just For You.*

An interactive, pastel pink & kawaii teddy bear digital birthday scrapbook built with **React**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Lucide React**, **Lottie**, **Canvas Confetti**, and the **HTML5 Audio API**.

---

## ✨ What Is Inside (10 Interactive Screens)

1. **Secret Birthday Lock (`PasswordLock.jsx`)** — Heart-framed teddy lock with a responsive 4-digit keypad, keyboard support, playful wrong-code reactions, and unlock sparkle animation.
2. **Welcome To Your Little World (`WelcomeScreen.jsx`)** — Waving teddy bear, floating pastel balloons, clouds, Lottie sparkles, and confetti start transition.
3. **Your Birthday Music Room (`MusicPlayer.jsx`)** — Spinning retro pink vinyl turntable, animated equalizer, play/pause/next/prev, track selector, scrubbable progress bar, volume slider, optional Spotify embed mode, and persistent playback across screens.
4. **Our Little Memories (`PhotoGallery.jsx`)** — Hanging Polaroid scrapbook with photo clips, washi tape, handwritten captions, and an accessible `<dialog>` lightbox modal with keyboard and button navigation.
5. **Three Secret Gifts (`GiftBoxes.jsx`)** — Three shaking ribbon-tied gift boxes (*10 Reasons You're Amazing*, *A Little Memory*, *A Secret Letter*) with session-persistent opened state.
6. **Make A Wish (`BirthdayCake.jsx`)** — Two-tier strawberry pink cake with tap-to-blow candle extinguishing, optional microphone blow detection, rising smoke wisps, confetti, and a birthday slice reveal.
7. **A Little Letter For You (`BirthdayLetter.jsx`)** — Wax-sealed cream & pink stationery envelope that opens with a smooth reveal and typewriter effect (with an instant-read toggle).
8. **Vanshika's Future Nurse Journey (`FutureNurseJourney.jsx`)** — Pastel dream-board celebrating her dream to become a nurse with a nurse-uniform teddy, 4 clickable cards, an animated 5-step career path timeline, future wishes, and an interactive note to her future self.
9. **Your Birthday Wish Wall (`WishWall.jsx`)** — Highlighted friendship note plus pastel sticky-note cards that flip to reveal encouraging messages.
10. **The Grand Birthday Finale (`FinalSurprise.jsx`)** — Celebrating teddies, Canvas Confetti fireworks, memory Polaroid collage, heartfelt closing message, and replay / music restart controls.

---

## 🎨 How To Personalize Everything (`src/data/birthdayConfig.js`)

You do **not** need to edit any component code to personalize the site. Open **`src/data/birthdayConfig.js`** and update:

1. **Your Name & Birthday Date:**
   - Replace `senderName: '[Your Name]'` with your name.
   - Update `birthdayDate` if desired.
2. **Secret PIN:**
   - Update `secretPin: '1110'` to any 4-digit code (avoid using just her birth year).
   - Update `pinHint` if you want a custom clue on the lock screen.
3. **Upload Real Photographs:**
   - Drop `.jpg`, `.png`, or `.webp` images into **`public/photos/`** (for example `public/photos/photo-1.jpg`).
   - Update `memories.items` in `src/data/birthdayConfig.js` with `src: '/photos/photo-1.jpg'` and your custom `caption`.
   - Also update `gifts.memoryGift.src` and `caption` for Gift 2!
4. **Change Songs or Enable Spotify:**
   - **Local MP3s (default):** Place `.mp3` files into **`public/music/`** and list them inside `music.tracks` in `src/data/birthdayConfig.js`. (Three original royalty-free music-box / pastel lo-fi `.mp3` tracks are already included so the player works right away.)
   - **Spotify Embed:** Set `music.mode: 'spotify'` (or `optionalSpotifyEnabled: true`) and paste your Spotify Embed URL into `music.spotifyEmbedUrl`.
5. **Edit Letter, Compliments, Quiz & Wishes:**
   - Edit `letter.bodyTemplate`, `gifts.compliments`, `gifts.secretLetter`, `nurseJourney`, `wishWall.notes`, and `finale.personalMessage` right inside `src/data/birthdayConfig.js`.

> **Privacy Reminder:** Never store sensitive private information or real credentials in a public Git repository, as frontend PINs are playful interactive locks rather than server-side authentication.

---

## 💻 Local Development

```bash
npm install
npm run dev
```

Build and preview the production bundle locally:

```bash
npm run build
npm run preview
```

---

## 🚀 Deploying To Vercel

A `vercel.json` file with SPA rewrite rules is already included at the project root.

### Option A — Deploy via Vercel Dashboard (Recommended)
1. Push this project folder to a GitHub, GitLab, or Bitbucket repository (make sure `public/` assets are committed!).
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**.
3. Import your repository. Vercel automatically detects **Vite**:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.
5. Once live, copy the generated `.vercel.app` URL and send it to Vanshika along with her secret 4-digit code!

### Option B — Deploy via Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

