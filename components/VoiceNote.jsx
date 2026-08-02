"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const bars = [6, 12, 8, 18, 10, 24, 15, 9, 20, 28, 13, 18, 8, 22, 11, 16, 7, 19, 12, 6];

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

export default function VoiceNote({
  src = "/audio/voice-note-file.mp3",
  person = "tisha",
  onPlaybackChange,
}) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(18);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return () => onPlaybackChange?.(false);
  }, [onPlaybackChange]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

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

  return (
    <div className="voice-note">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => {
          setPlaying(true);
          onPlaybackChange?.(true);
        }}
        onPause={() => {
          setPlaying(false);
          onPlaybackChange?.(false);
        }}
        onEnded={() => {
          setPlaying(false);
          onPlaybackChange?.(false);
        }}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />
      <button type="button" className="voice-note-button" onClick={toggle} aria-label={playing ? "pause voice note" : "play voice note"}>
        {playing ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
      </button>
      <div className="voice-wave" aria-hidden="true">
        {bars.map((height, index) => (
          <motion.span
            key={`${height}-${index}`}
            style={{ height }}
            animate={playing && !reduceMotion ? { scaleY: [0.45, 1, 0.6] } : { scaleY: 0.7 }}
            transition={{ duration: 0.8, repeat: playing ? Infinity : 0, delay: index * 0.035 }}
          />
        ))}
      </div>
      <span className="voice-time">{formatTime(playing ? elapsed : duration)}</span>
      <span className="voice-label">voice note — {person}</span>
    </div>
  );
}

