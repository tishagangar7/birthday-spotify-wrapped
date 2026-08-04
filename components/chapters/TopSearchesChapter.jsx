"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { topSearches } from "../../data/wrappedChapters";
import { topSearchesChapter as meta } from "../../data/interactiveChapters";

/**
 * Enhanced top-searches: fake query bar, then staggered “results.”
 */
export default function TopSearchesChapter() {
  const reduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timers = [];

    const run = () => {
      if (cancelled) return;

      if (reduceMotion) {
        setTyped(meta.queryPlaceholder);
        setVisibleCount(topSearches.length);
        return;
      }

      let i = 0;
      const text = meta.queryPlaceholder;
      const typeId = window.setInterval(() => {
        if (cancelled) return;
        i += 1;
        setTyped(text.slice(0, i));
        if (i >= text.length) window.clearInterval(typeId);
      }, 28);
      timers.push(typeId);

      topSearches.forEach((_, index) => {
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) setVisibleCount(index + 1);
          }, 700 + index * 380)
        );
      });
    };

    // Defer so we never sync-set inside the effect body (React 19 lint).
    timers.push(window.setTimeout(run, 0));

    return () => {
      cancelled = true;
      timers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
    };
  }, [reduceMotion]);

  return (
    <SectionTransition className="wrapped-card wrapped-accent-pink top-searches-chapter" variant="fade">
      <span className="wrapped-kicker">{meta.kicker}</span>
      <div className="wrapped-body">
        <p className="wrapped-order-heading">{meta.headline}</p>

        <div className="top-searches-bar" aria-hidden="true">
          <span className="top-searches-bar-icon" />
          <span className="top-searches-bar-text">
            {typed}
            <span className="top-searches-caret" />
          </span>
        </div>

        <ol className="wrapped-order-list top-searches-list">
          {topSearches.map((query, index) => (
            <li
              key={query}
              className={`wrapped-order-item${index < visibleCount ? " is-shown" : " is-pending"}`}
            >
              <span className="wrapped-order-scoop" aria-hidden="true" />
              <span className="wrapped-order-text">
                <span className="wrapped-order-label">“{query}”</span>
              </span>
            </li>
          ))}
        </ol>

        {visibleCount >= topSearches.length ? (
          <p className="wrapped-caption wrapped-order-total">{meta.footer}</p>
        ) : null}
      </div>
    </SectionTransition>
  );
}
