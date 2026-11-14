"use client";

import { Play, Pause, Sparkles, Clock, Globe } from "lucide-react";
import { Track } from "@/types/track";

interface TrackCardProps {
  track: Track;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  onInspect: (track: Track) => void;
}

export function TrackCard({ track, isActive, isPlaying, onPlay, onInspect }: TrackCardProps) {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const langBadges = {
    en: { label: "EN", bg: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    bn: { label: "বাংলা", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    hi: { label: "हिंदी", bg: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  };

  const badge = langBadges[track.language] || langBadges.en;

  return (
    <div
      className={`group relative flex items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-200 border ${
        isActive
          ? "bg-slate-800/80 border-accent-cyan/40 shadow-lg shadow-accent-cyan/10"
          : "glass-card border-white/5 hover:border-white/15 hover:bg-slate-800/40"
      }`}
    >
      {/* Left: Thumbnail & Info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Album Art with Play Overlay */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 group/cover">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/cover:scale-110"
          />
          <button
            onClick={() => onPlay(track)}
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {isActive && isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-accent-cyan animate-[bounce_0.6s_ease-in-out_infinite] h-3" />
                <span className="w-1 bg-accent-purple animate-[bounce_0.8s_ease-in-out_infinite] h-4" />
                <span className="w-1 bg-accent-pink animate-[bounce_0.5s_ease-in-out_infinite] h-2" />
              </div>
            ) : (
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Text info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg}`}
            >
              {badge.label}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
              {track.aiModel}
            </span>
          </div>
          <h3
            className={`text-sm sm:text-base font-semibold truncate ${
              isActive ? "text-accent-cyan" : "text-white group-hover:text-slate-100"
            }`}
          >
            {track.title}
          </h3>
          <p className="text-xs text-slate-400 truncate">
            {track.artist} • {track.genre}
          </p>
        </div>
      </div>

      {/* Right: Prompt button & Duration */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-3">
        <button
          onClick={() => onInspect(track)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 hover:border-white/20 transition-all"
          title="Inspect AI Prompt & Lyrics"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="hidden sm:inline">Prompt</span>
        </button>

        <span className="text-xs font-mono text-slate-400 flex items-center gap-1 min-w-[45px] justify-end">
          <Clock className="w-3 h-3 text-slate-500 hidden sm:inline" />
          {formatTime(track.duration)}
        </span>
      </div>
    </div>
  );
}

