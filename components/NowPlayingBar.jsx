"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getAlbumAudio, playAlbumSong } from "../lib/albumAudio";

const SKIP_SECONDS = 10;
const AUTOPLAY_KEY = "albumAutoplaySrc";

const parseDuration = (value) => {
  const [minutes, seconds] = String(value || "3:30").split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
};

const formatTime = (totalSeconds) => {
  const safe = Math.max(0, totalSeconds || 0);
  const minutes = Math.floor(safe / 60);
  const seconds = String(Math.floor(safe % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

/**
 * Now-playing card. When `src` is provided, plays real audio with play/pause,
 * ±10s skip, and a seekable progress bar. Uses the shared album audio element
 * so a tracklist click can start playback before navigating here.
 */
export default function NowPlayingBar({ trackTitle, duration = "3:30", src = "", autoPlay = false }) {
  const reduceMotion = useReducedMotion();
  const barRef = useRef(null);
  const fallbackSeconds = useMemo(() => parseDuration(duration), [duration]);
  const [progress, setProgress] = useState(src ? 0 : 0.32);
  const [elapsed, setElapsed] = useState(0);
  const [total, setTotal] = useState(fallbackSeconds);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (src) return undefined;
    if (reduceMotion) return undefined;
    const id = setInterval(() => {
      setProgress((value) => (value >= 0.9 ? 0.15 : value + 0.01));
    }, 350);
    return () => clearInterval(id);
  }, [reduceMotion, src]);

  useEffect(() => {
    if (!src) return undefined;
    const audio = getAlbumAudio();
    if (!audio) return undefined;

    const absolute = new URL(src, window.location.origin).href;
    if (audio.dataset.trackSrc !== src) {
      audio.dataset.trackSrc = src;
      audio.src = absolute;
      setProgress(0);
      setElapsed(0);
    }

    setPlaying(!audio.paused);
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setTotal(audio.duration);
      setElapsed(audio.currentTime || 0);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    }

    const onTime = () => {
      const dur = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallbackSeconds;
      setTotal(dur);
      setElapsed(audio.currentTime || 0);
      setProgress(dur ? audio.currentTime / dur : 0);
    };
    const onMeta = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setTotal(audio.duration);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setElapsed(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    let wantAutoplay = autoPlay;
    try {
      if (sessionStorage.getItem(AUTOPLAY_KEY) === src) {
        wantAutoplay = true;
        sessionStorage.removeItem(AUTOPLAY_KEY);
      }
    } catch {
      /* ignore */
    }

    if (wantAutoplay && audio.paused) {
      playAlbumSong(src).catch(() => {});
    }

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src, fallbackSeconds, autoPlay]);

  const togglePlay = async () => {
    const audio = getAlbumAudio();
    if (!audio || !src) return;
    if (audio.paused) {
      await playAlbumSong(src);
    } else {
      audio.pause();
    }
  };

  const skipBy = (delta) => {
    const audio = getAlbumAudio();
    if (!audio || !src) return;
    const dur = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : total;
    audio.currentTime = Math.min(Math.max(0, (audio.currentTime || 0) + delta), dur || 0);
  };

  const seekTo = (clientX) => {
    const audio = getAlbumAudio();
    const bar = barRef.current;
    if (!audio || !bar || !src) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const dur = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : total;
    audio.currentTime = ratio * dur;
  };

  const displayDuration = src ? formatTime(total) : duration;
  const displayElapsed = src ? formatTime(elapsed) : formatTime(progress * fallbackSeconds);

  return (
    <div className="now-playing">
      <div className="now-playing-kicker-row">
        <span className={`now-playing-dot${playing ? " is-playing" : ""}`} />
        <span className="now-playing-kicker">now playing</span>
      </div>
      <p className="now-playing-title">{trackTitle}</p>

      <div
        ref={barRef}
        className={`now-playing-bar${src ? " is-seekable" : ""}`}
        role={src ? "slider" : undefined}
        aria-label={src ? "Seek" : undefined}
        aria-valuemin={src ? 0 : undefined}
        aria-valuemax={src ? Math.floor(total) : undefined}
        aria-valuenow={src ? Math.floor(elapsed) : undefined}
        tabIndex={src ? 0 : undefined}
        onClick={src ? (event) => seekTo(event.clientX) : undefined}
        onKeyDown={
          src
            ? (event) => {
                if (event.key === "ArrowRight") skipBy(SKIP_SECONDS);
                if (event.key === "ArrowLeft") skipBy(-SKIP_SECONDS);
              }
            : undefined
        }
      >
        <motion.div
          className="now-playing-fill"
          animate={{ width: `${Math.min(progress, 1) * 100}%` }}
          transition={{ duration: reduceMotion || src ? 0.12 : 0.35, ease: "linear" }}
        />
      </div>
      <div className="now-playing-times">
        <span>{displayElapsed}</span>
        <span>{displayDuration}</span>
      </div>

      {src ? (
        <div className="now-playing-controls">
          <button
            type="button"
            className="now-playing-control"
            onClick={() => skipBy(-SKIP_SECONDS)}
            aria-label={`Skip back ${SKIP_SECONDS} seconds`}
          >
            <RotateCcw size={20} strokeWidth={2.2} />
            <span className="now-playing-skip-label">10</span>
          </button>
          <button
            type="button"
            className="now-playing-control now-playing-play"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={26} fill="currentColor" strokeWidth={0} /> : <Play size={26} fill="currentColor" strokeWidth={0} />}
          </button>
          <button
            type="button"
            className="now-playing-control"
            onClick={() => skipBy(SKIP_SECONDS)}
            aria-label={`Skip forward ${SKIP_SECONDS} seconds`}
          >
            <RotateCw size={20} strokeWidth={2.2} />
            <span className="now-playing-skip-label">10</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export { AUTOPLAY_KEY };
