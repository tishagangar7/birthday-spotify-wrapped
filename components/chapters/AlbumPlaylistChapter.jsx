"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { getPlaylistPhotos, PLAYLIST_FILTERS, playlistGroups } from "../../data/playlistPhotos";

/** Actual Life playlist — red / yellow / blue filtered photo groups. */
export default function AlbumPlaylistChapter() {
  const [filter, setFilter] = useState("all");
  const photos = useMemo(() => getPlaylistPhotos(filter), [filter]);

  return (
    <SectionTransition className="album-playlist-chapter" variant="rise">
      <header className="album-playlist-hero">
        <span className="wrapped-kicker">playlist · actual life</span>
        <h2 className="album-playlist-title">
          actual life
          <br />
          (2005–2026)
        </h2>
        <p className="album-playlist-artist">
          {playlistGroups.red.length} red · {playlistGroups.yellow.length} yellow · {playlistGroups.blue.length} blue
        </p>
      </header>

      <div className="playlist-filters story-no-nav" role="tablist" aria-label="color filter">
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

      <div className={`playlist-grid playlist-grid-${filter}`}>
        {photos.map((photo, index) => (
          <figure key={photo.id} className="playlist-shot">
            <div className={`actual-image actual-${photo.color}`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 46vw, 220px"
                className="media-image"
                priority={index < 4}
              />
            </div>
            <figcaption className="playlist-shot-meta">
              <span>{photo.filename}</span>
              <span className={`playlist-shot-color playlist-shot-color-${photo.color}`}>{photo.color}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="wrapped-cta-row">
        <WrappedButton variant="ghost" href="/album">
          open full album →
        </WrappedButton>
      </div>
    </SectionTransition>
  );
}
