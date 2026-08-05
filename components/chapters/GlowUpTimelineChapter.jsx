"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { glowUpPhotos as fallbackPhotos } from "../../data/wrappedChapters";

const AUTO_MS = 2800;
/** Same visible count as the original strip — layout/spacing stay identical. */
const VISIBLE_SLOTS = 17;

/** Straight glow-up line — hover enlarges; click features a large hero. */
export default function GlowUpTimelineChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const pauseUntilRef = useRef(0);

  const [photos, setPhotos] = useState(fallbackPhotos);
  const [hovered, setHovered] = useState(null);
  const [featured, setFeatured] = useState(0);
  const [visible, setVisible] = useState(false);

  const count = photos.length;
  const featuredSrc = photos[featured] ?? photos[0];

  // Fixed-width window: as you advance past the end, left drops off and a new
  // photo enters on the right — same size/spacing as the original 17-up strip.
  const windowStart = useMemo(() => {
    if (count <= VISIBLE_SLOTS) return 0;
    return Math.max(0, Math.min(featured - VISIBLE_SLOTS + 1, count - VISIBLE_SLOTS));
  }, [count, featured]);

  const railPhotos = useMemo(
    () => photos.slice(windowStart, windowStart + Math.min(VISIBLE_SLOTS, count)),
    [photos, windowStart, count]
  );

  const bumpPause = useCallback(() => {
    pauseUntilRef.current = Date.now() + AUTO_MS * 1.5;
  }, []);

  const goTo = useCallback(
    (next, { user = false } = {}) => {
      if (!count) return;
      if (user) bumpPause();
      setFeatured(((next % count) + count) % count);
    },
    [count, bumpPause]
  );

  const goPrev = useCallback(() => goTo(featured - 1, { user: true }), [featured, goTo]);
  const goNext = useCallback(() => goTo(featured + 1, { user: true }), [featured, goTo]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/glowup")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.photos?.length) return;
        setPhotos(data.photos);
        setFeatured(0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.4),
      { threshold: [0.35, 0.5, 0.7] }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduceMotion || count < 2) return undefined;
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setFeatured((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [visible, reduceMotion, count]);

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card timeline-chapter glowup-chapter wrapped-accent-teal story-no-nav"
      variant="fade"
    >
      <header className="glowup-header">
        <span className="wrapped-kicker">timeline</span>
        <p className="glowup-hint">hover to peek · click to feature</p>
      </header>

      <div
        className="glowup-hero-stage"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goPrev();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            goNext();
          }
        }}
      >
        <button
          type="button"
          className="glowup-hero-nav glowup-hero-nav--prev"
          aria-label="Previous photo"
          onClick={goPrev}
        >
          <ChevronLeft size={22} strokeWidth={2.25} aria-hidden="true" />
        </button>

        <div className="glowup-hero" aria-live="polite">
          {featuredSrc ? (
            <Image
              key={featuredSrc}
              src={featuredSrc}
              alt=""
              fill
              sizes="(max-width: 768px) 90vw, 380px"
              className="glowup-hero-image"
              priority
            />
          ) : null}
        </div>

        <button
          type="button"
          className="glowup-hero-nav glowup-hero-nav--next"
          aria-label="Next photo"
          onClick={goNext}
        >
          <ChevronRight size={22} strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>

      <div className="glowup-line-wrap" onPointerDown={bumpPause}>
        <div className="glowup-line" aria-hidden="true" />

        <div className="glowup-rail" role="list" aria-label="Glow up timeline">
          {railPhotos.map((src, railIndex) => {
            const index = windowStart + railIndex;
            const isHovered = hovered === index;
            const isHero = featured === index;
            return (
              <button
                key={src}
                type="button"
                role="listitem"
                className={`glowup-thumb${isHovered ? " is-hover" : ""}${isHero ? " is-hero" : ""}`}
                aria-label={`Feature photo ${index + 1} of ${count}`}
                aria-pressed={isHero}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                onClick={() => goTo(index, { user: true })}
              >
                <span className="glowup-dot" aria-hidden="true" />
                <span className="glowup-frame">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 18vw, 120px"
                    className="glowup-thumb-image"
                    priority={railIndex < 4}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </SectionTransition>
  );
}
