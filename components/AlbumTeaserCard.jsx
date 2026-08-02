"use client";

import Link from "next/link";
import AlbumCoverArt from "./AlbumCoverArt";
import SectionTransition from "./SectionTransition";

export default function AlbumTeaserCard() {
  return (
    <SectionTransition className="welcome-card album-teaser wrapped-accent-pink" variant="rise">
      <AlbumCoverArt variant="hero" size="medium" />
      <span className="wrapped-kicker">the full album</span>
      <h2 className="welcome-title album-teaser-title">actual life (2005–2026)</h2>
      <p className="welcome-sub">fred again.. · ali remix — every friend gets a track. tap in to hear from them.</p>
      <Link href="/album" className="album-teaser-link">
        open the tracklist →
      </Link>
    </SectionTransition>
  );
}
