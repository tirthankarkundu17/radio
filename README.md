# 📻 NeuroWave AI Radio

> A sleek, local-first web radio and jukebox app built to showcase and stream AI-generated music to the world.

[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)

---

## ✨ Features

- **🌐 Multi-Language Support (English, Bengali & Hindi):** Dedicated language selector (`All`, `English`, `বাংলা Bengali`, `हिंदी Hindi`). Listeners can browse songs by language or lock Radio Mode onto a single language station.
- **📻 One-Click "Radio Mode":** Continuous autoplay with smart shuffle and smooth crossfades—delivers the hands-free vibe of a 24/7 live radio station without streaming server costs.
- **🎧 On-Demand Jukebox:** Browse your complete music catalog, search by title/artist/genre, and filter by language, genre (*Synthwave, Lofi, Ambient, Baul / Folk, Bollywood / Indie Fusion*), or mood (*Deep Focus, Chill, Nostalgic*).
- **🌊 60 FPS Audio Visualizer:** Real-time canvas audio visualizer with reactive neon spectrum bars and oscilloscope waveforms powered by the Web Audio API.
- **📱 Mobile Lock-Screen Controls:** Native background audio playback on iOS and Android with lock screen metadata and artwork via the W3C MediaSession API.
- **⚡ Zero External Databases & $0 Hosting:** All MP3s, artwork, and metadata are checked directly into the repository. Deploys to Vercel with **100 GB of free bandwidth per month** (~20,000 song plays/month).

---

## 📁 Project Structure

```
radio/
├── public/
│   ├── data/
│   │   └── songs/               # Drop your MP3 audio files here
│   │       ├── cyber-drift.mp3
│   │       └── bristi-raat.mp3
│   └── covers/                  # Drop your album covers / artwork here
│       ├── cyber-drift.jpg
│       └── bristi-raat.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout & SEO meta tags
│   │   ├── page.tsx             # Main Radio & Catalog UI
│   │   └── globals.css          # Tailwind CSS styling & animations
│   ├── components/
│   │   ├── Header.tsx           # Station logo, filters & Radio Mode toggle
│   │   ├── TrackList.tsx        # Searchable and filterable music library
│   │   ├── TrackCard.tsx        # Single track row with play trigger
│   │   ├── Visualizer.tsx       # 60 FPS Canvas audio visualizer
│   │   └── PlayerBar.tsx        # Persistent bottom player with seek & volume controls
│   ├── hooks/
│   │   └── useAudioPlayer.ts    # Audio playback engine, queue manager, & crossfade logic
│   ├── types/
│   │   └── track.ts             # TypeScript interfaces for Track and Playlist
│   └── data/
│       └── tracks.json          # Master track registry
├── docs/
│   ├── DESIGN.md                # Technical architecture & design document
│   └── project.md               # Product requirements document (PRD)
├── package.json
└── README.md
```

---

## 🚀 Quick Start (Running Locally)

### 1. Prerequisites
- [Node.js](https://nodejs.org) (v18.17 or higher)
- `npm`, `pnpm`, or `yarn`

### 2. Installation
```bash
git clone https://github.com/your-username/ai-radio.git
cd ai-radio
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎵 How to Add Your AI-Generated Songs

Adding new songs takes under 30 seconds:

1. **Save your audio file:**
   Place your generated `.mp3` file inside `public/data/songs/` (e.g. `public/data/songs/bristi-bheja-raat.mp3`).
2. **Save your cover artwork:**
   Place the cover image inside `public/covers/` (e.g. `public/covers/bristi-bheja-raat.jpg`).
3. **Register it in `src/data/tracks.json`:**
   Add a new object to the list (supports `"language": "en" | "bn" | "hi"`):
   ```json
   {
     "id": "bristi-bheja-raat",
     "title": "বৃষ্টি ভেজা রাত (Rainy Night)",
     "artist": "NeuroWave Bangla",
     "language": "bn",
     "genre": "Lofi Fusion",
     "mood": "Nostalgic",
     "duration": 195,
     "audioUrl": "/data/songs/bristi-bheja-raat.mp3",
     "coverUrl": "/covers/bristi-bheja-raat.jpg"
   }
   ```
4. Commit and push to Git—Vercel automatically updates your live site!

---

## 🌐 Deploying to Vercel ($0 / Free Tier)

### Option A: Using the Makefile or NPM (Instant CLI Deploy)
```bash
# Deploy preview deployment
make deploy
# OR: npm run deploy

# Deploy directly to production
make deploy-prod
# OR: npm run deploy:prod
```

### Option B: Automatic Git Push
1. Push your code to GitHub (`git push origin main`).
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and click **Deploy**. Every push will automatically build and deploy!

---

## 📚 Documentation Links

- **[Product Requirements Document (PRD)](file:///d:/Projects/radio/docs/project.md)** — Core product goals, user personas, and feature hierarchy.
- **[System Design & Architecture](file:///d:/Projects/radio/docs/DESIGN.md)** — In-depth technical architecture, Web Audio API chain, and deployment optimization.

---

## 📄 License

MIT License — feel free to use, modify, and broadcast your own AI music!
