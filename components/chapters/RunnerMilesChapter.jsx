"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { milesChapter } from "../../data/wrappedChapters";

/** Funny slider — drag cartoon Ali across to unlock miles. */
export default function RunnerMilesChapter() {
  const reduceMotion = useReducedMotion();
  const finishingRef = useRef(false);
  const draggingRef = useRef(false);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  function finishRun() {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setProgress(100);

    if (reduceMotion) {
      setFinished(true);
      return;
    }

    window.setTimeout(() => setFinished(true), 450);
  }

  function progressFromClientX(clientX) {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    // Inset so start/finish feel reachable without hugging the edges.
    const inset = Math.min(28, rect.width * 0.06);
    const usable = Math.max(1, rect.width - inset * 2);
    const x = clientX - rect.left - inset;
    return Math.max(0, Math.min(100, (x / usable) * 100));
  }

  function applyProgress(next) {
    if (finishingRef.current) return;
    setProgress(next);
    if (next >= 96) finishRun();
  }

  function onPointerDown(e) {
    if (finishingRef.current) return;
    // Only primary button / touch / pen.
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    applyProgress(progressFromClientX(e.clientX));
  }

  function onPointerMove(e) {
    if (!draggingRef.current || finishingRef.current) return;
    e.preventDefault();
    applyProgress(progressFromClientX(e.clientX));
  }

  function onPointerUp(e) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  function onKeyDown(e) {
    if (finishingRef.current) return;
    const step = e.shiftKey ? 12 : 6;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      applyProgress(Math.min(100, progress + step));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      applyProgress(Math.max(0, progress - step));
    } else if (e.key === "Home") {
      e.preventDefault();
      applyProgress(0);
    } else if (e.key === "End") {
      e.preventDefault();
      finishRun();
    }
  }

  const milesLabel = milesChapter.miles.toLocaleString("en-US");
  const exitDuration = reduceMotion ? 0 : 0.55;
  const revealDuration = reduceMotion ? 0 : 1.5;

  return (
    <SectionTransition className="wrapped-card wrapped-accent-limegreen runner-miles-chapter" variant="rise">
      <span className="wrapped-kicker">stats · miles ran this year</span>
      <div className="wrapped-body">
        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="reveal"
              className="runner-reveal"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: revealDuration,
                ease: [0.22, 1, 0.36, 1],
                delay: reduceMotion ? 0 : 0.12,
              }}
            >
              <p className="wrapped-number runner-miles-stat">
                <span>{milesLabel}</span>
                <span className="runner-miles-unit">miles covered</span>
              </p>
              <motion.p
                className="wrapped-caption"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 1.35,
                  ease: "easeOut",
                  delay: reduceMotion ? 0 : 0.55,
                }}
              >
                {milesChapter.motivationalNote}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="drag"
              className="runner-drag"
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: exitDuration, ease: "easeOut" }}
            >
              <p className="wrapped-order-heading">drag him across</p>

              <div
                ref={trackRef}
                className="runner-stage"
                role="slider"
                tabIndex={0}
                aria-label="Drag Ali across the track"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onKeyDown={onKeyDown}
              >
                <div className="runner-track" aria-hidden>
                  <div className="runner-lanes" />
                  <span className="runner-start">start</span>
                  <div className="runner-finish">
                    <span className="runner-finish-flag" />
                    <span className="runner-finish-label">finish</span>
                  </div>
                </div>
                <span
                  className="runner-ali"
                  style={{ left: `calc(${progress}% - 3.5rem)` }}
                  aria-hidden
                >
                  <img
                    src="/photos/runner/ali-run-0.png?v=2"
                    alt=""
                    className="runner-ali-image"
                    width={140}
                    height={224}
                    draggable={false}
                  />
                </span>

                <div className="runner-scrub" aria-hidden>
                  <div className="runner-scrub-track">
                    <div
                      className="runner-scrub-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span
                    className="runner-scrub-thumb"
                    style={{ left: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionTransition>
  );
}
