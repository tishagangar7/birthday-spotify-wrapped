"use client";

import Image from "next/image";
import SectionTransition from "../SectionTransition";
import { topSongs } from "../../data/wrappedChapters";

/** Wrapped-style top songs — click a row to play in the bottom bar. */
export default function TopSongsChapter({ activeTrack, isPlaying, onSelectSong }) {
  return (
    <SectionTransition className="wrapped-card wrapped-accent-pink top-songs-chapter" variant="rise">
      <span className="wrapped-kicker">top songs</span>
      <div className="wrapped-body top-songs-body">
        <p className="wrapped-order-heading">the ones on repeat</p>
        <ol className="wrapped-list top-songs-list">
          {topSongs.map((song, index) => {
            const isActive = Boolean(activeTrack?.src && activeTrack.src === song.src);
            const rowPlaying = Boolean(isActive && isPlaying);

            return (
              <li
                key={song.rank}
                className={`top-songs-row stagger-in${isActive ? " is-active" : ""}${rowPlaying ? " is-playing" : ""}`}
                style={{ "--stagger-index": index }}
              >
                <button
                  type="button"
                  className="top-songs-hit"
                  onClick={() => onSelectSong?.(song)}
                  aria-pressed={isActive}
                  aria-label={
                    rowPlaying
                      ? `pause ${song.title} by ${song.artist}`
                      : `play ${song.title} by ${song.artist}`
                  }
                >
                  <span className={`wrapped-rank${isActive ? " is-active" : ""}`}>
                    {song.rank}
                  </span>
                  <span className="top-songs-cover">
                    <Image
                      src={song.cover}
                      alt=""
                      fill
                      sizes="56px"
                      className="top-songs-cover-image"
                    />
                  </span>
                  <span className="top-songs-text">
                    <span className="top-songs-title">{song.title}</span>
                    <span className="top-songs-artist">{song.artist}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionTransition>
  );
}
