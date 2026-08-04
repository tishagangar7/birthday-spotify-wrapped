"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";

/** Curated Ali camera roll — varied spread, ~16 shots so the wall breathes. */
const POLAROID_PHOTOS = [
  { src: "/photos/ali/ali-01.jpg", rotate: -2.5 },
  { src: "/photos/ali/ali-04.jpg", rotate: 2.8 },
  { src: "/photos/ali/ali-07.jpg", rotate: -1.2 },
  { src: "/photos/ali/ali-10.jpg", rotate: 3.2 },
  { src: "/photos/ali/ali-13.jpg", rotate: -3.1 },
  { src: "/photos/ali/ali-16.jpg", rotate: 1.6 },
  { src: "/photos/ali/ali-19.jpg", rotate: -2.2 },
  { src: "/photos/ali/ali-22.jpg", rotate: 2.4 },
  { src: "/photos/ali/ali-26.jpg", rotate: -1.8 },
  { src: "/photos/ali/ali-30.jpg", rotate: 3.5 },
  { src: "/photos/ali/ali-34.jpg", rotate: -0.8 },
  { src: "/photos/ali/ali-37.jpg", rotate: 2.1 },
  { src: "/photos/ali/ali-40.jpg", rotate: -3.4 },
  { src: "/photos/ali/ali-43.jpg", rotate: 1.3 },
  { src: "/photos/ali/ali-47.jpg", rotate: -2.7 },
  { src: "/photos/ali/ali-49.jpg", rotate: 0.9 },
];

export default function PolaroidWallChapter() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionTransition className="wrapped-card wrapped-accent-pink polaroid-wall-chapter" variant="fade">
      <header className="polaroid-wall-header">
        <span className="wrapped-kicker">the wall · your photos</span>
        <p className="polaroid-wall-subtext">the year, on film.</p>
      </header>

      <div className="polaroid-wall-scroll story-no-nav">
        <div className="polaroid-wall-grid">
          {POLAROID_PHOTOS.map((photo, index) => (
            <motion.figure
              key={photo.src}
              className="polaroid-frame"
              style={{ "--polaroid-rotate": `${photo.rotate}deg` }}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : index * 0.035,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="polaroid-image-wrap">
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 42vw, 180px"
                  className="polaroid-image"
                  priority={index < 6}
                />
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </SectionTransition>
  );
}
