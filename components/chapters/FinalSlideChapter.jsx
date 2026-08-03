"use client";

import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { useStoryDeckNav } from "../StoryDeckContext";
import { finalSlide } from "../../data/wrappedChapters";

export default function FinalSlideChapter() {
  const nav = useStoryDeckNav();

  return (
    <SectionTransition className="wrapped-card wrapped-accent-green final-chapter" variant="fade" duration={1.6}>
      <span className="wrapped-kicker">chapter eight</span>
      <div className="wrapped-body">
        <p className="wrapped-title final-headline">{finalSlide.headline}</p>
        <p className="wrapped-caption final-body">{finalSlide.body}</p>
        <div className="wrapped-cta-row">
          <WrappedButton variant="primary" onClick={() => nav?.goToId("credits-closing")}>
            see credits
          </WrappedButton>
        </div>
      </div>
    </SectionTransition>
  );
}
