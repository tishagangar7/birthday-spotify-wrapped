"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { StoryDeckContext } from "./StoryDeckContext";

/**
 * Vertical scroll-snap deck: every card is a fullscreen chapter.
 * Keeps StoryDeckContext (goTo / goToId / goNext / goPrev) so Chapter Menu
 * and CTA buttons still jump between pages.
 */
export default function ScrollDeck({ cards, onIndexChange, className = "" }) {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef(null);
  const sectionRefs = useRef({});
  const [index, setIndex] = useState(0);
  const [reloadKeys, setReloadKeys] = useState({});
  const total = cards.length;

  const scrollToIndex = useCallback(
    (nextIndex, behavior) => {
      const clamped = Math.max(0, Math.min(total - 1, nextIndex));
      const id = cards[clamped]?.id;
      const el = id ? sectionRefs.current[id] : null;
      if (!el) return;
      el.scrollIntoView({
        behavior: behavior ?? (reduceMotion ? "auto" : "smooth"),
        block: "start",
      });
    },
    [cards, reduceMotion, total]
  );

  const goTo = useCallback((nextIndex) => scrollToIndex(nextIndex), [scrollToIndex]);
  const goNext = useCallback(() => scrollToIndex(index + 1), [scrollToIndex, index]);
  const goPrev = useCallback(() => scrollToIndex(index - 1), [scrollToIndex, index]);

  const goToId = useCallback(
    (id) => {
      const targetIndex = cards.findIndex((card) => card.id === id);
      if (targetIndex >= 0) scrollToIndex(targetIndex);
    },
    [cards, scrollToIndex]
  );

  const reloadCurrent = useCallback(() => {
    const id = cards[index]?.id;
    if (!id) return;
    setReloadKeys((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, [cards, index]);

  const navContextValue = useMemo(
    () => ({ goTo, goToId, goNext, goPrev, index }),
    [goTo, goToId, goNext, goPrev, index]
  );

  useEffect(() => {
    onIndexChange?.(index, cards[index]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observers = cards.map((card, i) => {
      const el = sectionRefs.current[card.id];
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            setIndex(i);
          }
        },
        { root, threshold: [0.55, 0.75] }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, [cards]);

  useEffect(() => {
    const handleKey = (event) => {
      // Interactive chapters (story-no-nav) capture keys first; respect that.
      if (event.defaultPrevented) return;
      if (event.target?.closest?.(".story-no-nav, input, textarea, select, [contenteditable='true']")) {
        return;
      }
      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  if (!cards.length) return null;

  return (
    <StoryDeckContext.Provider value={navContextValue}>
      <div className={`scroll-deck ${reduceMotion ? "scroll-deck-reduced" : ""} ${className}`.trim()}>
        <div className="story-progress scroll-progress" role="tablist" aria-label="chapter progress">
          {cards.map((card, i) => (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`go to ${card.id}`}
              className={`story-progress-seg ${i <= index ? "is-filled" : ""} ${i === index ? "is-current" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="chapter-reload-btn"
          onClick={reloadCurrent}
          aria-label="Reload this chapter"
          title="Reload this chapter"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M12 5V2L7 7l5 5V9c2.76 0 5 2.24 5 5a5 5 0 0 1-9.9 1H5.08A7 7 0 0 0 19 14c0-3.87-3.13-7-7-7z"
            />
          </svg>
        </button>

        <div ref={scrollerRef} className="scroll-deck-scroller">
          {cards.map((card) => (
            <section
              key={card.id}
              id={card.id}
              ref={(node) => {
                if (node) sectionRefs.current[card.id] = node;
              }}
              className="scroll-chapter"
              data-chapter={card.id}
            >
              <div key={`${card.id}-${reloadKeys[card.id] ?? 0}`} className="scroll-chapter-inner">
                {card.content}
              </div>
            </section>
          ))}
        </div>

        <span className="story-position" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </StoryDeckContext.Provider>
  );
}
