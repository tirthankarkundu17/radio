"use client";

import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Radio, Sparkles } from "lucide-react";
import { Track } from "@/types/track";

interface PlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  isRadioMode: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleRadio: () => void;
  onSeek: (time: number) => void;
  onChangeVolume: (volume: number) => void;
  onToggleMute: () => void;
}

export function PlayerBar({
  currentTrack,
  isPlaying,
  isRadioMode,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onNext,
  onPrevious,
  onToggleRadio,
  onSeek,
  onChangeVolume,
  onToggleMute,
}: PlayerBarProps) {
  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/10 shadow-2xl">
      {/* Interactive Progress Seekbar on top edge */}
      <div
        className="relative w-full h-1.5 bg-slate-800/80 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          onSeek(ratio * duration);
        }}
      >
        <div
          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink group-hover:h-2 -top-0.5 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPercent}% - 6px)` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Track Info */}
        <div className="flex items-center gap-3 min-w-0 max-w-[30%]">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate flex items-center gap-2">
              <span className="truncate">{currentTrack.title}</span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan flex-shrink-0">
                {currentTrack.language.toUpperCase()}
              </span>
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {currentTrack.artist} • {currentTrack.genre}
            </p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-md">
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Previous */}
            <button
              onClick={onPrevious}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple text-black flex items-center justify-center shadow-lg shadow-accent-cyan/30 hover:scale-105 active:scale-95 transition-transform"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Radio Mode Button */}
            <button
              onClick={onToggleRadio}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isRadioMode
                  ? "bg-accent-pink/20 text-accent-pink border border-accent-pink/30 shadow-md shadow-accent-pink/20"
                  : "text-slate-400 hover:text-white bg-white/5"
              }`}
              title="Toggle Continuous Radio Shuffle"
            >
              <Radio className={`w-3.5 h-3.5 ${isRadioMode ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">Radio</span>
            </button>
          </div>

          {/* Timestamps */}
          <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400 px-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Options */}
        <div className="hidden sm:flex items-center justify-end gap-3 min-w-[150px]">
          <button
            onClick={onToggleMute}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-accent-pink" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            title="Volume"
          />
        </div>
      </div>
    </div>
  );
}

