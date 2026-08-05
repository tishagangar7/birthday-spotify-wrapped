"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CharacterStage from "./CharacterStage";
import CarouselControls from "./CarouselControls";

const ROTATE_MS = 600;
const SWIPE_THRESHOLD = 42;

/**
 * Circular-stage carousel: center + left/right silhouettes.
 * Handles arrows, swipe, and keyboard left/right. Loops infinitely.
 */
export default function CharacterCarousel({
  archetypes,
  index,
  onIndexChange,
  onSelect,
  locked = false,
  confirming = false,
  keyboardActive = false,
}) {
  const reduceMotion = useReducedMotion();
  const [rotating, setRotating] = useState(false);
  const rotateTimer = useRef(null);
  const touchX = useRef(null);
  const total = archetypes.length;
  const busy = locked || confirming || rotating;

  useEffect(() => {
    return () => {
      if (rotateTimer.current) clearTimeout(rotateTimer.current);
    };
  }, []);

  const preloadAdjacent = useCallback(
    (active) => {
      [-1, 0, 1].forEach((rel) => {
        const arch = archetypes[(active + rel + total) % total];
        const src = arch?.image || arch?.sprite;
        if (!src) return;
        const img = new Image();
        img.src = src;
      });
    },
    [archetypes, total]
  );

  useEffect(() => {
    preloadAdjacent(index);
  }, [index, preloadAdjacent]);

  const rotate = useCallback(
    (dir) => {
      if (busy || total < 2) return;
      setRotating(true);
      onIndexChange((index + dir + total) % total);
      if (rotateTimer.current) clearTimeout(rotateTimer.current);
      rotateTimer.current = setTimeout(
        () => setRotating(false),
        reduceMotion ? 180 : ROTATE_MS
      );
    },
    [busy, total, index, onIndexChange, reduceMotion]
  );

  const goPrev = useCallback(() => rotate(-1), [rotate]);
  const goNext = useCallback(() => rotate(1), [rotate]);

  useEffect(() => {
    if (!keyboardActive || confirming) return undefined;

    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopImmediatePropagation();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopImmediatePropagation();
        goPrev();
      } else if (e.key === "Enter") {
        e.preventDefault();
        e.stopImmediatePropagation();
        onSelect?.();
      }
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [keyboardActive, confirming, goNext, goPrev, onSelect]);

  function onTouchStart(e) {
    touchX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const x = e.changedTouches[0]?.clientX;
    if (x == null) {
      touchX.current = null;
      return;
    }
    const dx = x - touchX.current;
    touchX.current = null;
    if (dx < -SWIPE_THRESHOLD) goNext();
    else if (dx > SWIPE_THRESHOLD) goPrev();
  }

  const active = archetypes[index];

  return (
    <div
      className="which-ali-carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <CarouselControls onPrev={goPrev} onNext={goNext} disabled={busy} />

      <CharacterStage
        archetypes={archetypes}
        activeIndex={index}
        confirming={confirming}
        rotating={rotating}
      />

      <AnimatePresence mode="wait">
        <motion.p
          key={active?.id ?? "name"}
          className="which-ali-fighter-name"
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
        >
          {active?.name}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
