"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Volume2, X } from "lucide-react";
import SectionTransition from "../SectionTransition";
import { topArtists } from "../../data/wrappedChapters";

function ArtistModal({ artist, onClose }) {
  const videoRef = useRef(null);
  const [needsUnmute, setNeedsUnmute] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasVideo = Boolean(artist?.video);
  const isComingSoon = Boolean(artist?.comingSoon);
  const isOpen = Boolean(artist && (hasVideo || isComingSoon));

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
    if (!isOpen) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return undefined;

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
  }, [hasVideo, artist?.video]);

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

  if (!mounted || !isOpen) return null;

  const modalTitle = hasVideo
    ? (artist.videoTitle ?? artist.name)
    : artist.name;

  return createPortal(
    <div className="artist-video-overlay" onClick={close} role="presentation">
      <div
        className="artist-video-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="artist-video-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="artist-video-card">
          <button
            type="button"
            className="artist-video-close"
            onClick={close}
            aria-label={hasVideo ? "Close video" : "Close"}
          >
            <X size={20} strokeWidth={2.25} aria-hidden="true" />
          </button>
          <h2 id="artist-video-title" className="artist-video-heading">
            {modalTitle}
          </h2>
          {hasVideo ? (
            <>
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
              {artist.videoCaption ? (
                <p className="artist-video-caption">{artist.videoCaption}</p>
              ) : null}
            </>
          ) : (
            <p className="artist-video-coming-soon">coming soon</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Wrapped-style top artists — horizontal Spotify portrait row, purple accent. */
export default function TopArtistsChapter() {
  const [activeArtist, setActiveArtist] = useState(null);

  const openArtist = (artist) => {
    if (artist.video || artist.comingSoon) setActiveArtist(artist);
  };

  return (
    <>
      <SectionTransition
        className="wrapped-card wrapped-accent-purple top-artists-chapter"
        variant="rise"
      >
        <span className="wrapped-kicker">top artists</span>
        <div className="wrapped-body top-artists-body">
          <p className="wrapped-order-heading top-artists-subheading">
            you heard them all year. we&apos;ve heard you singing them everywhere. (rip
            our ears)
          </p>
          <div className="top-artists-grid" role="list">
            {topArtists.map((artist, index) => {
              const hasVideo = Boolean(artist.video);
              const isComingSoon = Boolean(artist.comingSoon);
              const isInteractive = hasVideo || isComingSoon;
              const isHighlighted = activeArtist?.slug === artist.slug;

              return (
                <article
                  key={artist.rank}
                  className={`top-artists-card stagger-in${isHighlighted ? " is-highlighted" : ""}${isInteractive ? " is-interactive" : ""}`}
                  role="listitem"
                  style={{ "--stagger-index": index, "--stagger-delay": "0.15s", "--stagger-step": "0.1s", "--stagger-duration": "0.5s" }}
                >
                  <span
                    className={`top-artists-rank${isHighlighted ? " is-highlighted" : ""}`}
                    aria-hidden="true"
                  >
                    #{artist.rank}
                  </span>
                  {isInteractive ? (
                    <button
                      type="button"
                      className="top-artists-avatar-btn"
                      onClick={() => openArtist(artist)}
                      aria-label={
                        hasVideo
                          ? `Play ${artist.name} concert video`
                          : `Open ${artist.name}`
                      }
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
                  {isInteractive ? (
                    <button
                      type="button"
                      className="top-artists-name-btn"
                      onClick={() => openArtist(artist)}
                    >
                      <span className="top-artists-name">{artist.name}</span>
                    </button>
                  ) : (
                    <h3 className="top-artists-name">{artist.name}</h3>
                  )}
                  <span className="top-artists-label">{artist.label ?? "Artist"}</span>
                </article>
              );
            })}
          </div>
        </div>
      </SectionTransition>
      <ArtistModal artist={activeArtist} onClose={() => setActiveArtist(null)} />
    </>
  );
}
