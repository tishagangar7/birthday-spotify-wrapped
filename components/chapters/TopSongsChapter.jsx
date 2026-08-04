"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { topSongs } from "../../data/wrappedChapters";

/** Wrapped-style top songs — replaces the old movie opening-credits page. */
export default function TopSongsChapter() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionTransition className="wrapped-card wrapped-accent-pink top-songs-chapter" variant="rise">
      <span className="wrapped-kicker">your top songs</span>
      <div className="wrapped-body top-songs-body">
        <p className="wrapped-order-heading">the ones on repeat</p>
        <ol className="wrapped-list top-songs-list">
          {topSongs.map((song, index) => (
            <motion.li
              key={song.rank}
              className="top-songs-row"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0.01 : 0.45,
                delay: reduceMotion ? 0 : 0.2 + index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className={`wrapped-rank${song.rank === 1 ? " is-first" : ""}`}>{song.rank}</span>
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
            </motion.li>
          ))}
        </ol>
      </div>
    </SectionTransition>
  );
}
