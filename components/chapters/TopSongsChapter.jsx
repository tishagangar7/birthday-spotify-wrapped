"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { topSongs } from "../../data/wrappedChapters";

/** Wrapped-style top songs — click a row to play in the bottom bar. */
export default function TopSongsChapter({ activeTrack, isPlaying, onSelectSong }) {
  const reduceMotion = useReducedMotion();

  return (
    <SectionTransition className="wrapped-card wrapped-accent-pink top-songs-chapter" variant="rise">
      <span className="wrapped-kicker">your top songs</span>
      <div className="wrapped-body top-songs-body">
        <p className="wrapped-order-heading">the ones on repeat</p>
        <ol className="wrapped-list top-songs-list">
          {topSongs.map((song, index) => {
            const isActive = Boolean(activeTrack?.src && activeTrack.src === song.src);
            const rowPlaying = Boolean(isActive && isPlaying);

            return (
              <motion.li
                key={song.rank}
                className={`top-songs-row${isActive ? " is-active" : ""}${rowPlaying ? " is-playing" : ""}`}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.45,
                  delay: reduceMotion ? 0 : 0.2 + index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
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
              </motion.li>
            );
          })}
        </ol>
      </div>
    </SectionTransition>
  );
}
