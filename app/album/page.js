"use client";

import Link from "next/link";
import Grain from "../../components/Grain";
import { tracklist } from "../../data/tracklist";
import { getDisplayName } from "../../lib/anonymizeNames";

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

const COVER_GRADIENT =
  "linear-gradient(135deg, rgb(217, 89, 140) 14%, rgb(102, 51, 128) 50%, rgb(30, 215, 96) 86%)";

function ThumbArt({ index }) {
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
      <Link href="/" className="album-back">
        ← back to wrapped
      </Link>

      <header className="album-hero">
        <div
          className="album-cover album-cover-hero album-cover-gradient"
          style={{ backgroundImage: COVER_GRADIENT }}
          aria-hidden="true"
        />
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
                  <ThumbArt index={index} />
                </span>
                <span className="track-row-text">
                  <span className="track-row-title">{getDisplayName(track.person)}</span>
                  <span className="track-row-subtitle">{track.subtitle}</span>
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
