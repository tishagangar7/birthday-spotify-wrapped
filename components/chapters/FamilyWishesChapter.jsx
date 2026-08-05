"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { familyWishesChapter as data } from "../../data/familyWishes";

const CLIPS = data.clips;
const SPROCKET_COUNT = 28;

function wrapIndex(i) {
  const len = CLIPS.length;
  return ((i % len) + len) % len;
}

function SprocketRow({ side }) {
  return (
    <div className={`family-film-sprockets family-film-sprockets--${side}`} aria-hidden="true">
      {Array.from({ length: SPROCKET_COUNT }, (_, i) => (
        <span key={i} className="family-film-sprocket" />
      ))}
    </div>
  );
}

function FilmFrame({ clip, variant, emptyLabel, videoRef, muted, onEnded, onError, onSelect }) {
  const isActive = variant === "active";
  const hasVideo = Boolean(clip?.video);

  const matte = (
    <div className="family-film-matte">
      {hasVideo ? (
        <video
          ref={isActive ? videoRef : undefined}
          className="family-film-video"
          src={clip.video}
          playsInline
          muted={isActive ? muted : true}
          preload="metadata"
          onEnded={isActive ? onEnded : undefined}
          onError={isActive ? onError : undefined}
        />
      ) : (
        <p className="family-film-empty">{emptyLabel}</p>
      )}
    </div>
  );

  if (isActive) {
    return <div className="family-film-frame family-film-frame--active">{matte}</div>;
  }

  return (
    <button
      type="button"
      className={`family-film-frame family-film-frame--${variant}`}
      onClick={onSelect}
      aria-label={`Go to ${clip.name}`}
      tabIndex={-1}
    >
      {matte}
    </button>
  );
}

export default function FamilyWishesChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [videoMissing, setVideoMissing] = useState(false);
  const [direction, setDirection] = useState(0);

  const clip = CLIPS[index];
  const prevClip = CLIPS[wrapIndex(index - 1)];
  const nextClip = CLIPS[wrapIndex(index + 1)];
  const hasVideo = Boolean(clip?.video) && !videoMissing;
  const hasExternalAudio = Boolean(clip?.audio);
  // Huzi (and any clip with separate audio): always mute the video track.
  const videoMuted = hasExternalAudio;
  const hideSubheading = clip.id === "haider" || clip.id === "didi";

  const goTo = useCallback((next) => {
    const len = CLIPS.length;
    const target = ((next % len) + len) % len;
    setDirection(target > index || (index === len - 1 && target === 0) ? 1 : -1);
    setIndex(target);
    setVideoMissing(false);
  }, [index]);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % CLIPS.length);
    setVideoMissing(false);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + CLIPS.length) % CLIPS.length);
    setVideoMissing(false);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0.25, 0.4, 0.6] }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Pause when chapter leaves view; play when visible.
  // Empty / missing clips auto-advance so the reel doesn't stall on mom/dad placeholders.
  // Clips with separate audio (huzi): mute video, play audio, advance when audio ends.
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!visible) {
      video?.pause();
      audio?.pause();
      return undefined;
    }

    if (!hasVideo) {
      if (reduceMotion) return undefined;
      const timer = window.setTimeout(() => goNext(), 1800);
      return () => window.clearTimeout(timer);
    }

    if (!video) return undefined;

    video.currentTime = 0;
    video.muted = hasExternalAudio;
    video.loop = hasExternalAudio;
    const play = video.play();
    if (play?.catch) play.catch(() => {});

    const onAudioEnded = () => {
      if (!reduceMotion) goNext();
    };

    if (audio && hasExternalAudio) {
      audio.currentTime = 0;
      audio.muted = false;
      const aPlay = audio.play();
      if (aPlay?.catch) aPlay.catch(() => {});
      audio.addEventListener("ended", onAudioEnded);
    }

    return () => {
      video.pause();
      video.loop = false;
      if (audio) {
        audio.pause();
        audio.removeEventListener("ended", onAudioEnded);
      }
    };
  }, [visible, index, hasVideo, hasExternalAudio, reduceMotion, goNext]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        e.stopImmediatePropagation();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        e.stopImmediatePropagation();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, goNext, goPrev]);

  function handleEnded() {
    // External-audio clips advance on audio end, not video end.
    if (hasExternalAudio || reduceMotion) return;
    goNext();
  }

  const slideX = reduceMotion ? 0 : direction * 48;

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-orange story-no-nav family-wishes-chapter"
      variant="rise"
    >
      <div className="family-wishes-top">
        <span className="wrapped-kicker">{data.kicker}</span>
        <header className="family-wishes-header">
          <h2 className="lore-iceberg-headline family-wishes-headline">{data.headline}</h2>
          {!hideSubheading ? (
            <p className="wrapped-caption">{data.subheading}</p>
          ) : null}
        </header>
        <div className="family-reel-caption" aria-live="polite">
          {clip.description ? (
            <p className="family-reel-description">{clip.description}</p>
          ) : (
            <span className="family-reel-caption-spacer" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="family-film-strip" role="region" aria-label="Family wishes film reel">
        <SprocketRow side="top" />

        <div className="family-film-stage">
          <button
            type="button"
            className="family-reel-nav family-reel-nav--prev"
            onClick={goPrev}
            aria-label={data.prevLabel}
          >
            <span aria-hidden="true">‹</span>
            <span className="family-reel-nav-label">prev</span>
          </button>

          <motion.div
            key={clip.id}
            className="family-film-frames"
            initial={reduceMotion ? false : { x: slideX, opacity: 0.85 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <FilmFrame
              clip={prevClip}
              variant="prev"
              emptyLabel={data.emptyVideoLabel}
              onSelect={goPrev}
            />
            <FilmFrame
              clip={clip}
              variant="active"
              emptyLabel={data.emptyVideoLabel}
              videoRef={videoRef}
              muted={videoMuted}
              onEnded={handleEnded}
              onError={() => setVideoMissing(true)}
            />
            <FilmFrame
              clip={nextClip}
              variant="next"
              emptyLabel={data.emptyVideoLabel}
              onSelect={goNext}
            />
          </motion.div>

          <button
            type="button"
            className="family-reel-nav family-reel-nav--next"
            onClick={goNext}
            aria-label={data.nextLabel}
          >
            <span className="family-reel-nav-label">next</span>
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <SprocketRow side="bottom" />
      </div>

      {clip.audio ? (
        <audio ref={audioRef} src={clip.audio} preload="auto" />
      ) : null}

      <div className="family-wishes-footer">
        <p className="family-reel-name" aria-live="polite">
          {clip.name}
        </p>

        <div className="family-reel-dots" role="tablist" aria-label="Wish position">
          {CLIPS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${c.name}${i === index ? ", now playing" : ""}`}
              className={`family-reel-dot${i === index ? " is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </SectionTransition>
  );
}
