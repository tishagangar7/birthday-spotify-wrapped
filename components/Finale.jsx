"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getDisplayName } from "../lib/anonymizeNames";
import MediaFrame from "./MediaFrame";
import SectionTransition from "./SectionTransition";
import VoiceNote from "./VoiceNote";

export default function Finale({ memory, onActive, onVoicePlayback }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    onActive?.(memory);
  }, [memory, onActive]);

  return (
    <SectionTransition className="finale">
      <motion.header
        className="finale-header"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <span>21</span>
        <h2>ali</h2>
        <p>(actual life)</p>
      </motion.header>

      <div className="finale-voices">
        <VoiceNote person={getDisplayName("tisha")} onPlaybackChange={onVoicePlayback} />
        <VoiceNote person={getDisplayName("everyone")} onPlaybackChange={onVoicePlayback} />
      </div>

      <div className="finale-media">
        {memory.media.map((media, index) => (
          <MediaFrame
            key={media.filename}
            media={media}
            color={memory.color}
            date={memory.date}
            time={memory.time}
            location={memory.location}
            index={index}
          />
        ))}
      </div>

      <motion.div
        className="finale-words"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: reduceMotion ? 0 : 0.2 }}
      >
        <p>these were the first 21 years.</p>
        <p>thanks for letting us be in them.</p>
        <p>happy 21st, ali.</p>
      </motion.div>
    </SectionTransition>
  );
}
