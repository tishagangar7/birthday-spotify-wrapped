"use client";

import Link from "next/link";
import AlbumCoverArt from "../../components/AlbumCoverArt";
import Grain from "../../components/Grain";
import { tracklist } from "../../data/tracklist";
import { getDisplayName } from "../../lib/anonymizeNames";

export default function AlbumPage() {
  return (
    <div className="page-scroll album-page">
      <Link href="/" className="album-back">
        ← back to wrapped
      </Link>

      <header className="album-hero">
        <AlbumCoverArt variant="hero" size="hero" label="actual life" />
        <div className="album-meta">
          <span className="album-tag">album · ali remix</span>
          <h1 className="album-title">
            actual life
            <br />
            (2005–2026)
          </h1>
          <p className="album-artist">fred again..</p>
          <span className="album-play-btn">▶ Play Album</span>
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
                  <AlbumCoverArt index={index} size="thumb" />
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
