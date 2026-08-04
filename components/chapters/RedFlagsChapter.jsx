"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { redFlagsChapter as data } from "../../data/interactiveChapters";

/** Interactive red-flag tribunal — stamp each exhibit one at a time. */
export default function RedFlagsChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [stamped, setStamped] = useState(false);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);

  const flag = data.flags[index];
  const atEnd = index >= data.flags.length - 1;

  const sustain = useCallback(() => {
    if (done) return;
    if (!stamped) {
      setStamped(true);
      return;
    }
    if (atEnd) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setStamped(false);
  }, [done, stamped, atEnd]);

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
        sustain();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, done, sustain]);

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-orange story-no-nav flag-tribunal-chapter"
      variant="rise"
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body flag-interactive-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>

        {!done ? (
          <>
            <p className="flag-interactive-progress" aria-live="polite">
              exhibit {index + 1} / {data.flags.length}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={flag.id}
                className={`flag-exhibit${stamped ? " is-stamped" : ""}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <p className="flag-exhibit-label">red flag</p>
                <p className="flag-exhibit-flag">{flag.flag}</p>
                <p className="flag-exhibit-context">{flag.context}</p>
                {stamped ? (
                  <>
                    <span className="flag-stamp flag-stamp--red" aria-hidden="true">
                      sustained
                    </span>
                    <p className="flag-exhibit-verdict">{flag.verdict}</p>
                  </>
                ) : null}
              </motion.div>
            </AnimatePresence>
            <WrappedButton
              variant="primary"
              onClick={sustain}
              ariaLabel={stamped ? (atEnd ? data.doneLabel : "next exhibit") : data.stampLabel}
            >
              {stamped ? (atEnd ? data.doneLabel : "next exhibit") : data.stampLabel}
            </WrappedButton>
          </>
        ) : (
          <div className="flag-interactive-done" aria-live="polite">
            <p className="flag-done-title">{data.doneLabel}</p>
            <p className="wrapped-caption">{data.closing}</p>
            <ul className="flag-done-list">
              {data.flags.map((f) => (
                <li key={f.id}>{f.flag}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionTransition>
  );
}
