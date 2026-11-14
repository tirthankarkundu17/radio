"use client";

import { useState, useMemo } from "react";
import { Search, Music2, SlidersHorizontal, RefreshCcw } from "lucide-react";
import { Track, SupportedLanguage } from "@/types/track";
import { TrackCard } from "./TrackCard";

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  selectedLanguage: SupportedLanguage;
  onPlayTrack: (track: Track) => void;
}

export function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  selectedLanguage,
  onPlayTrack,
}: TrackListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  // Extract unique genres for current language view
  const availableGenres = useMemo(() => {
    const langFiltered =
      selectedLanguage === "all" ? tracks : tracks.filter((t) => t.language === selectedLanguage);
    const genres = Array.from(new Set(langFiltered.map((t) => t.genre)));
    return ["all", ...genres];
  }, [tracks, selectedLanguage]);

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      // Language Filter
      if (selectedLanguage !== "all" && track.language !== selectedLanguage) {
        return false;
      }

      // Genre Filter
      if (selectedGenre !== "all" && track.genre !== selectedGenre) {
        return false;
      }

      // Search Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchTitle = track.title.toLowerCase().includes(query);
        const matchArtist = track.artist.toLowerCase().includes(query);
        const matchGenre = track.genre.toLowerCase().includes(query);
        const matchMood = track.mood.toLowerCase().includes(query);

        return matchTitle || matchArtist || matchGenre || matchMood;
      }

      return true;
    });
  }, [tracks, selectedLanguage, selectedGenre, searchQuery]);

  return (
    <div className="w-full space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists, genres..."
            className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300/80 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-accent-cyan/60 focus:ring-1 focus:ring-accent-cyan/60 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-800 dark:hover:text-white px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-end gap-2 px-1">
          <span>{filteredTracks.length} tracks</span>
        </div>
      </div>

      {/* Genre Filter Pills */}
      {availableGenres.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mr-1 flex-shrink-0" />
          {availableGenres.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-slate-900 dark:bg-white/15 text-white font-semibold border border-slate-800 dark:border-white/20 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5"
                }`}
              >
                {genre === "all" ? "All Genres" : genre}
              </button>
            );
          })}
        </div>
      )}

      {/* Track List Items */}
      {filteredTracks.length > 0 ? (
        <div className="space-y-2">
          {filteredTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isActive={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              onPlay={onPlayTrack}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl glass-card border border-slate-200/80 dark:border-white/5 space-y-3">
          <Music2 className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No tracks match your current filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre("all");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
