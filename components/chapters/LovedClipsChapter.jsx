"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import SectionTransition from "../SectionTransition";
import { lovedClips } from "../../data/wrappedChapters";

/**
 * Horizontal “clips we love” filmstrip — center snap plays, sides dim.
 */
export default function LovedClipsChapter() {
  const reduceMotion = useReducedMotion();
  const chapterRef = useRef(null);
  const stripRef = useRef(null);
  const videoRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [chapterVisible, setChapterVisible] = useState(false);
  const [muted, setMuted] = useState(true);

  const updateActiveFromScroll = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const center = strip.scrollLeft + strip.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;

    const slides = strip.querySelectorAll("[data-clip-slide]");
    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });

    setActiveIndex((prev) => (prev === best ? prev : best));
  }, []);

  const scrollToIndex = useCallback(
    (index) => {
      const strip = stripRef.current;
      const slide = strip?.querySelector(`[data-clip-slide][data-index="${index}"]`);
      if (!strip || !slide) return;
      const left = slide.offsetLeft - (strip.clientWidth - slide.offsetWidth) / 2;
      strip.scrollTo({
        left: Math.max(0, left),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [reduceMotion]
  );

  useEffect(() => {
    const root = chapterRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setChapterVisible(entry.isIntersecting && entry.intersectionRatio >= 0.3);
      },
      { threshold: [0.2, 0.3, 0.5, 0.7] }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return undefined;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActiveFromScroll);
    };

    strip.addEventListener("scroll", onScroll, { passive: true });
    // Center dance (cover) on first paint
    requestAnimationFrame(() => {
      scrollToIndex(0);
      updateActiveFromScroll();
    });

    const onResize = () => updateActiveFromScroll();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      strip.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateActiveFromScroll, scrollToIndex]);

  useEffect(() => {
    lovedClips.forEach((clip, i) => {
      if (clip.type !== "video") return;
      const video = videoRefs.current[clip.id];
      if (!video) return;

      const shouldPlay = chapterVisible && i === activeIndex && !reduceMotion;
      if (!shouldPlay) {
        if (!video.paused) video.pause();
        return;
      }

      video.muted = muted;
      video.loop = true;
      video.playsInline = true;
      video.play().catch(() => {
        /* autoplay may need a tap — unmute control still works */
      });
    });
  }, [activeIndex, muted, reduceMotion, chapterVisible]);

  const handleMuteToggle = async () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    const clip = lovedClips[activeIndex];
    if (clip?.type !== "video") return;
    const video = videoRefs.current[clip.id];
    if (!video) return;
    video.muted = nextMuted;
    try {
      await video.play();
    } catch {
      /* ignore */
    }
  };

  const activeIsVideo = lovedClips[activeIndex]?.type === "video";

  return (
    <SectionTransition
      ref={chapterRef}
      className="wrapped-card wrapped-accent-teal loved-clips-chapter story-no-nav"
      variant="fade"
    >
      <span className="wrapped-kicker">stats · loved clips</span>
      <header className="loved-clips-header">
        <p className="loved-clips-heading">keep swiping</p>
        {activeIsVideo && !reduceMotion ? (
          <button
            type="button"
            className="loved-clips-mute"
            onClick={handleMuteToggle}
            aria-label={muted ? "Unmute clip" : "Mute clip"}
          >
            {muted ? (
              <>
                <Volume2 size={16} aria-hidden="true" />
                unmute
              </>
            ) : (
              <>
                <VolumeX size={16} aria-hidden="true" />
                mute
              </>
            )}
          </button>
        ) : null}
      </header>

      <div
        ref={stripRef}
        className="loved-clips-strip"
        role="region"
        aria-label="Loved clips filmstrip"
      >
        <div className="loved-clips-track">
          {lovedClips.map((clip, index) => {
            const isActive = index === activeIndex;
            return (
              <article
                key={clip.id}
                data-clip-slide
                data-index={index}
                className={`loved-clips-slide${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "true" : undefined}
              >
                <div
                  className="loved-clips-frame"
                  role="button"
                  tabIndex={0}
                  onClick={() => scrollToIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      scrollToIndex(index);
                    }
                  }}
                  aria-label={
                    clip.caption
                      ? `Focus clip: ${clip.caption}`
                      : `Focus clip ${index + 1}`
                  }
                >
                  {clip.type === "video" ? (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[clip.id] = el;
                        else delete videoRefs.current[clip.id];
                      }}
                      className="loved-clips-media"
                      src={clip.src}
                      poster={clip.poster}
                      playsInline
                      muted
                      loop
                      preload={index <= 1 || isActive ? "auto" : "metadata"}
                      aria-hidden={!isActive}
                    />
                  ) : (
                    <Image
                      src={clip.src}
                      alt=""
                      fill
                      sizes="(max-width: 480px) 72vw, 320px"
                      className="loved-clips-media"
                      priority={index < 2}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="loved-clips-footer">
        <div className="loved-clips-dots" role="tablist" aria-label="Clip position">
          {lovedClips.map((clip, index) => (
            <button
              key={clip.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={`loved-clips-dot${index === activeIndex ? " is-active" : ""}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to clip ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </SectionTransition>
  );
}
