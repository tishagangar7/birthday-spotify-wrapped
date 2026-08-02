"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function MediaFrame({
  media,
  color = "red",
  date,
  time,
  location,
  priority = false,
  className = "",
  index = 0,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className={`media-frame ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 36, rotate: index % 2 ? 0.6 : -0.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 0.25 : -0.2 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 1.1, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`actual-image actual-${color}`}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 92vw, 70vw"
          className="media-image"
        />
      </div>
      <figcaption className="media-meta">
        <span>{media.filename}</span>
        <span>{date}</span>
        <span>{time}</span>
        <span>{location}</span>
      </figcaption>
    </motion.figure>
  );
}

