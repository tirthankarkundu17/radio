"use client";

import { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Radio } from "lucide-react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  if (!currentTrack) return null;

  const effectiveDuration = duration > 0 ? duration : currentTrack.duration || 0;
  const displayTime = isDragging && dragTime != null ? dragTime : currentTime;
  const progressPercent =
    effectiveDuration > 0
      ? Math.min(100, Math.max(0, (displayTime / effectiveDuration) * 100))
      : 0;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const calculateTimeFromClientX = (clientX: number) => {
    if (!progressBarRef.current || effectiveDuration <= 0) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    return ratio * effectiveDuration;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    const newTime = calculateTimeFromClientX(e.clientX);
    setDragTime(newTime);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newTime = calculateTimeFromClientX(e.clientX);
    setHoverX(relX);
    setHoverTime(newTime);

    if (isDragging) {
      setDragTime(newTime);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newTime = calculateTimeFromClientX(e.clientX);
      onSeek(newTime);
      setIsDragging(false);
      setDragTime(null);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setDragTime(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-200/80 dark:border-white/10 shadow-2xl transition-colors duration-300 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {/* Interactive Progress Seekbar on top edge with expanded hit area (desktop drag & mobile touch) */}
      <div
        ref={progressBarRef}
        className="relative w-full py-2.5 -mt-2.5 cursor-pointer group select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={() => {
          setHoverTime(null);
          setHoverX(null);
        }}
      >
        {/* Track Line */}
        <div className="relative w-full h-1 sm:h-1.5 bg-slate-300 dark:bg-slate-800/80 rounded-full group-hover:h-2 transition-all">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink rounded-full transition-[width] duration-75"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Scrubber Thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md border border-black/10 transition-all ${
              isDragging
                ? "scale-125 opacity-100 ring-2 ring-accent-cyan"
                : "opacity-0 group-hover:opacity-100 group-hover:scale-100"
            }`}
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />
        </div>

        {/* Hover / Scrub Tooltip */}
        {!isDragging && hoverTime != null && hoverX != null && (
          <div
            className="absolute -top-7 px-1.5 py-0.5 rounded bg-slate-900/90 dark:bg-white text-white dark:text-slate-900 text-[10px] font-mono shadow-md pointer-events-none transform -translate-x-1/2 hidden sm:block"
            style={{ left: `${hoverX}px` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Track Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial sm:max-w-[30%]">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-black/5 dark:border-white/10 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
              <span className="truncate">{currentTrack.title}</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan flex-shrink-0">
                {currentTrack.language.toUpperCase()}
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              {currentTrack.artist} • {currentTrack.genre}
            </p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center gap-0.5 sm:gap-1.5 flex-shrink-0 sm:flex-1 max-w-md">
          <div className="flex items-center gap-1.5 sm:gap-5">
            {/* Previous */}
            <button
              onClick={onPrevious}
              className="p-2 sm:p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 flex items-center justify-center min-w-[36px] min-h-[36px]"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple text-black flex items-center justify-center shadow-lg shadow-accent-cyan/30 hover:scale-105 active:scale-95 transition-transform flex-shrink-0"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              className="p-2 sm:p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 flex items-center justify-center min-w-[36px] min-h-[36px]"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Radio Mode Button */}
            <button
              onClick={onToggleRadio}
              className={`hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isRadioMode
                  ? "bg-accent-pink/15 text-accent-pink border border-accent-pink/30 shadow-md shadow-accent-pink/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-white/5"
              }`}
              title="Toggle Continuous Radio Shuffle"
            >
              <Radio className={`w-3.5 h-3.5 ${isRadioMode ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">Radio</span>
            </button>
          </div>

          {/* Timestamps */}
          <div className="flex items-center justify-between w-full text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1 sm:px-2">
            <span>{formatTime(displayTime)}</span>
            <span>{formatTime(effectiveDuration)}</span>
          </div>
        </div>

        {/* Right: Volume & Options */}
        <div className="hidden sm:flex items-center justify-end gap-3 min-w-[150px]">
          <button
            onClick={onToggleMute}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
            className="w-20 h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            title="Volume"
          />
        </div>
      </div>
    </div>
  );
}
