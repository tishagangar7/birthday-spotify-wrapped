"use client";

import SectionTransition from "./SectionTransition";

export default function WelcomeCard() {
  return (
    <SectionTransition className="welcome-card wrapped-accent-green" variant="rise">
      <span className="spotify-wordmark">
        <span className="spotify-dot" aria-hidden="true" />
        spotify
      </span>
      <span className="wrapped-kicker">ali’s</span>
      <h1 className="welcome-title">2026 wrapped</h1>
      <p className="welcome-sub">21 years, one archive, way too many songs.</p>
      <p className="welcome-hint">tap or swipe to continue →</p>
    </SectionTransition>
  );
}
