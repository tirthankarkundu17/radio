"use client";

import { useState } from "react";
import { X, Copy, Check, Sparkles, Music, Terminal } from "lucide-react";
import { Track } from "@/types/track";

interface PromptModalProps {
  track: Track | null;
  onClose: () => void;
}

export function PromptModal({ track, onClose }: PromptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!track) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(track.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langNames = {
    en: "English",
    bn: "বাংলা (Bengali)",
    hi: "हिंदी (Hindi)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/10 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
                  {track.aiModel}
                </span>
                <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
                  {langNames[track.language]}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {track.title}
              </h2>
              <p className="text-sm text-slate-400">
                {track.artist} • {track.genre} • {track.mood}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-6">
          {/* Prompt Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-accent-cyan" />
                Generation Prompt
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Prompt"}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 text-sm text-slate-200 font-mono leading-relaxed select-all">
              {track.prompt}
            </div>
          </div>

          {/* Lyrics Section (if any) */}
          {track.lyrics && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <Music className="w-4 h-4 text-accent-pink" />
                Lyrics / Vocal Elements
              </span>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                {track.lyrics}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Generated with {track.aiModel}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

