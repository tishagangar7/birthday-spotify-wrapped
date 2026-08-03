"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { foundYouPhotos } from "../data/memories";
import SectionTransition from "./SectionTransition";
import WrappedButton from "./WrappedButton";
import { useStoryDeckNav } from "./StoryDeckContext";

export default function FoundYou() {
  const reduceMotion = useReducedMotion();
  const nav = useStoryDeckNav();

  return (
    <SectionTransition className="found-you" variant="fade">
      <motion.p
        className="found-opening"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.9 }}
      >
        we found you.
      </motion.p>

      <div className="found-field">
        {foundYouPhotos.map((photo, index) => (
          <motion.figure
            key={`${photo.src}-${index}`}
            className={`found-photo found-photo-${index + 1}`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.15 + index * 0.06 }}
          >
            <div className={`actual-image actual-${photo.color}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 42vw, 24vw" className="media-image" />
            </div>
          </motion.figure>
        ))}
      </div>

      <motion.p
        className="found-ending"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.4 }}
      >
        21 years. somehow all of us ended up here.
      </motion.p>

      <div className="wrapped-cta-row found-skip">
        <WrappedButton variant="ghost" onClick={() => nav?.goToId("chapter-7-heart")}>
          skip to the end
        </WrappedButton>
      </div>
    </SectionTransition>
  );
}
