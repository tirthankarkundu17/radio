"use client";

import { Play, Clock } from "lucide-react";
import { Track } from "@/types/track";

interface TrackCardProps {
  track: Track;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
}

export function TrackCard({ track, isActive, isPlaying, onPlay }: TrackCardProps) {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const langBadges = {
    en: { label: "EN", bg: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30" },
    bn: { label: "বাংলা", bg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30" },
    hi: { label: "हिंदी", bg: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30" },
  };

  const badge = langBadges[track.language] || langBadges.en;

  return (
    <div
      onClick={() => onPlay(track)}
      className={`group relative flex items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-200 border cursor-pointer ${
        isActive
          ? "bg-slate-200/90 dark:bg-slate-800/80 border-accent-cyan/60 dark:border-accent-cyan/40 shadow-lg shadow-accent-cyan/10"
          : "glass-card border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 hover:bg-slate-100/80 dark:hover:bg-slate-800/40"
      }`}
    >
      {/* Left: Thumbnail & Info */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
        {/* Album Art with Play Overlay */}
        <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 group/cover border border-black/5 dark:border-white/10">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/cover:scale-110"
          />
          <div
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
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Text info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 min-w-0">
            <span
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full border flex-shrink-0 ${badge.bg}`}
            >
              {badge.label}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              {track.genre} • {track.mood}
            </span>
          </div>
          <h3
            className={`text-xs sm:text-base font-semibold truncate ${
              isActive ? "text-accent-cyan" : "text-slate-900 dark:text-white group-hover:text-accent-purple dark:group-hover:text-slate-100"
            }`}
          >
            {track.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{track.artist}</p>
        </div>
      </div>

      {/* Right: Duration */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2 sm:ml-3">
        <span className="text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 min-w-[38px] sm:min-w-[45px] justify-end">
          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500 hidden sm:inline" />
          {formatTime(track.duration)}
        </span>
      </div>
    </div>
  );
}
