"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const parseDuration = (value) => {
  const [minutes, seconds] = String(value || "3:30").split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
};

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

/**
 * Stylish "now playing" treatment with a fake, looping progress bar — no real
 * audio asset exists for these tracks (see data/tracklist.js), so this is purely
 * a UI flourish rather than an actual player. Respects prefers-reduced-motion by
 * freezing the bar instead of animating it. Matches the Figma "Now Playing"
 * card (fileKey 3MPOLutTIDGqGWxnl7V7Db, Friend Detail template).
 */
export default function NowPlayingBar({ trackTitle, duration = "3:30" }) {
  const reduceMotion = useReducedMotion();
  const totalSeconds = useMemo(() => parseDuration(duration), [duration]);
  const [progress, setProgress] = useState(0.32);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = setInterval(() => {
      setProgress((value) => (value >= 0.9 ? 0.15 : value + 0.01));
    }, 350);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="now-playing">
      <div className="now-playing-kicker-row">
        <span className="now-playing-dot" />
        <span className="now-playing-kicker">now playing</span>
      </div>
      <p className="now-playing-title">{trackTitle}</p>
      <div className="now-playing-bar">
        <motion.div
          className="now-playing-fill"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: "linear" }}
        />
      </div>
      <div className="now-playing-times">
        <span>{formatTime(progress * totalSeconds)}</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}
