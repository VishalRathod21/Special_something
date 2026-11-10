import { useCallback, useEffect, useRef, useState } from 'react';
import { birthdayConfig } from '../data/birthdayConfig';

let youtubeApiPromise = null;

/**
 * Shared singleton loader for the official YouTube IFrame Player API.
 */
export function loadYouTubeIframeApi(timeoutMs = 7000) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window unavailable'));
  }

  if (window.YT && typeof window.YT.Player === 'function') {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      youtubeApiPromise = null;
      reject(new Error('YouTube IFrame API timed out'));
    }, timeoutMs);

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timer);
      if (typeof prevReady === 'function') {
        try {
          prevReady();
        } catch {
          // Ignore previous handler errors
        }
      }
      if (window.YT && typeof window.YT.Player === 'function') {
        resolve(window.YT);
      } else {
        youtubeApiPromise = null;
        reject(new Error('YouTube API initialized without Player'));
      }
    };

    if (!document.getElementById('youtube-iframe-api-loader')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api-loader';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timer);
        youtubeApiPromise = null;
        reject(new Error('Failed to load YouTube IFrame API'));
      };
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

/**
 * Shared HTML5 Audio + persistent YouTube IFrame Audio + subtle Web Audio UI chime hook.
 * Instantiated once at the root BirthdayExperience level so playback persists
 * seamlessly across all 10 screens without duplicate audio elements or restarts.
 */
export function useAudio() {
  const tracks = birthdayConfig.music.tracks;
  const audioRef = useRef(null);
  const sfxCtxRef = useRef(null);
  const currentTrackIndexRef = useRef(0);
  const isPlayingIntentRef = useRef(false);
  const usedFallbackRef = useRef(false);

  const spotifyPauseRef = useRef(null);
  const youtubeEmbedPauseRef = useRef(null);
  const selectTrackRef = useRef(null);

  const ytPlayerRef = useRef(null);
  const ytReadyRef = useRef(false);
  const ytLoadedVideoIdRef = useRef('');
  const ytPendingPlayRef = useRef(false);
  const volumeRef = useRef(0.75);
  const isMutedRef = useRef(false);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpotifyPlaying, setIsSpotifyPlaying] = useState(false);
  const [isYoutubeEmbedPlaying, setIsYoutubeEmbedPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(null);

  const currentTrack = tracks[currentTrackIndex] ?? tracks[0];

  const pauseExternalEmbedsIfActive = useCallback(() => {
    if (spotifyPauseRef.current) {
      try {
        spotifyPauseRef.current();
      } catch {
        // Ignore cross-origin embed cleanup races
      }
    }
    if (youtubeEmbedPauseRef.current) {
      try {
        youtubeEmbedPauseRef.current();
      } catch {
        // Ignore embed cleanup races
      }
    }
    setIsSpotifyPlaying(false);
    setIsYoutubeEmbedPlaying(false);
  }, []);

  const pauseYtBackground = useCallback(() => {
    ytPendingPlayRef.current = false;
    const player = ytPlayerRef.current;
    if (player && ytReadyRef.current && typeof player.pauseVideo === 'function') {
      try {
        player.pauseVideo();
      } catch {
        // Ignore YT teardown races
      }
    }
  }, []);

  const play = useCallback(async () => {
    const activeTrack = tracks[currentTrackIndexRef.current] ?? tracks[0];
    if (!activeTrack) {
      setAudioError('No authorized audio source configured in birthdayConfig.js.');
      return false;
    }

    pauseExternalEmbedsIfActive();

    // Route YouTube-backed tracks through persistent background YT.Player
    if (activeTrack.youtubeId) {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
      }

      isPlayingIntentRef.current = true;
      const player = ytPlayerRef.current;
      if (player && ytReadyRef.current) {
        try {
          player.setVolume?.(Math.round(volumeRef.current * 100));
          if (isMutedRef.current) player.mute?.();
          else player.unMute?.();

          if (ytLoadedVideoIdRef.current !== activeTrack.youtubeId) {
            ytLoadedVideoIdRef.current = activeTrack.youtubeId;
            player.loadVideoById(activeTrack.youtubeId);
          } else {
            player.playVideo();
          }
          setAudioError(null);
          setIsPlaying(true);
          return true;
        } catch {
          isPlayingIntentRef.current = false;
          setIsPlaying(false);
          setAudioError(
            'Tap Play in the YouTube player below or open on YouTube.'
          );
          return false;
        }
      } else {
        ytPendingPlayRef.current = true;
        setAudioError(
          'Connecting to YouTube player — or press Play directly in the YouTube box below.'
        );
        return false;
      }
    }

    const audio = audioRef.current;
    if (!audio || (!activeTrack.src && !activeTrack.fallbackSrc)) {
      setAudioError('No authorized audio source configured in birthdayConfig.js.');
      return false;
    }

    pauseYtBackground();

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
        'Tap Play to start playback, or use the official player below.'
      );
      return false;
    }
  }, [pauseExternalEmbedsIfActive, pauseYtBackground, tracks]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    isPlayingIntentRef.current = false;
    if (audio && !audio.paused) audio.pause();
    pauseYtBackground();
    setIsPlaying(false);
  }, [pauseYtBackground]);

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
        pauseExternalEmbedsIfActive();
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
      setDuration(targetTrack.duration || 0);
      setAudioError(null);

      const audio = audioRef.current;

      if (targetTrack.youtubeId) {
        if (audio && !audio.paused) {
          audio.pause();
        }
        if (autoStart) {
          await play();
        } else {
          pauseYtBackground();
          if (
            ytPlayerRef.current &&
            ytReadyRef.current &&
            ytLoadedVideoIdRef.current !== targetTrack.youtubeId
          ) {
            ytLoadedVideoIdRef.current = targetTrack.youtubeId;
            ytPlayerRef.current.cueVideoById(targetTrack.youtubeId);
          }
          setIsPlaying(false);
        }
        return;
      }

      pauseYtBackground();
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
              'Tap Play to start this song, or press Play in the player below.'
            );
          }
        } else {
          audio.pause();
          setIsPlaying(false);
        }
      }
    },
    [pause, pauseExternalEmbedsIfActive, pauseYtBackground, play, tracks]
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

    const handleTimeUpdate = () => {
      if (!tracks[currentTrackIndexRef.current]?.youtubeId) {
        setCurrentTime(audio.currentTime || 0);
      }
    };
    const handleLoadedMetadata = () => {
      if (!tracks[currentTrackIndexRef.current]?.youtubeId) {
        setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        setAudioError(null);
      }
    };
    const handleEnded = () => {
      if (!tracks[currentTrackIndexRef.current]?.youtubeId) {
        const nextIdx = (currentTrackIndexRef.current + 1) % tracks.length;
        selectTrackRef.current?.(nextIdx, true);
      }
    };
    const handleError = () => {
      const activeTrack = tracks[currentTrackIndexRef.current];
      if (!activeTrack || activeTrack.youtubeId) return;

      if (!usedFallbackRef.current && activeTrack.fallbackSrc) {
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
        'Audio preview could not be loaded right now. Try playing directly in the official player below.'
      );
    };
    const handlePause = () => {
      if (!tracks[currentTrackIndexRef.current]?.youtubeId) {
        setIsPlaying(false);
      }
    };
    const handlePlay = () => {
      if (!tracks[currentTrackIndexRef.current]?.youtubeId) {
        setAudioError(null);
        setIsPlaying(true);
      }
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

  // Initialize persistent hidden YouTube IFrame Player once for YouTube tracks
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const initialYtTrack = tracks.find((t) => t.youtubeId);
    if (!initialYtTrack) return undefined;

    let cancelled = false;
    const hostWrapper = document.createElement('div');
    hostWrapper.setAttribute('aria-hidden', 'true');
    hostWrapper.style.cssText =
      'position:fixed;left:-9999px;top:0;width:240px;height:135px;opacity:0.001;pointer-events:none;overflow:hidden;';
    const playerTarget = document.createElement('div');
    hostWrapper.appendChild(playerTarget);
    document.body.appendChild(hostWrapper);

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled) return;
        ytPlayerRef.current = new YT.Player(playerTarget, {
          width: '240',
          height: '135',
          videoId: initialYtTrack.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              ytReadyRef.current = true;
              ytLoadedVideoIdRef.current = initialYtTrack.youtubeId;
              try {
                const iframe = event.target.getIframe?.();
                if (iframe) {
                  iframe.tabIndex = -1;
                  iframe.title = 'Background music stream';
                }
                event.target.setVolume(Math.round(volumeRef.current * 100));
                if (isMutedRef.current) event.target.mute();
                else event.target.unMute();
              } catch {
                // Ignore setup issues
              }

              const activeTrack = tracks[currentTrackIndexRef.current];
              if (ytPendingPlayRef.current && activeTrack?.youtubeId) {
                ytPendingPlayRef.current = false;
                if (ytLoadedVideoIdRef.current !== activeTrack.youtubeId) {
                  ytLoadedVideoIdRef.current = activeTrack.youtubeId;
                  event.target.loadVideoById(activeTrack.youtubeId);
                } else {
                  event.target.playVideo();
                }
              }
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const activeTrack = tracks[currentTrackIndexRef.current];
              if (!activeTrack?.youtubeId) return;

              if (event.data === YT.PlayerState.PLAYING) {
                setAudioError(null);
                setIsPlaying(true);
                const dur = event.target.getDuration?.();
                if (Number.isFinite(dur) && dur > 0) {
                  setDuration(dur);
                }
              } else if (event.data === YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === YT.PlayerState.ENDED) {
                const nextIdx = (currentTrackIndexRef.current + 1) % tracks.length;
                selectTrackRef.current?.(nextIdx, true);
              }
            },
            onError: () => {
              if (cancelled) return;
              if (!tracks[currentTrackIndexRef.current]?.youtubeId) return;
              isPlayingIntentRef.current = false;
              setIsPlaying(false);
              setAudioError(
                'Could not stream in background — press Play in the YouTube player below.'
              );
            },
          },
        });
      })
      .catch(() => {
        // Fallback player remains available inside MusicPlayer
      });

    return () => {
      cancelled = true;
      ytReadyRef.current = false;
      try {
        ytPlayerRef.current?.destroy?.();
      } catch {
        // Ignore teardown issues
      }
      ytPlayerRef.current = null;
      hostWrapper.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll YouTube playback progress only while a YouTube track is actively playing
  useEffect(() => {
    if (!isPlaying || !currentTrack?.youtubeId) return undefined;

    const timer = window.setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player || !ytReadyRef.current) return;
      try {
        const cur = player.getCurrentTime?.();
        const dur = player.getDuration?.();
        if (Number.isFinite(cur)) setCurrentTime(cur);
        if (Number.isFinite(dur) && dur > 0) setDuration(dur);
      } catch {
        // Ignore transient player polling errors
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [isPlaying, currentTrack]);

  // Sync volume & mute state cleanly across HTML5 audio and YouTube player
  useEffect(() => {
    volumeRef.current = volume;
    isMutedRef.current = isMuted;

    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }

    const player = ytPlayerRef.current;
    if (player && ytReadyRef.current) {
      try {
        player.setVolume?.(Math.round(volume * 100));
        if (isMuted) player.mute?.();
        else player.unMute?.();
      } catch {
        // Ignore transient YT state errors
      }
    }
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
    pauseExternalEmbedsIfActive();
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
  }, [pauseExternalEmbedsIfActive, play, selectTrack]);

  const seek = useCallback(
    (seconds) => {
      if (!Number.isFinite(seconds)) return;
      const activeTrack = tracks[currentTrackIndexRef.current];
      const clamped = Math.max(0, Math.min(seconds, duration || seconds));

      if (activeTrack?.youtubeId) {
        const player = ytPlayerRef.current;
        if (player && ytReadyRef.current) {
          try {
            player.seekTo?.(clamped, true);
            setCurrentTime(clamped);
          } catch {
            // Ignore YT seek error
          }
        }
        return;
      }

      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = clamped;
      setCurrentTime(audio.currentTime);
    },
    [duration, tracks]
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

  const registerYoutubeEmbedPause = useCallback((pauseFn) => {
    youtubeEmbedPauseRef.current = pauseFn;
  }, []);

  const handleSpotifyPlaybackState = useCallback(
    (playing) => {
      setIsSpotifyPlaying(Boolean(playing));
      if (playing) {
        const audio = audioRef.current;
        isPlayingIntentRef.current = false;
        if (audio && !audio.paused) {
          audio.pause();
        }
        pauseYtBackground();
        setIsPlaying(false);
      }
    },
    [pauseYtBackground]
  );

  const handleYoutubeEmbedPlaybackState = useCallback(
    (playing) => {
      setIsYoutubeEmbedPlaying(Boolean(playing));
      if (playing) {
        const audio = audioRef.current;
        isPlayingIntentRef.current = false;
        if (audio && !audio.paused) {
          audio.pause();
        }
        pauseYtBackground();
        setIsPlaying(false);
      }
    },
    [pauseYtBackground]
  );

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
    isYoutubeEmbedPlaying,
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
    registerYoutubeEmbedPause,
    handleSpotifyPlaybackState,
    handleYoutubeEmbedPlaybackState,
    playChime,
  };
}

export function formatAudioTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
