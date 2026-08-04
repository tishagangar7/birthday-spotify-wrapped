"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Volume2, X } from "lucide-react";
import SectionTransition from "../SectionTransition";
import { topArtists } from "../../data/wrappedChapters";

function ArtistVideoModal({ artist, onClose }) {
  const videoRef = useRef(null);
  const [needsUnmute, setNeedsUnmute] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!artist?.video) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [artist?.video, close]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !artist?.video) return undefined;

    let cancelled = false;

    const tryPlay = async () => {
      video.muted = false;
      try {
        await video.play();
        if (!cancelled) setNeedsUnmute(false);
      } catch {
        video.muted = true;
        try {
          await video.play();
          if (!cancelled) setNeedsUnmute(true);
        } catch {
          if (!cancelled) setNeedsUnmute(true);
        }
      }
    };

    tryPlay();

    return () => {
      cancelled = true;
    };
  }, [artist?.video]);

  const handleUnmute = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    try {
      await video.play();
      setNeedsUnmute(false);
    } catch {
      setNeedsUnmute(true);
    }
  };

  if (!mounted || !artist?.video) return null;

  return createPortal(
    <div className="artist-video-overlay" onClick={close} role="presentation">
      <div
        className="artist-video-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="artist-video-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="artist-video-close"
          onClick={close}
          aria-label="Close video"
        >
          <X size={22} strokeWidth={2.25} aria-hidden="true" />
        </button>
        <h2 id="artist-video-title" className="sr-only">
          {artist.name} concert
        </h2>
        <div className="artist-video-frame">
          <video
            ref={videoRef}
            className="artist-video-player"
            src={artist.video}
            playsInline
            controls={needsUnmute}
            preload="auto"
          />
          {needsUnmute ? (
            <button type="button" className="artist-video-unmute" onClick={handleUnmute}>
              <Volume2 size={18} aria-hidden="true" />
              Tap to unmute
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Wrapped-style top artists — horizontal Spotify portrait row, purple accent. */
export default function TopArtistsChapter() {
  const reduceMotion = useReducedMotion();
  const [activeVideo, setActiveVideo] = useState(null);

  const openVideo = (artist) => {
    if (artist.video) setActiveVideo(artist);
  };

  return (
    <>
      <SectionTransition
        className="wrapped-card wrapped-accent-purple top-artists-chapter"
        variant="rise"
      >
        <span className="wrapped-kicker">your top artists</span>
        <div className="wrapped-body top-artists-body">
          <p className="wrapped-order-heading top-artists-subheading">
            you heard them all year. we&apos;ve heard you singing them everywhere. (rip
            our ears)
          </p>
          <div className="top-artists-grid" role="list">
            {topArtists.map((artist, index) => {
              const hasVideo = Boolean(artist.video);

              return (
                <motion.article
                  key={artist.rank}
                  className={`top-artists-card${artist.rank === 1 ? " is-first" : ""}${hasVideo ? " has-video" : ""}`}
                  role="listitem"
                  initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: reduceMotion ? 0.01 : 0.5,
                    delay: reduceMotion ? 0 : 0.15 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span
                    className={`top-artists-rank${artist.rank === 1 ? " is-first" : ""}`}
                    aria-hidden="true"
                  >
                    #{artist.rank}
                  </span>
                  {hasVideo ? (
                    <button
                      type="button"
                      className="top-artists-avatar-btn"
                      onClick={() => openVideo(artist)}
                      aria-label={`Play ${artist.name} concert video`}
                    >
                      <div className="top-artists-avatar">
                        <Image
                          src={artist.image}
                          alt=""
                          fill
                          sizes="(max-width: 480px) 28vw, 140px"
                          className={`top-artists-avatar-image is-${artist.slug}`}
                        />
                      </div>
                    </button>
                  ) : (
                    <div className="top-artists-avatar">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        sizes="(max-width: 480px) 28vw, 140px"
                        className={`top-artists-avatar-image is-${artist.slug}`}
                      />
                    </div>
                  )}
                  {hasVideo ? (
                    <button
                      type="button"
                      className="top-artists-name-btn"
                      onClick={() => openVideo(artist)}
                    >
                      <span className="top-artists-name">{artist.name}</span>
                    </button>
                  ) : (
                    <h3 className="top-artists-name">{artist.name}</h3>
                  )}
                  <span className="top-artists-label">{artist.label ?? "Artist"}</span>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionTransition>
      <ArtistVideoModal artist={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
