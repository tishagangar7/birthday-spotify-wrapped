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

const FALLBACK_SETS = [fallbackPhotos];

/** Straight glow-up line — hover enlarges; click features a large hero.
 *  Multiple sets of ~17 photos; prev/next set arrows between batches. */
export default function GlowUpTimelineChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const pauseUntilRef = useRef(0);

  const [sets, setSets] = useState(FALLBACK_SETS);
  const [setIndex, setSetIndex] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [featured, setFeatured] = useState(0);
  const [visible, setVisible] = useState(false);

  const photos = sets[setIndex] ?? [];
  const count = photos.length;
  const featuredSrc = photos[featured] ?? photos[0];
  const setCount = sets.length;
  const canPrevSet = setIndex > 0;
  const canNextSet = setIndex < setCount - 1;
  const atLastPhoto = count > 0 && featured >= count - 1;
  const atFirstPhoto = featured <= 0;

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

  const goToPhoto = useCallback(
    (next, { user = false } = {}) => {
      if (!count) return;
      if (user) bumpPause();
      setFeatured(Math.max(0, Math.min(count - 1, next)));
    },
    [count, bumpPause]
  );

  const goPrevSet = useCallback(() => {
    if (!canPrevSet) return;
    bumpPause();
    setSetIndex((i) => i - 1);
    setFeatured(0);
    setHovered(null);
  }, [canPrevSet, bumpPause]);

  const goNextSet = useCallback(() => {
    if (!canNextSet) return;
    bumpPause();
    setSetIndex((i) => i + 1);
    setFeatured(0);
    setHovered(null);
  }, [canNextSet, bumpPause]);

  const goPrev = useCallback(() => {
    if (!atFirstPhoto) {
      goToPhoto(featured - 1, { user: true });
      return;
    }
    if (canPrevSet) {
      bumpPause();
      setSetIndex((i) => i - 1);
      setFeatured((sets[setIndex - 1]?.length ?? 1) - 1);
      setHovered(null);
    }
  }, [atFirstPhoto, featured, goToPhoto, canPrevSet, bumpPause, sets, setIndex]);

  const goNext = useCallback(() => {
    if (!atLastPhoto) {
      goToPhoto(featured + 1, { user: true });
      return;
    }
    goNextSet();
  }, [atLastPhoto, featured, goToPhoto, goNextSet]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/glowup")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        const nextSets =
          Array.isArray(data?.sets) && data.sets.length
            ? data.sets.filter((s) => Array.isArray(s) && s.length)
            : data?.photos?.length
              ? [data.photos]
              : null;
        if (!nextSets?.length) return;
        setSets(nextSets);
        setSetIndex(0);
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
      setFeatured((i) => (i < count - 1 ? i + 1 : i));
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [visible, reduceMotion, count, setIndex]);

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card timeline-chapter glowup-chapter wrapped-accent-teal story-no-nav"
      variant="fade"
    >
      <header className="glowup-header">
        <span className="wrapped-kicker">timeline</span>
        <p className="glowup-hint">
          hover to peek · click to feature
          {setCount > 1 ? (
            <span className="glowup-set-label">
              {" "}
              · set {setIndex + 1} / {setCount}
            </span>
          ) : null}
        </p>
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
          aria-label={atFirstPhoto && canPrevSet ? "Previous photo set" : "Previous photo"}
          onClick={goPrev}
          disabled={atFirstPhoto && !canPrevSet}
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
          aria-label={atLastPhoto && canNextSet ? "Next photo set" : "Next photo"}
          onClick={goNext}
          disabled={atLastPhoto && !canNextSet}
        >
          <ChevronRight size={22} strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>

      {setCount > 1 ? (
        <div className="glowup-set-nav">
          <button
            type="button"
            className="glowup-set-btn"
            onClick={goPrevSet}
            disabled={!canPrevSet}
            aria-label="Previous timeline set"
          >
            <ChevronLeft size={18} strokeWidth={2.25} aria-hidden="true" />
            prev
          </button>
          <span className="glowup-set-count">
            {setIndex + 1} / {setCount}
          </span>
          <button
            type="button"
            className="glowup-set-btn"
            onClick={goNextSet}
            disabled={!canNextSet}
            aria-label="Next timeline set"
          >
            next
            <ChevronRight size={18} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="glowup-line-wrap" onPointerDown={bumpPause}>
        <div className="glowup-line" aria-hidden="true" />

        <div className="glowup-rail" role="list" aria-label={`Glow up timeline set ${setIndex + 1}`}>
          {railPhotos.map((src, railIndex) => {
            const index = windowStart + railIndex;
            const isHovered = hovered === index;
            const isHero = featured === index;
            return (
              <button
                key={`${setIndex}-${src}`}
                type="button"
                role="listitem"
                className={`glowup-thumb${isHovered ? " is-hover" : ""}${isHero ? " is-hero" : ""}`}
                aria-label={`Feature photo ${index + 1} of ${count}`}
                aria-pressed={isHero}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                onClick={() => goToPhoto(index, { user: true })}
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
