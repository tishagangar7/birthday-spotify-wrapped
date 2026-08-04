"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionTransition from "../SectionTransition";
import { glowUpPhotos } from "../../data/wrappedChapters";

/** Straight glow-up line — hover enlarges; click features a large hero. */
export default function GlowUpTimelineChapter() {
  const [hovered, setHovered] = useState(null);
  const [featured, setFeatured] = useState(0);
  const count = glowUpPhotos.length;
  const featuredSrc = glowUpPhotos[featured];

  const goPrev = () => setFeatured((i) => (i - 1 + count) % count);
  const goNext = () => setFeatured((i) => (i + 1) % count);

  return (
    <SectionTransition
      className="wrapped-card timeline-chapter glowup-chapter wrapped-accent-teal story-no-nav"
      variant="fade"
    >
      <header className="glowup-header">
        <span className="wrapped-kicker">stats · glow up</span>
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
          <Image
            src={featuredSrc}
            alt=""
            fill
            sizes="(max-width: 768px) 90vw, 380px"
            className="glowup-hero-image"
            priority
          />
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

      <div className="glowup-line-wrap">
        <div className="glowup-line" aria-hidden="true" />

        <div className="glowup-rail" role="list" aria-label="Glow up timeline">
          {glowUpPhotos.map((src, index) => {
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
                onClick={() => setFeatured(index)}
              >
                <span className="glowup-dot" aria-hidden="true" />
                <span className="glowup-frame">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 18vw, 120px"
                    className="glowup-thumb-image"
                    priority={index < 4}
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
