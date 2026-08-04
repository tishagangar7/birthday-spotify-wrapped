"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { talkingChapter } from "../../data/wrappedChapters";

/** Let the short clip (~2.1s) play through before dissolving. */
const VIDEO_HOLD_MS = 2400;
/** Fade video out / stats in — keep in sync with CSS transition. */
const DISSOLVE_MS = 1300;

export default function TalkingMinutesChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const wasVisibleRef = useRef(false);
  const phaseRef = useRef("idle");
  const timersRef = useRef([]);
  /** idle → video → dissolving → stats */
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    function clearTimers() {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    }

    function setPhaseSafe(next) {
      phaseRef.current = next;
      setPhase(next);
    }

    function stopVideo() {
      const video = videoRef.current;
      if (!video) return;
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek before metadata */
      }
    }

    function playVideo() {
      const video = videoRef.current;
      if (!video) return;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.loop = true;
      const playPromise = video.play();
      if (playPromise?.catch) playPromise.catch(() => {});
    }

    function runSequence() {
      clearTimers();

      if (reduceMotion) {
        stopVideo();
        setPhaseSafe("stats");
        return;
      }

      setPhaseSafe("video");
      // Next paint so <video> is mounted before play().
      requestAnimationFrame(() => playVideo());

      const dissolveId = window.setTimeout(() => {
        setPhaseSafe("dissolving");
        const doneId = window.setTimeout(() => {
          stopVideo();
          setPhaseSafe("stats");
        }, DISSOLVE_MS);
        timersRef.current.push(doneId);
      }, VIDEO_HOLD_MS);

      timersRef.current.push(dissolveId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;

        if (visible) {
          if (!wasVisibleRef.current) {
            runSequence();
          }
          wasVisibleRef.current = true;
          return;
        }

        if (entry.intersectionRatio < 0.15) {
          wasVisibleRef.current = false;
          if (phaseRef.current === "video" || phaseRef.current === "dissolving") {
            clearTimers();
            stopVideo();
            setPhaseSafe("idle");
          }
          // Settled stats stay on screen; next full re-entry replays.
        }
      },
      { threshold: [0, 0.15, 0.35, 0.45, 0.6, 0.8] }
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      clearTimers();
      stopVideo();
    };
  }, [reduceMotion]);

  const showVideo = phase === "video" || phase === "dissolving";
  const statsVisible = phase === "dissolving" || phase === "stats";

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-pink talking-minutes-chapter"
      variant="rise"
    >
      <div className="talking-reveal" aria-live="polite">
        {showVideo ? (
          <div
            className={`talking-video-card${phase === "dissolving" ? " is-dissolving" : ""}`}
            aria-hidden="true"
          >
            <video
              ref={videoRef}
              className="talking-video-card-media"
              src={talkingChapter.video}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
            />
            <div className="talking-video-card-scrim" />
          </div>
        ) : null}

        <div
          className={`talking-stats${statsVisible ? " is-visible" : " is-hidden"}`}
        >
          <span className="wrapped-kicker">stats · talking</span>
          <p className="wrapped-number talking-stats-number">
            {talkingChapter.minutes.toLocaleString("en-US")}
          </p>
          <p className="wrapped-caption talking-stats-caption">
            {talkingChapter.comparison}
          </p>
        </div>
      </div>
    </SectionTransition>
  );
}
