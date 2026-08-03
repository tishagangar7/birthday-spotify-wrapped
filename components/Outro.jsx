"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MediaFrame from "./MediaFrame";
import SectionTransition from "./SectionTransition";
import WrappedButton from "./WrappedButton";

export default function Outro({ finale }) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <SectionTransition className="outro-card" variant="rise">
      <div className="finished-player">
        <span>00:00</span>
        <span className="finished-line" />
      </div>

      <AnimatePresence mode="wait">
        {archiveOpen ? (
          <motion.div
            key="continuation"
            className="continuation"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.7 }}
          >
            <p className="day-count">day 7,6xx</p>
            <MediaFrame
              media={finale.media[0]}
              color="yellow"
              date="oct 04 2026"
              time="11:59 pm"
              location="wherever we end up"
            />
            <p className="continues">actual life continues.</p>
          </motion.div>
        ) : (
          <motion.div
            key="add-memory"
            className="wrapped-cta-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.6, delay: reduceMotion ? 0 : 0.3 }}
          >
            <WrappedButton variant="primary" onClick={() => setArchiveOpen(true)}>
              + add to actual life
            </WrappedButton>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="site-footer">
        <WrappedButton variant="ghost" href="https://open.spotify.com/" external>
          continue listening →
        </WrappedButton>
        <span>actual life / ali / 2005—2026</span>
      </footer>
    </SectionTransition>
  );
}
