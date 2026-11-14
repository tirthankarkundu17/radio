"use client";

import { useState } from "react";
import rawTracks from "@/data/tracks.json";
import { Track } from "@/types/track";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Header } from "@/components/Header";
import { Visualizer } from "@/components/Visualizer";
import { TrackList } from "@/components/TrackList";
import { PlayerBar } from "@/components/PlayerBar";
import { PromptModal } from "@/components/PromptModal";
import { Sparkles, Radio, Music, Disc3 } from "lucide-react";

export default function Home() {
  const tracks = rawTracks as Track[];
  const [inspectedTrack, setInspectedTrack] = useState<Track | null>(null);

  const {
    currentTrack,
    isPlaying,
    isRadioMode,
    currentTime,
    duration,
    volume,
    isMuted,
    selectedLanguage,
    analyser,
    setSelectedLanguage,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    toggleRadioMode,
    seek,
    changeVolume,
    toggleMute,
  } = useAudioPlayer(tracks);

  const languageTitles = {
    all: "Multilingual Global Station",
    en: "English AI Synth & Lofi Station",
    bn: "বাংলা এআই রেডিও (Bengali Station)",
    hi: "हिंदी एआई रेडियो (Hindi Station)",
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-32">
      {/* Top Header */}
      <Header
        isRadioMode={isRadioMode}
        onToggleRadio={toggleRadioMode}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        totalTracks={tracks.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full space-y-8 flex-1">
        {/* Hero / Live Broadcast Stage */}
        <section className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl">
          {/* Subtle Ambient Glow Backgrounds */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent-purple/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
            {/* Spinning Vinyl / Album Art */}
            <div className="relative group flex-shrink-0">
              <div
                className={`relative w-40 h-40 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-500 ${
                  isPlaying
                    ? "border-accent-cyan shadow-accent-cyan/30 scale-[1.02]"
                    : "border-white/10"
                }`}
              >
                {currentTrack?.coverUrl ? (
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <Music className="w-12 h-12 text-slate-600" />
                  </div>
                )}

                {/* Spinning Disc Badge Overlay */}
                <div
                  className={`absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white ${
                    isPlaying ? "animate-spin-slow text-accent-cyan" : ""
                  }`}
                >
                  <Disc3 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Now Playing Info & Visualizer */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent-pink/15 text-accent-pink border border-accent-pink/30">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    {isRadioMode ? "Radio Streaming" : "Now Playing"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {languageTitles[selectedLanguage]}
                  </span>
                </div>

                {currentTrack && (
                  <button
                    onClick={() => setInspectedTrack(currentTrack)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Inspect AI Prompt
                  </button>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {currentTrack?.title || "Select a track"}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 mt-1 flex items-center gap-2">
                  <span>{currentTrack?.artist || "NeuroWave FM"}</span>
                  {currentTrack && (
                    <>
                      <span>•</span>
                      <span className="text-accent-cyan font-medium">{currentTrack.genre}</span>
                      <span>•</span>
                      <span className="text-slate-400 text-xs font-mono">
                        {currentTrack.aiModel}
                      </span>
                    </>
                  )}
                </p>
              </div>

              {/* 60 FPS Canvas Visualizer */}
              <Visualizer analyser={analyser} isPlaying={isPlaying} />
            </div>
          </div>
        </section>

        {/* Track Catalog Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Track Library</h3>
              <p className="text-xs text-slate-400">
                Browse our curated AI tracks, inspect generation prompts, and listen on-demand.
              </p>
            </div>
          </div>

          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            selectedLanguage={selectedLanguage}
            onPlayTrack={playTrack}
            onInspectTrack={setInspectedTrack}
          />
        </section>
      </main>

      {/* Floating Bottom Player Bar */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isRadioMode={isRadioMode}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        onTogglePlay={togglePlay}
        onNext={playNext}
        onPrevious={playPrevious}
        onToggleRadio={toggleRadioMode}
        onSeek={seek}
        onChangeVolume={changeVolume}
        onToggleMute={toggleMute}
        onInspect={setInspectedTrack}
      />

      {/* Prompt & Lyrics Inspector Modal */}
      <PromptModal track={inspectedTrack} onClose={() => setInspectedTrack(null)} />
    </div>
  );
}

