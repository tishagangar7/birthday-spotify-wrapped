"use client";

import { useState } from "react";

function SpriteFallback({ archetype }) {
  return (
    <div
      className="which-ali-sprite-fallback"
      style={{ "--arch-accent": archetype.accent }}
      aria-hidden="true"
    >
      <span className="which-ali-sprite-block" />
      <span className="which-ali-sprite-block which-ali-sprite-block--mid" />
      <span className="which-ali-sprite-initials">{archetype.initials}</span>
    </div>
  );
}

/**
 * Single transparent PNG (or CSS placeholder). No card chrome.
 */
export default function CharacterSprite({
  archetype,
  alt = "",
  className = "",
  silhouetted = false,
}) {
  const [failed, setFailed] = useState(false);
  const src = archetype.image || archetype.sprite;

  if (failed || !src) {
    return (
      <div className={`which-ali-sprite ${className}`.trim()}>
        <SpriteFallback archetype={archetype} />
      </div>
    );
  }

  return (
    <div
      className={`which-ali-sprite${silhouetted ? " is-silhouette" : ""} ${className}`.trim()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="which-ali-sprite-img"
        src={src}
        alt={alt}
        draggable={false}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
