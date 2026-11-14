"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Track, SupportedLanguage } from "@/types/track";

export function useAudioPlayer(allTracks: Track[]) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(allTracks[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRadioMode, setIsRadioMode] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("all");
  const [playedHistory, setPlayedHistory] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Initialize Web Audio API on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass && audioRef.current) {
        try {
          const ctx = new AudioContextClass();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.8;

          // Connect audio element source to analyser and destination
          const source = ctx.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(ctx.destination);

          audioContextRef.current = ctx;
          analyserRef.current = analyser;
          sourceNodeRef.current = source;
        } catch {
          // If already connected or CORS issue, degrade gracefully
        }
      }
    }

    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  }, []);

  // Filter pool based on selected language
  const getEligibleTracks = useCallback(() => {
    if (selectedLanguage === "all") return allTracks;
    return allTracks.filter((t) => t.language === selectedLanguage);
  }, [allTracks, selectedLanguage]);

  // Next Track Logic (Smart Shuffle for Radio Mode)
  const getNextTrack = useCallback((): Track | null => {
    const pool = getEligibleTracks();
    if (pool.length === 0) return null;
    if (pool.length === 1) return pool[0];

    // Filter out recently played tracks if possible
    const unplayed = pool.filter((t) => !playedHistory.includes(t.id));
    const targetPool = unplayed.length > 0 ? unplayed : pool;

    // Pick random track different from current
    const candidates = targetPool.filter((t) => t.id !== currentTrack?.id);
    const selection = candidates[Math.floor(Math.random() * candidates.length)] || targetPool[0];

    return selection;
  }, [getEligibleTracks, playedHistory, currentTrack]);

  // Previous Track
  const playPrevious = useCallback(() => {
    const pool = getEligibleTracks();
    if (pool.length === 0) return;
    const currentIndex = pool.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + pool.length) % pool.length;
    playTrack(pool[prevIndex]);
  }, [getEligibleTracks, currentTrack]);

  // Play a specific track
  const playTrack = useCallback(
    (track: Track) => {
      initAudioContext();
      setCurrentTrack(track);
      setPlayedHistory((prev) => [...prev.slice(-15), track.id]);

      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Audio play prevented:", err);
            setIsPlaying(false);
          });
      }
    },
    [initAudioContext]
  );

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    initAudioContext();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!currentTrack && allTracks.length > 0) {
        playTrack(allTracks[0]);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [isPlaying, currentTrack, allTracks, initAudioContext, playTrack]);

  // Next track trigger
  const playNext = useCallback(() => {
    const next = getNextTrack();
    if (next) {
      playTrack(next);
    }
  }, [getNextTrack, playTrack]);

  // Toggle Radio Mode
  const toggleRadioMode = useCallback(() => {
    setIsRadioMode((prev) => {
      const nextState = !prev;
      if (nextState && !isPlaying) {
        // Start playing immediately if currently paused
        const next = getNextTrack();
        if (next) playTrack(next);
      }
      return nextState;
    });
  }, [isPlaying, getNextTrack, playTrack]);

  // Seek handler
  const seek = useCallback((timeInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      setCurrentTime(timeInSeconds);
    }
  }, []);

  // Volume handler
  const changeVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped === 0) setIsMuted(true);
    else setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Synchronize MediaSession API for lock screens
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator) || !currentTrack) return;

    const langLabel = currentTrack.language === "bn" ? "বাংলা" : currentTrack.language === "hi" ? "हिंदी" : "English";

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: `${currentTrack.artist} • ${currentTrack.aiModel}`,
      album: `NeuroWave AI Radio [${langLabel}]`,
      artwork: [
        { src: currentTrack.coverUrl, sizes: "512x512", type: "image/jpeg" },
        { src: currentTrack.coverUrl, sizes: "192x192", type: "image/jpeg" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
      setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });
    navigator.mediaSession.setActionHandler("nexttrack", playNext);
    navigator.mediaSession.setActionHandler("previoustrack", playPrevious);
  }, [currentTrack, playNext, playPrevious]);

  // Setup audio element event listeners
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      // In Radio Mode or default loop, auto advance to next
      playNext();
    };
    const onError = () => {
      console.warn("Audio playback error encountered, auto-advancing to next track...");
      if (isRadioMode) {
        setTimeout(playNext, 1000);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    if (currentTrack) {
      audio.src = currentTrack.audioUrl;
    }

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
    };
  }, []); // Run once on mount

  return {
    currentTrack,
    isPlaying,
    isRadioMode,
    currentTime,
    duration,
    volume,
    isMuted,
    selectedLanguage,
    analyser: analyserRef.current,
    setSelectedLanguage,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    toggleRadioMode,
    seek,
    changeVolume,
    toggleMute,
    initAudioContext,
  };
}

