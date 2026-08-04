"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { predictionsChapter as data } from "../../data/interactiveChapters";

/** Interactive predictions desk — lock in each forecast. */
export default function PredictionsChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [sealed, setSealed] = useState(() => ({}));
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);

  const item = data.predictions[index];
  const sealedCount = Object.keys(sealed).length;
  const allSealed = sealedCount >= data.predictions.length;

  const sealCurrent = useCallback(() => {
    if (done || !item) return;
    if (!sealed[item.id]) {
      setSealed((prev) => ({ ...prev, [item.id]: true }));
      return;
    }
    if (index < data.predictions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }
    setDone(true);
  }, [done, item, sealed, index]);

  useEffect(() => {
    if (allSealed && !done) {
      const id = window.setTimeout(() => setDone(true), reduceMotion ? 0 : 450);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [allSealed, done, reduceMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.4),
      { threshold: [0.3, 0.45] }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || done) return undefined;
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        e.stopImmediatePropagation();
        sealCurrent();
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setIndex((i) => i - 1);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, done, sealCurrent, index]);

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-limegreen story-no-nav predictions-desk-chapter"
      variant="rise"
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body flag-interactive-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>

        {!done ? (
          <>
            <p className="flag-interactive-progress" aria-live="polite">
              forecast {index + 1} / {data.predictions.length}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                className={`prediction-ticket${sealed[item.id] ? " is-sealed" : ""}`}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
              >
                <p className="prediction-ticket-odds">{item.odds}</p>
                <p className="prediction-ticket-text">{item.text}</p>
                {sealed[item.id] ? (
                  <span className="prediction-seal" aria-hidden="true">
                    {data.sealedLabel}
                  </span>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="prediction-dots" aria-hidden="true">
              {data.predictions.map((p, i) => (
                <span
                  key={p.id}
                  className={`prediction-dot${sealed[p.id] ? " is-sealed" : ""}${i === index ? " is-current" : ""}`}
                />
              ))}
            </div>

            <WrappedButton
              variant="primary"
              onClick={sealCurrent}
              ariaLabel={sealed[item.id] ? "Next forecast" : data.sealLabel}
            >
              {sealed[item.id]
                ? index < data.predictions.length - 1
                  ? "next forecast"
                  : data.doneLabel
                : data.sealLabel}
            </WrappedButton>
          </>
        ) : (
          <div className="flag-interactive-done" aria-live="polite">
            <p className="flag-done-title">{data.doneLabel}</p>
            <ul className="flag-done-list prediction-done-list">
              {data.predictions.map((p) => (
                <li key={p.id}>
                  <span className="prediction-done-odds">{p.odds}</span>
                  {p.text}
                </li>
              ))}
            </ul>
            <p className="wrapped-caption">{data.closing}</p>
          </div>
        )}
      </div>
    </SectionTransition>
  );
}
