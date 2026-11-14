"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Track, SupportedLanguage } from "@/types/track";

// Helper to detect mobile devices (iOS / Android)
const isMobileDevice = (): boolean => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints != null && navigator.maxTouchPoints > 1)
  );
};

// Set iOS Audio Session category to "playback" (iOS Safari 16.4+)
// This prevents background audio from being silenced when switching apps or locking the phone
const configureAudioSession = () => {
  if (typeof navigator !== "undefined" && "audioSession" in navigator) {
    try {
      (navigator as unknown as { audioSession: { type: string } }).audioSession.type = "playback";
    } catch (e) {
      console.warn("Failed to set audioSession type:", e);
    }
  }
};

export function useAudioPlayer(allTracks: Track[]) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(allTracks[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRadioMode, setIsRadioMode] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(allTracks[0]?.duration || 0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("all");
  const [playedHistory, setPlayedHistory] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Keep refs for fresh callbacks to prevent stale closure bugs in background event listeners
  const playNextRef = useRef<() => void>(() => {});
  const playPreviousRef = useRef<() => void>(() => {});
  const isRadioModeRef = useRef<boolean>(isRadioMode);
  const currentTrackRef = useRef<Track | null>(currentTrack);
  const isPlayingRef = useRef<boolean>(isPlaying);

  useEffect(() => {
    isRadioModeRef.current = isRadioMode;
  }, [isRadioMode]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize Web Audio API on desktop for visualizer
  const initAudioContext = useCallback(() => {
    configureAudioSession();

    // On mobile devices, do NOT route HTMLMediaElement through createMediaElementSource.
    // Web Audio graphs are suspended by mobile OSs (iOS / Android) when the user leaves the tab
    // or locks the screen, muting the audio. Bypassing AudioContext on mobile lets native audio
    // playback (AVPlayer/ExoPlayer) handle background playback flawlessly.
    if (isMobileDevice()) {
      return;
    }

    if (!audioContextRef.current && typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      audioContextRef.current.resume().catch(() => {});
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
      configureAudioSession();
      initAudioContext();
      setCurrentTrack(track);
      if (track.duration && track.duration > 0) {
        setDuration(track.duration);
      }
      setPlayedHistory((prev) => [...prev.slice(-15), track.id]);

      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            if ("mediaSession" in navigator) {
              navigator.mediaSession.playbackState = "playing";
            }
          })
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
    configureAudioSession();
    initAudioContext();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
    } else {
      if (!currentTrack && allTracks.length > 0) {
        playTrack(allTracks[0]);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            if ("mediaSession" in navigator) {
              navigator.mediaSession.playbackState = "playing";
            }
          })
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

  // Keep callback refs updated
  playNextRef.current = playNext;
  playPreviousRef.current = playPrevious;

  // Toggle Radio Mode
  const toggleRadioMode = useCallback(() => {
    setIsRadioMode((prev) => {
      const nextState = !prev;
      if (nextState && !isPlayingRef.current) {
        // Start playing immediately if currently paused
        const next = getNextTrack();
        if (next) playTrack(next);
      }
      return nextState;
    });
  }, [getNextTrack, playTrack]);

  // Seek handler
  const seek = useCallback((timeInSeconds: number) => {
    if (audioRef.current && isFinite(timeInSeconds)) {
      const maxDuration =
        (audioRef.current.duration && !isNaN(audioRef.current.duration) ? audioRef.current.duration : null) ||
        currentTrackRef.current?.duration ||
        0;
      const clamped = Math.max(0, maxDuration > 0 ? Math.min(timeInSeconds, maxDuration) : timeInSeconds);
      try {
        audioRef.current.currentTime = clamped;
        setCurrentTime(clamped);
      } catch (e) {
        console.warn("Audio seek failed:", e);
      }
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

  // Synchronize MediaSession API for lock screens & background controls
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator) || !currentTrack) return;

    const langLabel =
      currentTrack.language === "bn"
        ? "বাংলা"
        : currentTrack.language === "hi"
        ? "हिंदी"
        : "English";

    // Absolute URLs are required by mobile notification systems (Android / iOS)
    const getAbsoluteUrl = (url: string) => {
      if (!url) return "";
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: `NeuroWave Radio [${langLabel}]`,
      artwork: [
        { src: getAbsoluteUrl(currentTrack.coverUrl), sizes: "512x512", type: "image/jpeg" },
        { src: getAbsoluteUrl(currentTrack.coverUrl), sizes: "256x256", type: "image/jpeg" },
        { src: getAbsoluteUrl(currentTrack.coverUrl), sizes: "192x192", type: "image/jpeg" },
        { src: getAbsoluteUrl(currentTrack.coverUrl), sizes: "96x96", type: "image/jpeg" },
      ],
    });

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

    navigator.mediaSession.setActionHandler("play", async () => {
      configureAudioSession();
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        try {
          await audioContextRef.current.resume();
        } catch {}
      }
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          navigator.mediaSession.playbackState = "playing";
        } catch (e) {
          console.warn("MediaSession play failed:", e);
        }
      }
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        navigator.mediaSession.playbackState = "paused";
      }
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      playNextRef.current();
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      playPreviousRef.current();
    });

    try {
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime != null && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });
    } catch {}

    try {
      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        if (audioRef.current) {
          const offset = details.seekOffset || 10;
          const newTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + offset);
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      });
    } catch {}

    try {
      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        if (audioRef.current) {
          const offset = details.seekOffset || 10;
          const newTime = Math.max(0, audioRef.current.currentTime - offset);
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      });
    } catch {}

    try {
      navigator.mediaSession.setActionHandler("stop", () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
          navigator.mediaSession.playbackState = "none";
        }
      });
    } catch {}
  }, [currentTrack]);

  // Keep MediaSession playbackState updated whenever isPlaying changes
  useEffect(() => {
    if (typeof window !== "undefined" && "mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [isPlaying]);

  // Synchronize MediaSession position state for lock screen progress bars
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "mediaSession" in navigator &&
      "setPositionState" in navigator.mediaSession &&
      duration > 0 &&
      !isNaN(duration) &&
      !isNaN(currentTime)
    ) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(0, duration),
          playbackRate: audioRef.current?.playbackRate || 1,
          position: Math.min(Math.max(0, currentTime), duration),
        });
      } catch {}
    }
  }, [currentTime, duration]);

  // Setup audio element event listeners and DOM attachment
  useEffect(() => {
    configureAudioSession();

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");

    // Keep audio element in the DOM tree (hidden) to prevent mobile browser engines
    // from garbage-collecting or deprioritizing playback when the screen is locked
    audio.style.position = "fixed";
    audio.style.top = "-9999px";
    audio.style.left = "-9999px";
    audio.style.opacity = "0";
    audio.style.pointerEvents = "none";
    document.body.appendChild(audio);

    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onEnded = () => {
      // In Radio Mode or default loop, auto advance to next
      playNextRef.current();
    };
    const onError = () => {
      console.warn("Audio playback error encountered, auto-advancing to next track...");
      if (isRadioModeRef.current) {
        setTimeout(() => playNextRef.current(), 1000);
      }
    };
    const onPlay = () => {
      setIsPlaying(true);
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
      }
    };
    const onPause = () => {
      setIsPlaying(false);
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    if (currentTrackRef.current) {
      audio.src = currentTrackRef.current.audioUrl;
    }

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.src = "";
      if (audio.parentNode) {
        audio.parentNode.removeChild(audio);
      }
    };
  }, []);

  // Handle visibility changes when user switches apps or unlocks phone
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        configureAudioSession();
        if (audioContextRef.current && audioContextRef.current.state === "suspended") {
          try {
            await audioContextRef.current.resume();
          } catch {}
        }
        if (audioRef.current) {
          if (!audioRef.current.paused && !isPlaying) {
            setIsPlaying(true);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying]);

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
