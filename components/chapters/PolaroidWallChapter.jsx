"use client";

import Image from "next/image";
import SectionTransition from "../SectionTransition";

/**
 * Exactly 9 group shots (4+ people in frame), all from public/photos/ali/.
 *
 * Curated files:
 * - ali-02.jpg — 4 friends, kitchen party
 * - ali-07.jpg — 5 people, indoor gathering
 * - ali-10.jpg — 8 people, traditional dress (lime wall)
 * - ali-13.jpg — 4 people, costume party (string lights)
 * - ali-17.jpg — 4 friends, coastal cliff overlook
 * - ali-19.jpg — 5 people, beach sunset
 * - ali-22.jpg — 6 people, coastal sunset lineup
 * - ali-30.jpg — 5 people, parking garage (festive wear)
 * - ali-33.jpg — 4 people, outdoor night event (kurtas)
 */
const POLAROID_PHOTOS = [
  { src: "/photos/ali/ali-02.jpg", rotate: -2.5 },
  { src: "/photos/ali/ali-07.jpg", rotate: 2.4 },
  { src: "/photos/ali/ali-10.jpg", rotate: -1.8 },
  { src: "/photos/ali/ali-13.jpg", rotate: 3.1 },
  { src: "/photos/ali/ali-17.jpg", rotate: -2.2 },
  { src: "/photos/ali/ali-19.jpg", rotate: 1.7 },
  { src: "/photos/ali/ali-22.jpg", rotate: -3.2 },
  { src: "/photos/ali/ali-30.jpg", rotate: 2.8 },
  { src: "/photos/ali/ali-33.jpg", rotate: -1.4 },
];

export default function PolaroidWallChapter() {
  return (
    <SectionTransition className="wrapped-card wrapped-accent-pink polaroid-wall-chapter" variant="fade">
      <header className="polaroid-wall-header">
        <span className="wrapped-kicker">the wall · your photos</span>
        <p className="polaroid-wall-subtext">the year, on film.</p>
      </header>

      <div className="polaroid-wall-scroll story-no-nav">
        <div className="polaroid-wall-grid polaroid-wall-grid-nine">
          {POLAROID_PHOTOS.map((photo, index) => (
            <figure
              key={photo.src}
              className="polaroid-frame stagger-in-fade"
              style={{
                "--polaroid-rotate": `${photo.rotate}deg`,
                "--stagger-index": index,
                "--stagger-delay": "0s",
                "--stagger-step": "0.045s",
                "--stagger-duration": "0.55s",
              }}
            >
              <div className="polaroid-image-wrap">
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 30vw, 200px"
                  className="polaroid-image"
                  priority={index < 4}
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </SectionTransition>
  );
}
