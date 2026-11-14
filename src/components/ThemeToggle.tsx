"use client";

import { useTheme, Theme } from "@/context/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
    { id: "system", label: "System", icon: <Monitor className="w-3.5 h-3.5" /> },
    { id: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900/80 border border-slate-300/60 dark:border-white/10 transition-colors">
      {options.map((opt) => {
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            className={`flex items-center gap-1.5 px-1.5 sm:px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "bg-white dark:bg-accent-purple/30 text-slate-900 dark:text-white shadow-sm font-semibold border border-slate-300/50 dark:border-accent-purple/40"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            title={`${opt.label} Mode`}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

