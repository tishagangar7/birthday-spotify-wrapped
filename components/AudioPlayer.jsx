"use client";

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

/**
 * Fixed bottom player. Parent owns `track`; call ref.play() / ref.pause() from
 * click handlers so playback starts inside the user gesture (autoplay-safe).
 */
const AudioPlayer = forwardRef(function AudioPlayer(
  { track, playlist = [], entered, ducked, onSelectTrack, onPlayingChange },
  ref
) {
  const audioRef = useRef(null);
  const gesturePlayRef = useRef(false);
  const preferredVolume = useRef(0.72);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.72);

  const song = track?.src || "";
  const label = track ? `${track.title} — ${track.artist}` : "audio awaiting archive";

  const playable = playlist.filter((t) => t.src);
  const index = playable.findIndex((t) => t.src === song);
  const canPrev = index > 0;
  const canNext = index >= 0 && index < playable.length - 1;

  const setPlayingState = (next) => {
    setPlaying(next);
    onPlayingChange?.(next);
  };

  useImperativeHandle(ref, () => ({
    play: async (nextSrc) => {
      const audio = audioRef.current;
      if (!audio) return false;
      const target = nextSrc || song;
      if (!target) return false;
      const current = audio.dataset.trackSrc || "";
      gesturePlayRef.current = true;
      try {
        if (current !== target) {
          audio.dataset.trackSrc = target;
          audio.src = target;
        }
        await audio.play();
        return true;
      } catch {
        setPlayingState(false);
        return false;
      } finally {
        gesturePlayRef.current = false;
      }
    },
    pause: () => {
      audioRef.current?.pause();
    },
    get paused() {
      return Boolean(audioRef.current?.paused);
    },
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = ducked ? Math.min(preferredVolume.current, 0.16) : preferredVolume.current;
  }, [ducked]);

  // Sync element src when track changes from parent (prev/next, etc).
  // Skip reload if play() already set this src in the click gesture.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (gesturePlayRef.current) return;
    if (!song) {
      delete audio.dataset.trackSrc;
      audio.removeAttribute("src");
      audio.load();
      setElapsed(0);
      setDuration(0);
      setPlayingState(false);
      return;
    }
    if (audio.dataset.trackSrc === song) return;
    audio.dataset.trackSrc = song;
    audio.src = song;
    setElapsed(0);
    setDuration(0);
  }, [song]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || !song) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlayingState(false);
      }
    } else {
      audio.pause();
    }
  };

  const updateVolume = (event) => {
    const nextVolume = Number(event.target.value);
    preferredVolume.current = nextVolume;
    setVolume(nextVolume);
    if (audioRef.current) audioRef.current.volume = ducked ? Math.min(nextVolume, 0.16) : nextVolume;
  };

  const seek = (event) => {
    const nextTime = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
    setElapsed(nextTime);
  };

  const skip = (delta) => {
    if (index < 0 || !onSelectTrack) return;
    const next = playable[index + delta];
    if (next) onSelectTrack(next, { autoplay: true });
  };

  const onEnded = () => {
    if (canNext && onSelectTrack) {
      onSelectTrack(playable[index + 1], { autoplay: true });
      return;
    }
    setPlayingState(false);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <aside className={`audio-player ${entered ? "audio-visible" : ""}`} aria-label="site audio player">
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setPlayingState(true)}
        onPause={() => setPlayingState(false)}
        onEnded={onEnded}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />
      <div className="audio-controls">
        <button
          type="button"
          className="audio-control audio-skip"
          onClick={() => skip(-1)}
          disabled={!canPrev}
          aria-label="previous song"
        >
          <SkipBack size={12} fill="currentColor" />
        </button>
        <button
          type="button"
          className="audio-control"
          onClick={toggle}
          disabled={!song}
          aria-label={playing ? "pause music" : "play music"}
        >
          {playing ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
        </button>
        <button
          type="button"
          className="audio-control audio-skip"
          onClick={() => skip(1)}
          disabled={!canNext}
          aria-label="next song"
        >
          <SkipForward size={12} fill="currentColor" />
        </button>
      </div>
      <div className="audio-track">
        <span className="audio-kicker">now playing</span>
        <span>{label}</span>
      </div>
      <span className="audio-time">{formatTime(elapsed)}</span>
      <input
        className="audio-progress"
        type="range"
        min="0"
        max={duration || 1}
        step="0.1"
        value={Math.min(elapsed, duration || 1)}
        onChange={seek}
        disabled={!song}
        aria-label="audio progress"
      />
      <VolumeIcon size={13} className="volume-icon" />
      <input
        className="volume-range"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={updateVolume}
        aria-label="music volume"
      />
    </aside>
  );
});

export default AudioPlayer;
