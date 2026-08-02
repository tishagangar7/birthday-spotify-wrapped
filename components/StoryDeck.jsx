"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { StoryDeckContext } from "./StoryDeckContext";

const TAP_MOVE_TOLERANCE = 10;
const SWIPE_DISTANCE_THRESHOLD = 44;
const TAP_MAX_DURATION_MS = 500;

const isInteractiveTarget = (el) =>
  !!el.closest?.('button, a, input, textarea, select, [role="button"], .story-no-nav');

/**
 * Full-screen "Wrapped"-style story deck: one card fills the viewport at a time,
 * advanced via tap zones (left third = back, rest = forward), horizontal swipe,
 * arrow keys, or the progress bar segments — mirroring Spotify Wrapped / IG Stories.
 *
 * `cards` is an array of `{ id, content }`. Only the current card is mounted, so
 * each card's own entrance animation (see SectionTransition) replays every time
 * it becomes active — no scroll-linked logic needed anywhere downstream.
 */
export default function StoryDeck({ cards, onIndexChange, className = "" }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const total = cards.length;
  const pointerRef = useRef(null);

  const goTo = useCallback(
    (nextIndex) => {
      setIndex((current) => {
        const clamped = Math.max(0, Math.min(total - 1, nextIndex));
        if (clamped === current) return current;
        setDirection(clamped > current ? 1 : -1);
        return clamped;
      });
    },
    [total]
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  const goToId = useCallback(
    (id) => {
      const targetIndex = cards.findIndex((card) => card.id === id);
      if (targetIndex >= 0) goTo(targetIndex);
    },
    [cards, goTo]
  );

  const navContextValue = useMemo(() => ({ goTo, goToId, index }), [goTo, goToId, index]);

  useEffect(() => {
    onIndexChange?.(index, cards[index]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const handlePointerDown = (event) => {
    if (isInteractiveTarget(event.target)) {
      pointerRef.current = null;
      return;
    }
    pointerRef.current = { x: event.clientX, y: event.clientY, t: Date.now() };
  };

  const handlePointerUp = (event) => {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const dt = Date.now() - start.t;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > SWIPE_DISTANCE_THRESHOLD && absDx > absDy * 1.15) {
      if (dx < 0) goNext();
      else goPrev();
      return;
    }

    if (absDx < TAP_MOVE_TOLERANCE && absDy < TAP_MOVE_TOLERANCE && dt < TAP_MAX_DURATION_MS) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      if (x < rect.width * 0.3) goPrev();
      else goNext();
    }
  };

  const variants = {
    enter: (dir) => (reduceMotion ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? 56 : -56 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => (reduceMotion ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? -56 : 56 }),
  };

  const current = cards[index];
  if (!current) return null;

  return (
    <StoryDeckContext.Provider value={navContextValue}>
    <div className={`story-deck ${className}`}>
      <div className="story-progress" role="tablist" aria-label="story progress">
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`go to card ${i + 1} of ${total}`}
            className={`story-progress-seg ${i <= index ? "is-filled" : ""} ${i === index ? "is-current" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div
        className="story-stage"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={current.id}
            className="story-slide"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {current.content}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        className="story-nav story-nav-prev"
        onClick={goPrev}
        aria-label="previous card"
        disabled={index === 0}
      >
        ‹
      </button>
      <button
        type="button"
        className="story-nav story-nav-next"
        onClick={goNext}
        aria-label="next card"
        disabled={index === total - 1}
      >
        ›
      </button>

      <span className="story-position" aria-hidden="true">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
    </StoryDeckContext.Provider>
  );
}
