"use client";

import { Radio, Sparkles } from "lucide-react";
import { SupportedLanguage } from "@/types/track";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  isRadioMode: boolean;
  onToggleRadio: () => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  totalTracks: number;
}

export function Header({
  isRadioMode,
  onToggleRadio,
  selectedLanguage,
  onSelectLanguage,
  totalTracks,
}: HeaderProps) {
  const languages: { id: SupportedLanguage; label: string; mobileLabel: string }[] = [
    { id: "all", label: "All Languages", mobileLabel: "All" },
    { id: "en", label: "English", mobileLabel: "English" },
    { id: "bn", label: "বাংলা (Bengali)", mobileLabel: "Bengali" },
    { id: "hi", label: "हिंदी (Hindi)", mobileLabel: "Hindi" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <img
              src="/logo.svg"
              alt="NeuroWave Logo"
              className="w-10 h-10 rounded-xl object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.35)] transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                NeuroWave FM
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
                Radio
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Continuous 24/7 Music Stream • {totalTracks} Songs
            </p>
          </div>
        </div>

        {/* Center: Language Switcher */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300/60 dark:border-white/10 text-xs font-medium transition-colors">
          {languages.map((lang) => {
            const isActive = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => onSelectLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? "bg-accent-cyan text-black font-semibold shadow-md shadow-accent-cyan/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Theme Toggle & Radio Mode Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          <button
            onClick={onToggleRadio}
            className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 ${
              isRadioMode
                ? "bg-gradient-to-r from-accent-pink to-accent-purple text-white shadow-lg shadow-accent-pink/30 glow-purple"
                : "bg-slate-200 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-700/80 border border-slate-300/80 dark:border-white/10"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isRadioMode ? "bg-white animate-ping" : "bg-slate-400 dark:bg-slate-500"
              }`}
            />
            <span>{isRadioMode ? "📻 LIVE" : "Radio"}</span>
            {isRadioMode && <Sparkles className="w-4 h-4 text-accent-amber animate-spin-slow" />}
          </button>
        </div>
      </div>

      {/* Mobile Language Bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-3 border-t border-slate-200/80 dark:border-white/5 bg-slate-100/90 dark:bg-slate-950/60 overflow-x-auto gap-1">
        {languages.map((lang) => {
          const isActive = selectedLanguage === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => onSelectLanguage(lang.id)}
              className={`px-3 py-1 text-xs rounded-lg transition-all font-medium whitespace-nowrap ${
                isActive
                  ? "bg-accent-cyan/20 text-accent-cyan font-semibold border border-accent-cyan/40"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {lang.mobileLabel}
            </button>
          );
        })}
      </div>
    </header>
  );
}
