# 📻 NeuroWave AI Radio

> A sleek, local-first web radio and jukebox app built to showcase and stream AI-generated music to the world.

[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)

---

## ✨ Features

- **📻 One-Click "Radio Mode":** Continuous autoplay with smart shuffle and smooth crossfades—delivers the hands-free vibe of a 24/7 live radio station without streaming server costs.
- **🎧 On-Demand Jukebox:** Browse your complete AI music catalog, search by keyword, and filter by genre (*Synthwave, Lofi, Ambient, Cyberpunk*) or mood (*Deep Focus, Chill, High Energy*).
- **🤖 Prompt & Model Inspector:** Inspect the exact prompts, parameters, lyrics, and AI models (*Suno v3.5, Udio v1.5*, etc.) used to create each song, with one-click prompt copying.
- **🌊 60 FPS Audio Visualizer:** Real-time canvas audio visualizer with reactive neon spectrum bars and oscilloscope waveforms powered by the Web Audio API.
- **📱 Mobile Lock-Screen Controls:** Native background audio playback on iOS and Android with lock screen metadata and artwork via the W3C MediaSession API.
- **⚡ Zero External Databases & $0 Hosting:** All MP3s, artwork, and metadata live directly inside the repository. Deploys to Vercel with **100 GB of free bandwidth per month** (~20,000 song plays/month).

---

## 📁 Project Structure

```
radio/
├── public/
│   ├── tracks/                  # Drop your AI-generated MP3 files here
│   │   ├── neon-drift.mp3
│   │   └── midnight-coffee.mp3
│   └── covers/                  # Drop your album covers / artwork here
│       ├── neon-drift.jpg
│       └── midnight-coffee.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout & SEO meta tags
│   │   ├── page.tsx             # Main Radio & Catalog UI
│   │   └── globals.css          # Tailwind CSS styling & animations
│   ├── components/
│   │   ├── Header.tsx           # Station logo, filters & Radio Mode toggle
│   │   ├── TrackList.tsx        # Searchable and filterable music library
│   │   ├── TrackCard.tsx        # Single track row with play trigger & prompt button
│   │   ├── Visualizer.tsx       # 60 FPS Canvas audio visualizer
│   │   ├── PlayerBar.tsx        # Persistent bottom player with seek & volume controls
│   │   └── PromptModal.tsx      # Modal to view & copy full AI prompts and lyrics
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
   Place your generated `.mp3` file inside `public/tracks/` (e.g. `public/tracks/cyber-city.mp3`).
2. **Save your cover artwork:**
   Place the cover image inside `public/covers/` (e.g. `public/covers/cyber-city.jpg`).
3. **Register it in `src/data/tracks.json`:**
   Add a new object to the list:
   ```json
   {
     "id": "cyber-city",
     "title": "Cyber City Lights",
     "artist": "Your Name / Channel",
     "genre": "Synthwave",
     "mood": "Energizing",
     "duration": 210,
     "audioUrl": "/tracks/cyber-city.mp3",
     "coverUrl": "/covers/cyber-city.jpg",
     "aiModel": "Suno v3.5",
     "prompt": "80s retro synthwave, driving analog bass, neon city atmosphere, 128 bpm",
     "lyrics": null
   }
   ```
4. Commit and push to Git—Vercel automatically updates your live site!

---

## 🌐 Deploying to Vercel ($0 / Free Tier)

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and click **Deploy**.
4. **Done!** Your AI Radio is live with global edge caching and free monthly bandwidth.

---

## 📚 Documentation Links

- **[Product Requirements Document (PRD)](file:///d:/Projects/radio/docs/project.md)** — Core product goals, user personas, and feature hierarchy.
- **[System Design & Architecture](file:///d:/Projects/radio/docs/DESIGN.md)** — In-depth technical architecture, Web Audio API chain, and deployment optimization.

---

## 📄 License

MIT License — feel free to use, modify, and broadcast your own AI music!
