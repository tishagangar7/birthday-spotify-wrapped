"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getDisplayName } from "../lib/anonymizeNames";
import MediaFrame from "./MediaFrame";
import SectionTransition from "./SectionTransition";
import VoiceNote from "./VoiceNote";

export default function Memory({ memory, onActive, onVoicePlayback }) {
  const reduceMotion = useReducedMotion();

  // In the story-deck, whichever memory card is mounted IS the active one —
  // no scroll-position tracking needed anymore.
  useEffect(() => {
    onActive?.(memory);
  }, [memory, onActive]);

  return (
    <SectionTransition
      className={`memory memory-${memory.layout}`}
      data-track={String(memory.id).padStart(2, "0")}
    >
      <motion.header
        className="memory-header"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.1 }}
      >
        <span className="track-number">{String(memory.id).padStart(2, "0")}</span>
        <div>
          <h2>{getDisplayName(memory.person)}</h2>
          <p className="memory-subtitle">({memory.subtitle})</p>
        </div>
        <div className="memory-date">
          <span>{memory.date}</span>
          <span>{memory.time}</span>
          <span>{memory.location}</span>
        </div>
      </motion.header>

      <div className={`memory-media layout-${memory.layout}`}>
        {memory.media.map((media, index) => (
          <MediaFrame
            key={`${memory.id}-${media.filename}`}
            media={media}
            color={memory.color}
            date={memory.date}
            time={memory.time}
            location={memory.location}
            index={index}
            priority={memory.id === 1}
            className={`frame-${index + 1}`}
          />
        ))}
      </div>

      <motion.div
        className="memory-copy"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: reduceMotion ? 0 : 0.25 }}
      >
        <p>{memory.message}</p>
        {memory.voiceNote ? (
          <VoiceNote src={memory.voiceNote} person={getDisplayName(memory.person)} onPlaybackChange={onVoicePlayback} />
        ) : null}
      </motion.div>
    </SectionTransition>
  );
}
