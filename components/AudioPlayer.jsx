"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { getDisplayName } from "../lib/anonymizeNames";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

export default function AudioPlayer({ memory, entered, ducked }) {
  const audioRef = useRef(null);
  const preferredVolume = useRef(0.72);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.72);
  const song = memory?.song || "";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = ducked ? Math.min(preferredVolume.current, 0.16) : preferredVolume.current;
  }, [ducked]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !entered || !song) return;

    audio.play().catch(() => setPlaying(false));
  }, [entered, song]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || !song) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
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

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <aside className={`audio-player ${entered ? "audio-visible" : ""}`} aria-label="site audio player">
      <audio
        ref={audioRef}
        src={song || undefined}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />
      <button
        type="button"
        className="audio-control"
        onClick={toggle}
        disabled={!song}
        aria-label={playing ? "pause music" : "play music"}
      >
        {playing ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
      </button>
      <div className="audio-track">
        <span className="audio-kicker">now playing</span>
        <span>{song ? getDisplayName(memory.person) : "audio awaiting archive"}</span>
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
}

