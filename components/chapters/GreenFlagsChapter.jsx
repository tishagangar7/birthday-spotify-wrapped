"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { greenFlagsChapter as data } from "../../data/interactiveChapters";

/** Interactive green-flag clearing — flip each evidence card. */
export default function GreenFlagsChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const [flipped, setFlipped] = useState(() => ({}));
  const [visible, setVisible] = useState(false);
  const [cursor, setCursor] = useState(0);

  const allFlipped = data.flags.every((f) => flipped[f.id]);

  const flip = useCallback((id) => {
    setFlipped((prev) => ({ ...prev, [id]: true }));
  }, []);

  const flipCurrent = useCallback(() => {
    const current = data.flags[cursor];
    if (!current) return;
    if (!flipped[current.id]) {
      flip(current.id);
      return;
    }
    if (cursor < data.flags.length - 1) setCursor((c) => c + 1);
  }, [cursor, flipped, flip]);

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
    if (!visible || allFlipped) return undefined;
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        e.stopImmediatePropagation();
        flipCurrent();
      } else if (e.key === "ArrowLeft" && cursor > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setCursor((c) => c - 1);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, allFlipped, flipCurrent, cursor]);

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-green story-no-nav flag-clearing-chapter"
      variant="rise"
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body flag-interactive-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>
        <p className="flag-interactive-progress">{data.revealHint}</p>

        <ul className="green-flag-grid">
          {data.flags.map((item, i) => {
            const isOpen = !!flipped[item.id];
            const isCurrent = i === cursor;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`green-flag-card${isOpen ? " is-flipped" : ""}${isCurrent ? " is-current" : ""}${reduceMotion ? " is-reduced" : ""}`}
                  onClick={() => {
                    setCursor(i);
                    flip(item.id);
                  }}
                  aria-expanded={isOpen}
                  aria-label={isOpen ? item.flag : `Reveal: ${item.flag}`}
                >
                  <span className="green-flag-card-front">
                    <span className="green-flag-card-kicker">green flag</span>
                    <span className="green-flag-card-flag">{item.flag}</span>
                    <span className="green-flag-card-hint">tap</span>
                  </span>
                  <span className="green-flag-card-back">
                    <span className="green-flag-card-kicker">evidence</span>
                    <span className="green-flag-card-evidence">{item.evidence}</span>
                    <span className="green-flag-card-context">{item.context}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {allFlipped ? (
          <div className="flag-interactive-done" aria-live="polite">
            <p className="flag-done-title flag-done-title--green">{data.doneLabel}</p>
            <p className="wrapped-caption">{data.closing}</p>
          </div>
        ) : (
          <WrappedButton variant="primary" onClick={flipCurrent} ariaLabel="Reveal current flag">
            reveal next
          </WrappedButton>
        )}
      </div>
    </SectionTransition>
  );
}
