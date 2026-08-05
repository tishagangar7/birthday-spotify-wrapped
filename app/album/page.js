"use client";

import Image from "next/image";
import Link from "next/link";
import Grain from "../../components/Grain";
import { tracklist } from "../../data/tracklist";

/** Gradient thumbs — Figma album art placeholders, not photos. */
const THUMB_GRADIENTS = [
  "linear-gradient(135deg, #f045a3 14%, #1ed760 86%)",
  "linear-gradient(135deg, #4a3dbf 14%, #21529e 86%)",
  "linear-gradient(135deg, #d95421 14%, #fad426 86%)",
  "linear-gradient(135deg, #0d8ca6 14%, #0d1a24 86%)",
  "linear-gradient(135deg, #d92e2e 14%, #6b38ad 86%)",
  "linear-gradient(135deg, #1ed760 14%, #2673e5 86%)",
  "linear-gradient(135deg, #ed408c 14%, #4a3dbf 86%)",
  "linear-gradient(135deg, #fad426 14%, #d95421 86%)",
  "linear-gradient(135deg, #21529e 14%, #f045a3 86%)",
  "linear-gradient(135deg, #6b38ad 14%, #1ed760 86%)",
];

const ALBUM_COVER = "/photos/ali/album-cover.png";

function ThumbArt({ track, index }) {
  const cover = track.media?.[0];
  const hasFriendCover = cover?.src?.startsWith("/photos/friends/");

  if (hasFriendCover) {
    return (
      <span className={`track-row-art-tile track-row-art-photo actual-image actual-${track.color}`}>
        <Image
          src={cover.src}
          alt=""
          fill
          sizes="60px"
          className="media-image"
        />
      </span>
    );
  }

  return (
    <span
      className="track-row-art-tile"
      style={{ backgroundImage: THUMB_GRADIENTS[index % THUMB_GRADIENTS.length] }}
      aria-hidden="true"
    >
      <span className="track-row-art-icon" />
    </span>
  );
}

export default function AlbumPage() {
  const firstTrack = tracklist[0];

  return (
    <div className="page-scroll album-page">
      <Link
        href="/#album-teaser"
        className="album-back"
        onClick={() => {
          try {
            sessionStorage.setItem("wrappedHashJump", "1");
          } catch {
            /* ignore */
          }
        }}
      >
        ← back to wrapped
      </Link>

      <header className="album-hero">
        <div className="album-cover album-cover-hero album-cover-photo">
          <div className="actual-image actual-blue">
            <Image
              src={ALBUM_COVER}
              alt="actual life album cover"
              fill
              sizes="(max-width: 1024px) 26vw, 380px"
              className="media-image album-cover-image"
              priority
            />
          </div>
        </div>
        <div className="album-meta">
          <span className="album-tag">album · ali remix</span>
          <h1 className="album-title">
            actual life
            <br />
            (2005–2026)
          </h1>
          <p className="album-artist">fred again..</p>
          {firstTrack ? (
            <Link href={`/album/${firstTrack.slug}`} className="album-play-btn">
              ▶ Play Album
            </Link>
          ) : null}
        </div>
      </header>

      <div className="album-tracklist-col">
        <p className="track-list-label">tracklist</p>
        <ol className="track-list">
          {tracklist.map((track, index) => (
            <li key={track.slug}>
              <Link href={`/album/${track.slug}`} className="track-row">
                <span className="track-row-number">{track.trackNumber}</span>
                <span className="track-row-art">
                  <ThumbArt track={track} index={index} />
                </span>
                <span className="track-row-text">
                  <span className="track-row-title">{track.person}</span>
                </span>
                <span className="track-row-duration">{track.duration}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <Grain />
    </div>
  );
}
