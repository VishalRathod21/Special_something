import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Disc3,
  ExternalLink,
  Headphones,
  Info,
  Music,
  Pause,
  Play,
  PlayCircle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import { formatAudioTime, loadYouTubeIframeApi } from '../hooks/useAudio';
import TeddyIllustration from './TeddyIllustration';
import { RibbonBow } from './ScrapbookAccents';

let spotifyApiPromise = null;

function loadSpotifyIframeApi(timeoutMs = 4500) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window unavailable'));
  }

  if (window.__spotifyIframeApi) {
    return Promise.resolve(window.__spotifyIframeApi);
  }

  if (spotifyApiPromise) {
    return spotifyApiPromise;
  }

  spotifyApiPromise = new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      spotifyApiPromise = null;
      reject(new Error('Spotify IFrame API timed out'));
    }, timeoutMs);

    const prevReady = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      window.clearTimeout(timer);
      window.__spotifyIframeApi = IFrameAPI;
      if (typeof prevReady === 'function') {
        try {
          prevReady(IFrameAPI);
        } catch {
          // Ignore previous handler errors
        }
      }
      resolve(IFrameAPI);
    };

    if (!document.getElementById('spotify-iframe-api-loader')) {
      const script = document.createElement('script');
      script.id = 'spotify-iframe-api-loader';
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timer);
        spotifyApiPromise = null;
        reject(new Error('Failed to load Spotify IFrame API'));
      };
      document.head.appendChild(script);
    }
  });

  return spotifyApiPromise;
}

export default function MusicPlayer({ audio, onNext }) {
  const {
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
    togglePlay,
    selectTrack,
    toggleTrack,
    nextTrack,
    prevTrack,
    seek,
    setVolumeLevel,
    toggleMute,
    registerSpotifyPause,
    registerYoutubeEmbedPause,
    handleSpotifyPlaybackState,
    handleYoutubeEmbedPlaybackState,
  } = audio;

  const [loadedCovers, setLoadedCovers] = useState({});
  const [failedCovers, setFailedCovers] = useState({});
  const [spotifyState, setSpotifyState] = useState('loading'); // 'loading' | 'ready' | 'fallback'
  const [youtubeState, setYoutubeState] = useState('loading'); // 'loading' | 'ready' | 'fallback'
  const [spotifyProgress, setSpotifyProgress] = useState({
    currentTime: 0,
    duration: 0,
  });

  const spotifyHostRef = useRef(null);
  const spotifyControllerRef = useRef(null);
  const loadedSpotifyUriRef = useRef('');

  const youtubeHostRef = useRef(null);
  const youtubeControllerRef = useRef(null);

  const latestTrackRef = useRef(currentTrack);
  latestTrackRef.current = currentTrack;

  const hasSpotify = Boolean(currentTrack?.spotifyUri);
  const hasYoutube = Boolean(currentTrack?.youtubeId);

  const anyPlaying = isPlaying || isSpotifyPlaying || isYoutubeEmbedPlaying;
  const displayTime =
    isSpotifyPlaying && spotifyProgress.duration > 0
      ? spotifyProgress.currentTime
      : currentTime;
  const displayDuration =
    isSpotifyPlaying && spotifyProgress.duration > 0
      ? spotifyProgress.duration
      : duration;

  const safeMax =
    displayDuration > 0 ? displayDuration : currentTrack?.duration || 30;
  const safeVal =
    displayDuration > 0 ? Math.min(displayTime, displayDuration) : 0;

  // Mount Official Spotify IFrame API controller whenever a Spotify-backed track is active
  useEffect(() => {
    if (!hasSpotify) return undefined;
    let active = true;
    const host = spotifyHostRef.current;
    const initialTrack = latestTrackRef.current;
    if (!host || !initialTrack?.spotifyUri) return undefined;

    setSpotifyState('loading');

    loadSpotifyIframeApi()
      .then((IFrameAPI) => {
        if (!active || !spotifyHostRef.current) return;

        const trackAtMount = latestTrackRef.current;
        if (!trackAtMount?.spotifyUri) return;

        spotifyHostRef.current.innerHTML = '';
        const mountTarget = document.createElement('div');
        spotifyHostRef.current.appendChild(mountTarget);

        IFrameAPI.createController(
          mountTarget,
          {
            uri: trackAtMount.spotifyUri,
            width: '100%',
            height: 152,
          },
          (controller) => {
            if (!active) {
              controller.destroy();
              return;
            }

            spotifyControllerRef.current = controller;
            loadedSpotifyUriRef.current = trackAtMount.spotifyUri;

            if (controller.iframeElement) {
              controller.iframeElement.title = `Official Spotify player for ${trackAtMount.title}`;
              controller.iframeElement.style.borderRadius = '14px';
            }

            registerSpotifyPause(() => {
              controller.pause();
            });

            controller.addListener('ready', () => {
              if (!active) return;
              setSpotifyState('ready');
              const latestUri = latestTrackRef.current?.spotifyUri;
              if (latestUri && loadedSpotifyUriRef.current !== latestUri) {
                loadedSpotifyUriRef.current = latestUri;
                controller.loadUri(latestUri);
              }
            });

            controller.addListener('playback_started', () => {
              if (!active) return;
              setSpotifyState('ready');
              handleSpotifyPlaybackState(true);
            });

            controller.addListener('playback_update', (event) => {
              if (!active) return;
              const data = event?.data || {};
              const isPaused = Boolean(data.isPaused);
              handleSpotifyPlaybackState(!isPaused);
              if (
                Number.isFinite(data.duration) &&
                data.duration > 0 &&
                Number.isFinite(data.position)
              ) {
                setSpotifyProgress({
                  currentTime: data.position / 1000,
                  duration: data.duration / 1000,
                });
              }
            });

            controller.addListener('error', () => {
              if (!active) return;
              handleSpotifyPlaybackState(false);
              setSpotifyState('fallback');
            });
          }
        );
      })
      .catch(() => {
        if (!active) return;
        setSpotifyState('fallback');
      });

    return () => {
      active = false;
      registerSpotifyPause(null);
      handleSpotifyPlaybackState(false);
      if (spotifyControllerRef.current) {
        try {
          spotifyControllerRef.current.destroy();
        } catch {
          // Ignore teardown errors
        }
        spotifyControllerRef.current = null;
      }
      loadedSpotifyUriRef.current = '';
      if (host) {
        host.innerHTML = '';
      }
    };
  }, [hasSpotify, registerSpotifyPause, handleSpotifyPlaybackState]);

  // Sync Spotify Embed track when switching between Spotify-backed songs
  useEffect(() => {
    const uri = currentTrack?.spotifyUri;
    const controller = spotifyControllerRef.current;
    if (!uri || !controller || loadedSpotifyUriRef.current === uri) return;

    loadedSpotifyUriRef.current = uri;
    setSpotifyProgress({ currentTime: 0, duration: 0 });
    handleSpotifyPlaybackState(false);
    if (controller.iframeElement) {
      controller.iframeElement.title = `Official Spotify player for ${currentTrack.title}`;
    }
    controller.loadUri(uri);
  }, [currentTrack, handleSpotifyPlaybackState]);

  // Mount Official YouTube Embed controller when a YouTube-backed track is active
  useEffect(() => {
    if (!hasYoutube) return undefined;
    let active = true;
    const host = youtubeHostRef.current;
    const ytTrack = latestTrackRef.current;
    if (!host || !ytTrack?.youtubeId) return undefined;

    setYoutubeState('loading');

    loadYouTubeIframeApi()
      .then((YT) => {
        if (!active || !youtubeHostRef.current) return;

        youtubeHostRef.current.innerHTML = '';
        const mountTarget = document.createElement('div');
        youtubeHostRef.current.appendChild(mountTarget);

        const player = new YT.Player(mountTarget, {
          width: '100%',
          height: '180',
          videoId: ytTrack.youtubeId,
          playerVars: {
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event) => {
              if (!active) return;
              youtubeControllerRef.current = event.target;
              const iframe = event.target.getIframe?.();
              if (iframe) {
                iframe.title = `Official YouTube player for ${ytTrack.title}`;
                iframe.style.borderRadius = '14px';
                iframe.style.width = '100%';
              }
              registerYoutubeEmbedPause(() => {
                event.target.pauseVideo?.();
              });
              setYoutubeState('ready');
            },
            onStateChange: (event) => {
              if (!active) return;
              if (event.data === YT.PlayerState.PLAYING) {
                setYoutubeState('ready');
                handleYoutubeEmbedPlaybackState(true);
              } else if (
                event.data === YT.PlayerState.PAUSED ||
                event.data === YT.PlayerState.ENDED
              ) {
                handleYoutubeEmbedPlaybackState(false);
              }
            },
            onError: () => {
              if (!active) return;
              handleYoutubeEmbedPlaybackState(false);
              setYoutubeState('fallback');
            },
          },
        });

        youtubeControllerRef.current = player;
      })
      .catch(() => {
        if (!active) return;
        setYoutubeState('fallback');
      });

    return () => {
      active = false;
      registerYoutubeEmbedPause(null);
      handleYoutubeEmbedPlaybackState(false);
      if (youtubeControllerRef.current) {
        try {
          youtubeControllerRef.current.destroy?.();
        } catch {
          // Ignore teardown errors
        }
        youtubeControllerRef.current = null;
      }
      if (host) {
        host.innerHTML = '';
      }
    };
  }, [hasYoutube, currentTrack?.youtubeId, registerYoutubeEmbedPause, handleYoutubeEmbedPlaybackState]);

  const markCoverLoaded = (trackId) => {
    setLoadedCovers((prev) => ({ ...prev, [trackId]: true }));
  };

  const markCoverFailed = (trackId) => {
    setFailedCovers((prev) => ({ ...prev, [trackId]: true }));
  };

  const handleMainPlayPause = async () => {
    if (isSpotifyPlaying && spotifyControllerRef.current) {
      spotifyControllerRef.current.pause();
      handleSpotifyPlaybackState(false);
      return;
    }
    if (isYoutubeEmbedPlaying && youtubeControllerRef.current) {
      youtubeControllerRef.current.pauseVideo?.();
      handleYoutubeEmbedPlaybackState(false);
      return;
    }
    await togglePlay();
  };

  const handleTrackPlayPause = async (idx) => {
    if (idx === currentTrackIndex && isSpotifyPlaying && spotifyControllerRef.current) {
      spotifyControllerRef.current.pause();
      handleSpotifyPlaybackState(false);
      return;
    }
    if (
      idx === currentTrackIndex &&
      isYoutubeEmbedPlaying &&
      youtubeControllerRef.current
    ) {
      youtubeControllerRef.current.pauseVideo?.();
      handleYoutubeEmbedPlaybackState(false);
      return;
    }
    await toggleTrack(idx);
  };

  const handleProgressSeek = (nextSeconds) => {
    if (isSpotifyPlaying && spotifyControllerRef.current) {
      const clamped = Math.max(
        0,
        Math.min(Math.floor(nextSeconds), Math.floor(displayDuration || nextSeconds))
      );
      spotifyControllerRef.current.seek(clamped);
      setSpotifyProgress((prev) => ({ ...prev, currentTime: clamped }));
      return;
    }
    if (isYoutubeEmbedPlaying && youtubeControllerRef.current) {
      youtubeControllerRef.current.seekTo?.(nextSeconds, true);
      return;
    }
    seek(nextSeconds);
  };

  const statusText = isPlaying
    ? 'Now Playing ✨'
    : isSpotifyPlaying
      ? 'Playing on Spotify 🎧'
      : isYoutubeEmbedPlaying
        ? 'Playing on YouTube 🎵'
        : currentTime > 0
          ? 'Paused 🎀'
          : 'Ready To Play 🎀';

  const sourceLabel = isSpotifyPlaying
    ? 'Spotify Embed Active'
    : isYoutubeEmbedPlaying
      ? 'YouTube Embed Active'
      : currentTrack?.youtubeId
        ? 'Official YouTube Track'
        : 'Official Audio Preview';

  return (
    <section
      aria-labelledby="music-heading"
      className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-5 pb-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="paper-card lace-border relative rounded-[2rem] px-5 py-7 sm:px-9 sm:py-9"
      >
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] px-3 py-1 text-xs font-semibold text-[#9E3C65]">
              <Music className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Birthday Soundtrack</span>
            </span>
            <h1
              id="music-heading"
              className="font-display mt-2 text-2xl font-bold text-[#513B48] sm:text-4xl"
            >
              Your Birthday Music Room 🎵
            </h1>
          </div>
          <RibbonBow className="hidden h-8 w-14 sm:block" />
        </div>

        {/* Main Turntable & Playlist Card */}
        <div className="rounded-3xl border-2 border-[#F8C8DC] bg-[#FFF8F3] p-5 shadow-inner sm:p-6">
          <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
            {/* Turntable Vinyl + DJ Teddy + Animated Music Visualizer */}
            <div className="relative mx-auto flex flex-col items-center">
              <div
                className={`relative flex h-44 w-44 items-center justify-center rounded-3xl border-2 border-[#EFA9C2] bg-[#FCE4EC] p-3 transition-shadow duration-500 sm:h-48 sm:w-48 ${
                  anyPlaying
                    ? 'shadow-[0_0_26px_rgba(239,169,194,0.75)]'
                    : 'shadow-sm'
                }`}
              >
                {/* Spinning Vinyl Record */}
                <div
                  className={`anim-vinyl relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-[#513B48]/90 shadow-md sm:h-40 sm:w-40 ${
                    anyPlaying ? 'anim-vinyl-playing' : ''
                  }`}
                  style={{
                    background:
                      'repeating-radial-gradient(circle at center, #513B48 0px, #513B48 3px, #684D5D 4px, #513B48 7px)',
                  }}
                >
                  <div
                    className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-xs"
                    style={{
                      backgroundColor: currentTrack?.accent || '#F8C8DC',
                    }}
                  >
                    <Disc3
                      className="h-5 w-5 text-[#513B48]"
                      aria-hidden="true"
                    />
                    {currentTrack?.coverArt && !failedCovers[currentTrack.id] && (
                      <img
                        src={currentTrack.coverArt}
                        alt=""
                        onLoad={() => markCoverLoaded(currentTrack.id)}
                        onError={() => markCoverFailed(currentTrack.id)}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                          loadedCovers[currentTrack.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )}
                    <span className="relative z-10 h-3 w-3 rounded-full bg-white ring-2 ring-[#513B48]" />
                  </div>
                </div>

                {/* Tonearm */}
                <div
                  aria-hidden="true"
                  className={`absolute top-3 right-3 h-20 w-2 origin-top rounded-full bg-[#C96B91] transition-transform duration-500 ${
                    anyPlaying ? 'rotate-[22deg]' : 'rotate-0'
                  }`}
                >
                  <span className="absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full border-2 border-white bg-[#9E3C65]" />
                  <span className="absolute bottom-0 -left-0.5 h-3 w-3 rounded-xs bg-[#513B48]" />
                </div>
              </div>

              {/* DJ Teddy + 12-Bar Animated Music Visualizer */}
              <div className="mt-3 flex items-center gap-2.5">
                <TeddyIllustration
                  mood="dj"
                  className="h-16 w-16"
                  animated={false}
                />
                <div
                  className="flex h-10 items-end gap-1 rounded-2xl border border-[#F8C8DC] bg-white px-2.5 py-1.5 shadow-2xs"
                  aria-label={anyPlaying ? 'Music visualizer active' : 'Music visualizer paused'}
                >
                  {[
                    { delay: 0, dur: '0.72s', h: 'h-5' },
                    { delay: 0.14, dur: '0.86s', h: 'h-7' },
                    { delay: 0.28, dur: '0.64s', h: 'h-6' },
                    { delay: 0.08, dur: '0.92s', h: 'h-7' },
                    { delay: 0.36, dur: '0.76s', h: 'h-5' },
                    { delay: 0.18, dur: '0.68s', h: 'h-7' },
                    { delay: 0.42, dur: '0.84s', h: 'h-6' },
                    { delay: 0.12, dur: '0.74s', h: 'h-7' },
                    { delay: 0.31, dur: '0.88s', h: 'h-5' },
                    { delay: 0.22, dur: '0.66s', h: 'h-7' },
                    { delay: 0.05, dur: '0.82s', h: 'h-6' },
                    { delay: 0.26, dur: '0.78s', h: 'h-5' },
                  ].map((bar, idx) => (
                    <span
                      key={idx}
                      style={{
                        animationDelay: `${bar.delay}s`,
                        animationDuration: bar.dur,
                      }}
                      className={`anim-eq-bar inline-block w-1.5 rounded-full bg-gradient-to-t from-[#9E3C65] via-[#C96B91] to-[#F8C8DC] ${bar.h} ${
                        anyPlaying ? 'anim-eq-playing' : 'opacity-40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Track Info & Controls */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] px-2.5 py-0.5 text-xs font-semibold tracking-wider text-[#9E3C65] uppercase">
                    {anyPlaying && (
                      <span
                        className="h-2 w-2 animate-pulse rounded-full bg-[#9E3C65]"
                        aria-hidden="true"
                      />
                    )}
                    <span>{statusText}</span>
                  </span>
                  <span className="text-[11px] font-medium text-[#6F5564]">
                    {sourceLabel}
                  </span>
                </div>

                <h2 className="font-display mt-1.5 text-2xl font-bold text-[#513B48]">
                  {currentTrack?.title}
                </h2>
                <p className="text-sm font-medium text-[#6F5564]">
                  {currentTrack?.artist}
                  {currentTrack?.movie ? ` · ${currentTrack.movie}` : ''}
                </p>
                {currentTrack?.note && (
                  <p className="font-hand mt-1 text-lg text-[#9E3C65]">
                    {currentTrack.note}
                  </p>
                )}
              </div>

              {/* Audio Error Notice */}
              {audioError && (
                <div
                  role="status"
                  className="mt-3 flex items-start gap-2 rounded-2xl border border-[#EFA9C2] bg-[#FCE4EC] p-3 text-xs text-[#513B48]"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#9E3C65]"
                    aria-hidden="true"
                  />
                  <span>{audioError}</span>
                </div>
              )}

              {/* Progress Bar Slider */}
              <div className="mt-4">
                <label htmlFor="track-progress" className="visually-hidden">
                  Track playback progress
                </label>
                <input
                  id="track-progress"
                  type="range"
                  min={0}
                  max={safeMax}
                  step={0.25}
                  value={safeVal}
                  onChange={(e) => handleProgressSeek(Number(e.target.value))}
                  aria-valuetext={`${formatAudioTime(displayTime)} of ${formatAudioTime(displayDuration || safeMax)}`}
                  style={{
                    '--attr-min': 0,
                    '--attr-max': safeMax,
                    '--control-value': safeVal,
                  }}
                  className="pastel-slider"
                />
                <div className="flex justify-between text-xs font-medium text-[#6F5564] tabular-nums">
                  <span>{formatAudioTime(displayTime)}</span>
                  <span>
                    {formatAudioTime(displayDuration || currentTrack?.duration || 30)}
                  </span>
                </div>
              </div>

              {/* Playback Transport Buttons & Volume Control */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={prevTrack}
                    aria-label="Previous song"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#EFA9C2] bg-white text-[#513B48] shadow-xs transition-colors hover:bg-[#FCE4EC]"
                  >
                    <SkipBack className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={handleMainPlayPause}
                    aria-label={
                      anyPlaying
                        ? `Pause ${currentTrack?.title}`
                        : `Play ${currentTrack?.title}`
                    }
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#9E3C65] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#843054]"
                  >
                    {anyPlaying ? (
                      <>
                        <Pause className="h-4 w-4" aria-hidden="true" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play
                          className="h-4 w-4 translate-x-[0.5px]"
                          aria-hidden="true"
                        />
                        <span>Play Music</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={nextTrack}
                    aria-label="Next song"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#EFA9C2] bg-white text-[#513B48] shadow-xs transition-colors hover:bg-[#FCE4EC]"
                  >
                    <SkipForward className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label="Mute audio"
                    aria-pressed={isMuted}
                    className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-[#F8C8DC] bg-white text-[#513B48] hover:bg-[#FCE4EC]"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX
                        className="h-4 w-4 text-[#9E3C65]"
                        aria-hidden="true"
                      />
                    ) : (
                      <Volume2 className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                  <label htmlFor="music-volume" className="visually-hidden">
                    Volume
                  </label>
                  <input
                    id="music-volume"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolumeLevel(Number(e.target.value))}
                    aria-valuetext={`${Math.round((isMuted ? 0 : volume) * 100)} percent`}
                    style={{
                      '--attr-min': 0,
                      '--attr-max': 1,
                      '--control-value': isMuted ? 0 : volume,
                    }}
                    className="pastel-slider !w-24 sm:!w-28"
                  />
                  <span className="w-9 text-right text-xs font-medium text-[#6F5564] tabular-nums">
                    {isMuted ? 'Mute' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>
              </div>
              {isSpotifyPlaying && (
                <p className="mt-2 text-right text-[11px] text-[#6F5564]">
                  Volume slider controls turntable playback; Spotify embed uses
                  device volume.
                </p>
              )}
            </div>
          </div>

          {/* Playlist Section */}
          <div className="mt-6 border-t border-[#F8C8DC] pt-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2
                id="playlist-heading"
                className="font-display text-lg font-bold text-[#513B48] sm:text-xl"
              >
                {birthdayConfig.music.playlistHeading}
              </h2>
              <span className="rounded-full bg-[#FCE4EC] px-3 py-0.5 text-xs font-semibold text-[#9E3C65]">
                {tracks.length} Songs
              </span>
            </div>

            <ul
              role="list"
              aria-labelledby="playlist-heading"
              className="space-y-2.5"
            >
              {tracks.map((track, idx) => {
                const isSelected = idx === currentTrackIndex;
                const isThisTurntablePlaying = isSelected && isPlaying;
                const isThisSpotifyPlaying = isSelected && isSpotifyPlaying;
                const isThisYoutubePlaying = isSelected && isYoutubeEmbedPlaying;
                const isThisPlaying =
                  isThisTurntablePlaying ||
                  isThisSpotifyPlaying ||
                  isThisYoutubePlaying;

                return (
                  <li
                    key={track.id}
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 transition-all ${
                      isSelected
                        ? 'border-[#9E3C65] bg-[#FCE4EC]/85 shadow-xs'
                        : 'border-[#F8C8DC] bg-white hover:bg-[#FCE4EC]/40'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectTrack(idx, true)}
                      aria-current={isSelected ? 'true' : undefined}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span className="w-5 shrink-0 text-xs font-bold text-[#9E3C65] tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F8C8DC] bg-[#FCE4EC]/75">
                        <Disc3
                          className="h-5 w-5 text-[#9E3C65]"
                          aria-hidden="true"
                        />
                        {track.coverArt && !failedCovers[track.id] && (
                          <img
                            src={track.coverArt}
                            alt=""
                            onLoad={() => markCoverLoaded(track.id)}
                            onError={() => markCoverFailed(track.id)}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                              loadedCovers[track.id] ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-bold text-[#513B48] sm:text-base">
                            {track.title}
                          </span>
                          {isThisPlaying ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#9E3C65] shadow-2xs">
                              <span
                                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9E3C65]"
                                aria-hidden="true"
                              />
                              <span>
                                {isThisSpotifyPlaying
                                  ? 'Playing on Spotify'
                                  : isThisYoutubePlaying
                                    ? 'Playing on YouTube'
                                    : 'Now Playing'}
                              </span>
                            </span>
                          ) : isSelected ? (
                            <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-[#6F5564]">
                              {currentTime > 0 ? 'Paused' : 'Selected'}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-[#6F5564]">
                          {track.artist}
                          {track.movie ? ` · ${track.movie}` : ''}
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTrackPlayPause(idx)}
                      aria-label={
                        isThisPlaying
                          ? `Pause ${track.title}`
                          : `Play ${track.title}`
                      }
                      className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        isThisPlaying
                          ? 'bg-[#9E3C65] text-white hover:bg-[#843054]'
                          : 'border border-[#EFA9C2] bg-white text-[#9E3C65] hover:bg-[#FCE4EC]'
                      }`}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play
                            className="h-3.5 w-3.5 translate-x-[0.5px]"
                            aria-hidden="true"
                          />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Official Spotify OR Official YouTube Player Section */}
          {hasSpotify && (
            <div className="mt-5 rounded-2xl border border-[#EFA9C2] bg-white/95 p-4">
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FCE4EC] text-[#9E3C65]">
                    <Headphones className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h2 className="text-sm font-bold text-[#513B48]">
                    Official Spotify Player — {currentTrack?.title}
                  </h2>
                </div>

                {currentTrack?.spotifyUrl && (
                  <a
                    href={currentTrack.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#EFA9C2] bg-[#FCE4EC]/75 px-3 py-1 text-xs font-semibold text-[#9E3C65] transition-colors hover:bg-[#F8C8DC]"
                  >
                    <span>Open in Spotify</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>

              <div className="mb-3 flex items-start gap-2 rounded-xl border border-[#F8C8DC] bg-[#FFF8F3] px-3 py-2 text-xs leading-relaxed text-[#6F5564]">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#9E3C65]"
                  aria-hidden="true"
                />
                <div>
                  <p>
                    <strong className="text-[#513B48]">
                      Want the full song?
                    </strong>{' '}
                    Log in to Spotify in your browser and press{' '}
                    <strong className="text-[#513B48]">Play</strong> directly
                    inside the Spotify player below (guests without login hear a
                    30-second preview).
                  </p>
                  <p className="mt-1">
                    If Spotify asks you to sign in or won&apos;t play inside the
                    embed, tap{' '}
                    <strong className="text-[#513B48]">Open in Spotify</strong>{' '}
                    above — or use the pink Turntable controls to keep music
                    playing seamlessly across all birthday pages.
                  </p>
                </div>
              </div>

              {spotifyState !== 'fallback' ? (
                <div className="relative min-h-[152px] w-full overflow-hidden rounded-xl border border-[#F8C8DC] bg-[#FCE4EC]/45">
                  {spotifyState === 'loading' && (
                    <div
                      role="status"
                      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center"
                    >
                      <Headphones
                        className="h-5 w-5 animate-pulse text-[#9E3C65]"
                        aria-hidden="true"
                      />
                      <p className="text-xs font-semibold text-[#513B48]">
                        Loading official Spotify player for {currentTrack?.title}…
                      </p>
                      <p className="text-[11px] text-[#6F5564]">
                        Tap Open in Spotify anytime if your browser blocks embeds.
                      </p>
                    </div>
                  )}
                  <div ref={spotifyHostRef} className="min-h-[152px] w-full" />
                </div>
              ) : (
                currentTrack?.spotifyEmbedUrl && (
                  <iframe
                    title={`Official Spotify player for ${currentTrack.title}`}
                    src={currentTrack.spotifyEmbedUrl}
                    width="100%"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="rounded-xl border-0"
                  />
                )
              )}
            </div>
          )}

          {hasYoutube && (
            <div className="mt-5 rounded-2xl border border-[#EFA9C2] bg-white/95 p-4">
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FCE4EC] text-[#9E3C65]">
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h2 className="text-sm font-bold text-[#513B48]">
                    Official YouTube Player — {currentTrack?.title}
                  </h2>
                </div>

                {currentTrack?.youtubeUrl && (
                  <a
                    href={currentTrack.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#EFA9C2] bg-[#FCE4EC]/75 px-3 py-1 text-xs font-semibold text-[#9E3C65] transition-colors hover:bg-[#F8C8DC]"
                  >
                    <span>Open on YouTube</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>

              <div className="mb-3 flex items-start gap-2 rounded-xl border border-[#F8C8DC] bg-[#FFF8F3] px-3 py-2 text-xs leading-relaxed text-[#6F5564]">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#9E3C65]"
                  aria-hidden="true"
                />
                <p>
                  Official release by{' '}
                  <strong className="text-[#513B48]">
                    {currentTrack?.artist || 'the official artist'}
                  </strong>{' '}
                  on YouTube. Use the pink Turntable controls above to keep it
                  playing smoothly as you explore other birthday pages, or press{' '}
                  <strong className="text-[#513B48]">Play</strong> directly in
                  the player below.
                </p>
              </div>

              {youtubeState !== 'fallback' ? (
                <div className="relative min-h-[180px] w-full overflow-hidden rounded-xl border border-[#F8C8DC] bg-[#FCE4EC]/45">
                  {youtubeState === 'loading' && (
                    <div
                      role="status"
                      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center"
                    >
                      <PlayCircle
                        className="h-5 w-5 animate-pulse text-[#9E3C65]"
                        aria-hidden="true"
                      />
                      <p className="text-xs font-semibold text-[#513B48]">
                        Loading official YouTube player for {currentTrack?.title}…
                      </p>
                    </div>
                  )}
                  <div ref={youtubeHostRef} className="min-h-[180px] w-full" />
                </div>
              ) : (
                currentTrack?.youtubeEmbedUrl && (
                  <iframe
                    title={`Official YouTube player for ${currentTrack.title}`}
                    src={currentTrack.youtubeEmbedUrl}
                    width="100%"
                    height="180"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="rounded-xl border-0"
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#6F5564]">
            Music keeps playing gently as you explore the rest of your universe ✨
          </p>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#9E3C65] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#843054]"
          >
            <span>Open Memories Scrapbook</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
