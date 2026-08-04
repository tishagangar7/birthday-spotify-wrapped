"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { milesChapter } from "../../data/wrappedChapters";

/** Funny slider — drag cartoon Ali across to unlock miles. */
export default function RunnerMilesChapter() {
  const reduceMotion = useReducedMotion();
  const finishingRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  function onSlide(e) {
    e.stopPropagation();
    if (finishingRef.current) return;

    const next = Number(e.target.value);
    setProgress(next);

    if (next >= 97) {
      finishingRef.current = true;
      setProgress(100);

      if (reduceMotion) {
        setFinished(true);
        return;
      }

      window.setTimeout(() => setFinished(true), 450);
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

              <div className="runner-stage">
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
              </div>

              <input
                className="runner-slider"
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={onSlide}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                aria-label="Drag Ali across the track"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionTransition>
  );
}
