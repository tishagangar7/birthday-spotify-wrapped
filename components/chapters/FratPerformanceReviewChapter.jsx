"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { fratReviewChapter as data } from "../../data/interactiveChapters";

const STAGE_COUNT = 4;

export default function FratPerformanceReviewChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const [stage, setStage] = useState(0);
  const [compIndex, setCompIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [punctualityClicks, setPunctualityClicks] = useState(0);
  const [punctualityEgg, setPunctualityEgg] = useState(false);

  const competencies = data.competencies;
  const shownComps = competencies.slice(0, Math.min(competencies.length, compIndex + 1));

  const advance = useCallback(() => {
    if (stage === 1 && compIndex < competencies.length - 1) {
      setCompIndex((i) => i + 1);
      return;
    }
    if (stage < STAGE_COUNT - 1) {
      setStage((s) => s + 1);
      return;
    }
  }, [stage, compIndex, competencies.length]);

  const back = useCallback(() => {
    if (stage === 1 && compIndex > 0) {
      setCompIndex((i) => i - 1);
      return;
    }
    if (stage > 0) {
      setStage((s) => s - 1);
    }
  }, [stage, compIndex]);

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
    if (!visible) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopImmediatePropagation();
        advance();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopImmediatePropagation();
        back();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, advance, back]);

  function onPunctualityClick(id) {
    if (id !== "punctuality" || stage !== 3) return;
    const next = punctualityClicks + 1;
    setPunctualityClicks(next);
    if (next >= 3) setPunctualityEgg(true);
  }

  const fade = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-orange story-no-nav frat-review-chapter"
      variant="rise"
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body frat-review-body">
        <header className="frat-review-header">
          <h2 className="lore-iceberg-headline frat-review-headline">{data.headline}</h2>
        </header>

        <AnimatePresence mode="wait">
          {stage === 0 ? (
            <motion.div key="record" className="frat-review-panel" {...fade} transition={{ duration: 0.35 }}>
              <dl className="frat-review-record">
                {[
                  ["Name", data.employee.name],
                  ["Frat", data.employee.frat],
                  ["Position", data.employee.position],
                  ["Dues", data.employee.dues],
                ].map(([label, value]) => (
                  <div key={label} className="frat-review-row">
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <WrappedButton variant="primary" onClick={advance} ariaLabel={data.beginLabel}>
                {data.beginLabel}
              </WrappedButton>
            </motion.div>
          ) : null}

          {stage === 1 ? (
            <motion.div key="comps" className="frat-review-panel" {...fade} transition={{ duration: 0.35 }}>
              <ul className="frat-comp-list" aria-live="polite">
                {shownComps.slice(-3).map((comp) => (
                  <li key={comp.id} className="frat-comp-card">
                    <div className="frat-comp-top">
                      <span className="frat-comp-title">{comp.title}</span>
                      <span className="frat-comp-score">
                        {comp.scoreLabel ?? `${comp.score} / ${data.maxScore}`}
                      </span>
                    </div>
                    <div
                      className="frat-comp-bars"
                      role="img"
                      aria-label={`Score ${comp.scoreLabel ?? `${comp.score} out of ${data.maxScore}`}`}
                    >
                      {Array.from({ length: data.maxScore }, (_, i) => (
                        <span
                          key={i}
                          className={`frat-comp-bar${i < comp.score ? " is-filled" : ""}`}
                        />
                      ))}
                    </div>
                    <p className="frat-comp-comment">{comp.comment}</p>
                  </li>
                ))}
              </ul>
              <WrappedButton
                variant="primary"
                onClick={advance}
                ariaLabel={compIndex < competencies.length - 1 ? "next competency" : "continue"}
              >
                {compIndex < competencies.length - 1 ? "next competency" : "continue review"}
              </WrappedButton>
            </motion.div>
          ) : null}

          {stage === 2 ? (
            <motion.div key="manager" className="frat-review-panel" {...fade} transition={{ duration: 0.35 }}>
              <p className="frat-manager-body">{data.managerFeedback.body}</p>
              <p className="frat-manager-improve">{data.managerFeedback.improvement}</p>
              <div className="frat-stamps">
                {data.stamps.map((stamp, i) => (
                  <span
                    key={stamp.id}
                    className={`frat-stamp${reduceMotion ? " is-static" : ""}`}
                    style={{ "--stamp-delay": `${0.15 + i * 0.2}s` }}
                  >
                    {stamp.label}
                  </span>
                ))}
              </div>
              <WrappedButton variant="primary" onClick={advance} ariaLabel="final rating">
                final rating
              </WrappedButton>
            </motion.div>
          ) : null}

          {stage === 3 ? (
            <motion.div key="final" className="frat-review-panel" {...fade} transition={{ duration: 0.4 }}>
              <p className="frat-final-label">{data.finalRating.label}</p>
              <p className="frat-final-value">{data.finalRating.value}</p>
              <p className="wrapped-caption frat-final-closing">{data.finalRating.closing}</p>
              <button
                type="button"
                className="frat-egg-target"
                onClick={() => onPunctualityClick("punctuality")}
                aria-label="Punctuality score easter egg"
              >
                {punctualityEgg ? data.punctualityEasterEgg : "1 / 5"}
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SectionTransition>
  );
}
