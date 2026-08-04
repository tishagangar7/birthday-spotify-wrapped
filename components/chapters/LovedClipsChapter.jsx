"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import SectionTransition from "../SectionTransition";
import { lovedClips } from "../../data/wrappedChapters";

/**
 * Horizontal “clips we love” filmstrip — Spotify Made For You energy.
 * Center snap = focused; videos autoplay muted+loop when active.
 */
export default function LovedClipsChapter() {
  const reduceMotion = useReducedMotion();
  const chapterRef = useRef(null);
  const stripRef = useRef(null);
  const videoRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [chapterVisible, setChapterVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [needsGesture, setNeedsGesture] = useState(false);

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

  useEffect(() => {
    const root = chapterRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setChapterVisible(entry.isIntersecting && entry.intersectionRatio >= 0.45);
      },
      { threshold: [0.35, 0.45, 0.6] }
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
    updateActiveFromScroll();

    const onResize = () => updateActiveFromScroll();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      strip.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateActiveFromScroll]);

  useEffect(() => {
    lovedClips.forEach((clip, i) => {
      if (clip.type !== "video") return;
      const video = videoRefs.current[clip.id];
      if (!video) return;

      const shouldPlay = chapterVisible && i === activeIndex && !reduceMotion;
      if (!shouldPlay) {
        video.pause();
        return;
      }

      video.muted = muted;
      video.loop = true;
      const play = async () => {
        try {
          await video.play();
          setNeedsGesture(false);
        } catch {
          setNeedsGesture(true);
        }
      };
      play();
    });
  }, [activeIndex, muted, reduceMotion, chapterVisible]);

  const handleUnmute = async () => {
    setMuted(false);
    const clip = lovedClips[activeIndex];
    if (clip?.type !== "video") return;
    const video = videoRefs.current[clip.id];
    if (!video) return;
    video.muted = false;
    try {
      await video.play();
      setNeedsGesture(false);
    } catch {
      setNeedsGesture(true);
    }
  };

  const handleMuteToggle = async () => {
    if (muted) {
      await handleUnmute();
    } else {
      setMuted(true);
      const clip = lovedClips[activeIndex];
      if (clip?.type === "video") {
        const video = videoRefs.current[clip.id];
        if (video) video.muted = true;
      }
    }
  };

  const scrollToIndex = (index) => {
    const strip = stripRef.current;
    const slide = strip?.querySelector(`[data-clip-slide][data-index="${index}"]`);
    if (!strip || !slide) return;
    const left = slide.offsetLeft - (strip.clientWidth - slide.offsetWidth) / 2;
    strip.scrollTo({
      left,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <SectionTransition
      ref={chapterRef}
      className="wrapped-card wrapped-accent-teal loved-clips-chapter story-no-nav"
      variant="fade"
    >
      <header className="loved-clips-header">
        <span className="wrapped-kicker">bonus · clips we love</span>
        <h2 className="loved-clips-heading">some clips we love</h2>
        <p className="loved-clips-subtext">swipe the strip. center one stays on.</p>
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
                <button
                  type="button"
                  className="loved-clips-frame"
                  onClick={() => scrollToIndex(index)}
                  aria-label={
                    clip.caption
                      ? `Focus clip: ${clip.caption}`
                      : `Focus clip ${index + 1}`
                  }
                >
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
                    preload={index === 0 || isActive ? "auto" : "metadata"}
                    aria-hidden={!isActive}
                  />
                </button>
                {clip.caption ? (
                  <p className={`loved-clips-caption${isActive ? " is-visible" : ""}`}>
                    {clip.caption}
                  </p>
                ) : (
                  <span className="loved-clips-caption-spacer" aria-hidden="true" />
                )}
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

        {!reduceMotion ? (
          <button
            type="button"
            className="loved-clips-mute"
            onClick={handleMuteToggle}
            aria-label={muted || needsGesture ? "Unmute clip" : "Mute clip"}
          >
            {muted || needsGesture ? (
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
      </div>
    </SectionTransition>
  );
}
