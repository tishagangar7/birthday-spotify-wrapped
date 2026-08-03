"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Grain from "../../components/Grain";
import { getPlaylistPhotos, PLAYLIST_FILTERS, playlistGroups } from "../../data/playlistPhotos";
import { tracklist } from "../../data/tracklist";
import { getDisplayName } from "../../lib/anonymizeNames";

export default function AlbumPage() {
  const [filter, setFilter] = useState("all");
  const photos = useMemo(() => getPlaylistPhotos(filter), [filter]);
  const cover = playlistGroups.red[0] ?? photos[0];

  return (
    <div className="page-scroll album-page">
      <Link href="/" className="album-back">
        ← back to wrapped
      </Link>

      <header className="album-hero">
        {cover ? (
          <div className="album-cover album-cover-hero album-cover-photo">
            <div className={`actual-image actual-${cover.color}`}>
              <Image src={cover.src} alt={cover.alt} fill sizes="120px" className="media-image album-cover-image" />
            </div>
          </div>
        ) : null}
        <div className="album-meta">
          <span className="album-tag">playlist · ali remix</span>
          <h1 className="album-title">
            actual life
            <br />
            (2005–2026)
          </h1>
          <p className="album-artist">
            {playlistGroups.red.length} red · {playlistGroups.yellow.length} yellow · {playlistGroups.blue.length} blue
          </p>
        </div>
      </header>

      <div className="playlist-filters" role="tablist" aria-label="color filter">
        {PLAYLIST_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            className={`playlist-filter playlist-filter-${item.id}${filter === item.id ? " is-active" : ""}`}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={`playlist-grid playlist-grid-${filter} album-page-grid`}>
        {photos.map((photo) => (
          <figure key={photo.id} className="playlist-shot">
            <div className={`actual-image actual-${photo.color}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 46vw, 240px" className="media-image" />
            </div>
            <figcaption className="playlist-shot-meta">
              <span>{photo.filename}</span>
              <span className={`playlist-shot-color playlist-shot-color-${photo.color}`}>{photo.color}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="album-tracklist-col">
        <p className="track-list-label">friend tracks</p>
        <ol className="track-list">
          {tracklist.map((track) => (
            <li key={track.slug}>
              <Link href={`/album/${track.slug}`} className="track-row">
                <span className="track-row-number">{track.trackNumber}</span>
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
