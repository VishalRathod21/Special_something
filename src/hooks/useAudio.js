import { useCallback, useEffect, useRef, useState } from 'react';
import { birthdayConfig } from '../data/birthdayConfig';

/**
 * Shared HTML5 Audio + subtle Web Audio UI chime hook.
 * Instantiated once at the root BirthdayExperience level so playback persists
 * seamlessly across all screens without duplicate audio elements or restarts.
 */
export function useAudio() {
  const tracks = birthdayConfig.music.tracks;
  const audioRef = useRef(null);
  const sfxCtxRef = useRef(null);
  const currentTrackIndexRef = useRef(0);
  const isPlayingIntentRef = useRef(false);
  const usedFallbackRef = useRef(false);
  const spotifyPauseRef = useRef(null);
  const selectTrackRef = useRef(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpotifyPlaying, setIsSpotifyPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(null);

  const currentTrack = tracks[currentTrackIndex] ?? tracks[0];

  const pauseSpotifyIfActive = useCallback(() => {
    if (spotifyPauseRef.current) {
      try {
        spotifyPauseRef.current();
      } catch {
        // Ignore cross-origin embed cleanup races
      }
    }
    setIsSpotifyPlaying(false);
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    const activeTrack = tracks[currentTrackIndexRef.current] ?? tracks[0];
    if (!audio || (!activeTrack?.src && !activeTrack?.fallbackSrc)) {
      setAudioError('No authorized audio source configured in birthdayConfig.js.');
      return false;
    }

    pauseSpotifyIfActive();

    if (!audio.src) {
      audio.src = activeTrack.src || activeTrack.fallbackSrc;
      audio.load();
    }

    try {
      isPlayingIntentRef.current = true;
      await audio.play();
      setAudioError(null);
      setIsPlaying(true);
      return true;
    } catch {
      isPlayingIntentRef.current = false;
      setIsPlaying(false);
      setAudioError(
        'Tap Play to start playback, or use the official Spotify player below.'
      );
      return false;
    }
  }, [pauseSpotifyIfActive, tracks]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    isPlayingIntentRef.current = false;
    if (audio) audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, pause, play]);

  const selectTrack = useCallback(
    async (index, autoStart = true) => {
      if (!tracks.length) return;
      const safeIdx = ((index % tracks.length) + tracks.length) % tracks.length;
      const targetTrack = tracks[safeIdx];

      if (autoStart) {
        pauseSpotifyIfActive();
      }

      // Same track already loaded: resume or pause without restarting from 0:00
      if (safeIdx === currentTrackIndexRef.current) {
        if (autoStart) {
          await play();
        } else {
          pause();
        }
        return;
      }

      usedFallbackRef.current = false;
      currentTrackIndexRef.current = safeIdx;
      setCurrentTrackIndex(safeIdx);
      isPlayingIntentRef.current = autoStart;
      setCurrentTime(0);
      setDuration(0);
      setAudioError(null);

      const audio = audioRef.current;
      const nextSrc = targetTrack?.src || targetTrack?.fallbackSrc;
      if (audio && nextSrc) {
        audio.src = nextSrc;
        audio.load();
        if (autoStart) {
          try {
            await audio.play();
            setIsPlaying(true);
            setAudioError(null);
          } catch {
            isPlayingIntentRef.current = false;
            setIsPlaying(false);
            setAudioError(
              'Tap Play to start this song, or press Play in the Spotify player below.'
            );
          }
        } else {
          audio.pause();
          setIsPlaying(false);
        }
      }
    },
    [pause, pauseSpotifyIfActive, play, tracks]
  );

  useEffect(() => {
    selectTrackRef.current = selectTrack;
  }, [selectTrack]);

  // Initialize single shared HTMLAudioElement once
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.loop = tracks.length === 1;
    audio.volume = volume;
    audio.muted = isMuted;
    audioRef.current = audio;

    if (tracks[0]?.src || tracks[0]?.fallbackSrc) {
      audio.src = tracks[0].src || tracks[0].fallbackSrc;
    }

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setAudioError(null);
    };
    const handleEnded = () => {
      const nextIdx = (currentTrackIndexRef.current + 1) % tracks.length;
      selectTrackRef.current?.(nextIdx, true);
    };
    const handleError = () => {
      const activeTrack = tracks[currentTrackIndexRef.current];
      if (!usedFallbackRef.current && activeTrack?.fallbackSrc) {
        usedFallbackRef.current = true;
        audio.src = activeTrack.fallbackSrc;
        audio.load();
        if (isPlayingIntentRef.current) {
          audio.play().catch(() => {
            isPlayingIntentRef.current = false;
            setIsPlaying(false);
          });
        }
        return;
      }

      isPlayingIntentRef.current = false;
      setIsPlaying(false);
      setAudioError(
        'Audio preview could not be loaded right now. Try playing directly in the Spotify player below.'
      );
    };
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => {
      setAudioError(null);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync volume & mute state cleanly
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  const toggleTrack = useCallback(
    async (index) => {
      const safeIdx = ((index % tracks.length) + tracks.length) % tracks.length;
      if (safeIdx === currentTrackIndexRef.current) {
        await togglePlay();
      } else {
        await selectTrack(safeIdx, true);
      }
    },
    [selectTrack, togglePlay, tracks.length]
  );

  const nextTrack = useCallback(() => {
    selectTrack(
      currentTrackIndexRef.current + 1,
      isPlaying || isPlayingIntentRef.current
    );
  }, [isPlaying, selectTrack]);

  const prevTrack = useCallback(() => {
    selectTrack(
      currentTrackIndexRef.current - 1,
      isPlaying || isPlayingIntentRef.current
    );
  }, [isPlaying, selectTrack]);

  const playFromStart = useCallback(async () => {
    pauseSpotifyIfActive();
    const audio = audioRef.current;
    if (currentTrackIndexRef.current === 0) {
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      await play();
      return;
    }
    await selectTrack(0, true);
  }, [pauseSpotifyIfActive, play, selectTrack]);

  const seek = useCallback(
    (seconds) => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(seconds)) return;
      audio.currentTime = Math.max(0, Math.min(seconds, duration || seconds));
      setCurrentTime(audio.currentTime);
    },
    [duration]
  );

  const setVolumeLevel = useCallback(
    (nextVal) => {
      const clamped = Math.max(0, Math.min(1, nextVal));
      setVolume(clamped);
      if (clamped > 0 && isMuted) {
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const registerSpotifyPause = useCallback((pauseFn) => {
    spotifyPauseRef.current = pauseFn;
  }, []);

  const handleSpotifyPlaybackState = useCallback((playing) => {
    setIsSpotifyPlaying(Boolean(playing));
    if (playing) {
      const audio = audioRef.current;
      isPlayingIntentRef.current = false;
      if (audio && !audio.paused) {
        audio.pause();
      }
      setIsPlaying(false);
    }
  }, []);

  /**
   * Gentle synthesized Web Audio UI sound effects (unlock sparkle, gift pop,
   * envelope rustle-chime, wish chime). Fails silently when muted or unsupported.
   */
  const playChime = useCallback(
    (kind = 'sparkle') => {
      if (isMuted || typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      try {
        if (!sfxCtxRef.current) {
          sfxCtxRef.current = new AudioCtx();
        }
        const ctx = sfxCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }

        const now = ctx.currentTime;
        const melodies = {
          unlock: [523.25, 659.25, 783.99, 1046.5],
          gift: [587.33, 739.99, 880],
          letter: [440, 554.37, 659.25],
          wish: [659.25, 783.99, 987.77, 1318.5],
          sparkle: [783.99, 987.77],
        };
        const freqs = melodies[kind] || melodies.sparkle;

        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.001, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + i * 0.08 + 0.35
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.38);
        });
      } catch {
        // Ignore audio context restrictions gracefully
      }
    },
    [isMuted]
  );

  return {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isSpotifyPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    audioError,
    play,
    pause,
    togglePlay,
    selectTrack,
    toggleTrack,
    nextTrack,
    prevTrack,
    playFromStart,
    seek,
    setVolumeLevel,
    toggleMute,
    registerSpotifyPause,
    handleSpotifyPlaybackState,
    playChime,
  };
}

export function formatAudioTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
