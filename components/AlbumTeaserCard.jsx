"use client";

import SectionTransition from "./SectionTransition";
import WrappedButton from "./WrappedButton";

/** End-of-Wrapped curtain before the Actual Life album. */
export default function AlbumTeaserCard() {
  return (
    <SectionTransition className="welcome-card album-teaser wrapped-accent-pink" variant="rise">
      <span className="wrapped-kicker">stats · the playlist</span>
      <h2 className="welcome-title album-teaser-title">
        we curated a special playlist for you.
      </h2>
      <p className="welcome-sub">
        actual life (2005–2026) — every friend gets a track.
      </p>
      <div className="wrapped-cta-row">
        <WrappedButton variant="primary" href="/album">
          play the playlist
        </WrappedButton>
      </div>
    </SectionTransition>
  );
}
