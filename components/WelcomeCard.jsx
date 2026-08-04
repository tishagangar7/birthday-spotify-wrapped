"use client";

import SectionTransition from "./SectionTransition";
import WrappedButton from "./WrappedButton";
import { useStoryDeckNav } from "./StoryDeckContext";

/** Figma frame: 01 Intro — ALI'S 21ST WRAPPED (replaces old actual-life cover) */
export default function WelcomeCard({ onStart }) {
  const nav = useStoryDeckNav();

  return (
    <SectionTransition className="welcome-card wrapped-accent-green" variant="rise">
      <span className="wrapped-kicker">stats · ali</span>
      <h1 className="welcome-title welcome-title-figma">
        <span className="welcome-21st">21st</span>
        <span className="welcome-wrapped">wrapped</span>
      </h1>
      <p className="welcome-sub">made w love by the rotation</p>
      <div className="wrapped-cta-row">
        <WrappedButton
          variant="primary"
          onClick={() => {
            onStart?.();
            nav?.goToId("top-songs");
          }}
        >
          start wrapped
        </WrappedButton>
      </div>
      <span className="spotify-wordmark welcome-wordmark">
        <span className="spotify-dot" aria-hidden="true" />
        spotify
      </span>
    </SectionTransition>
  );
}
