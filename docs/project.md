# Product Requirements Document (PRD)

## Project Name: NeuroWave AI Radio (Local-First Vercel Jukebox)
**Status:** Approved / Lean MVP  
**Version:** 3.0.0 (Pure Local Static + Vercel Deployment)  
**Target Platform:** Web (Vercel Free Tier)  
**Design Doc Reference:** [DESIGN.md](file:///d:/Projects/radio/docs/DESIGN.md)

---

## 1. Executive Summary & Vision

**NeuroWave AI Radio** is a lightweight, zero-maintenance web application to showcase and play your AI-generated music (from Suno, Udio, etc.) for the world.

### The Pure Local Strategy:
* **Zero External Dependencies:** No external databases (no Supabase pauses), no external object storage setup.
* **Local Asset Pipeline:** Your generated MP3s live directly inside `public/tracks/`, album covers in `public/covers/`, and track details in a clean `tracks.json` file.
* **Deploy to Vercel:** Deploys with a single command or git push. Vercel's global CDN caches all static audio files at edge nodes around the world and provides **100 GB of free bandwidth per month** (~20,000 full song streams for $0).

---

## 2. Core User Experience

### 2.1 The Two Playback Modes
1. **On-Demand Jukebox Mode (Default):**
   * Listeners browse your collection of AI tracks.
   * Search by keyword, filter by Genre (*Synthwave, Lofi, Ambient, Cyberpunk, Cinematic*) or Mood (*Deep Focus, Upbeat, Night Ride*).
   * Click any song to play instantly.
   * Inspect the exact prompt, AI model (Suno v3.5, Udio 1.5), and lyrics used to create the song.
2. **"Radio Mode" (One-Click 24/7 Vibe):**
   * A single prominent button in the header: **"📻 Radio Mode: ON"**.
   * Automatically shuffles and plays through the collection continuously with soft 2-second crossfades between songs.
   * Hands-free listening for studying, coding, or chilling—delivers the feeling of a live radio station without complex server infrastructure.

### 2.2 Aesthetic Audio Visualizer
* Responsive 60 FPS `<canvas>` visualizer reacting to the live audio frequencies (spectrum bars or glowing oscilloscope wave).
* Visualizer toggle: compact mode or full-width ambient mode.

### 2.3 Mobile Background Play (MediaSession API)
* Users can lock their phone screen or switch tabs while audio continues playing seamlessly.
* Mobile lock screens display track title, artist, genre, and album artwork with native play/pause/skip controls.

---

## 3. Workflow for You (The Creator)

Adding new AI-generated music takes less than 30 seconds:
1. Generate track on Suno / Udio / local AI model.
2. Drop `song-name.mp3` into `public/tracks/`.
3. Drop `song-name.jpg` into `public/covers/`.
4. Add a quick entry to `data/tracks.json`:
   ```json
   {
     "id": "neon-drive",
     "title": "Neon Drive",
     "genre": "Synthwave",
     "mood": "Night Ride",
     "audioUrl": "/tracks/neon-drive.mp3",
     "coverUrl": "/covers/neon-drive.jpg",
     "duration": 195,
     "aiModel": "Suno v3.5",
     "prompt": "80s retro synthwave, driving analog bass, 128 bpm"
   }
   ```
5. Push to GitHub $\rightarrow$ Vercel automatically redeploys live in under 45 seconds!

---

## 4. Non-Functional Requirements & Limits

* **Bandwidth & Limits:** Optimized for Vercel Hobby tier (100 GB/month bandwidth, 100MB max per file, 0 cold starts).
* **Load Time:** Instant audio buffer start ($< 250\text{ ms}$ on high-speed CDN edge).
* **Audio Quality:** Native 192kbps–320kbps MP3 / AAC playback without lossy server re-encoding.
* **Cost:** **$0.00 / month forever**.

---

## 5. Success Criteria

* **Immediate Usability:** Anyone visiting the Vercel URL can click "Play" or "Radio Mode" with zero signups or popups.
* **Zero Failure Rate:** No database timeouts, no paused instances, and no egress bandwidth billing surprises.
