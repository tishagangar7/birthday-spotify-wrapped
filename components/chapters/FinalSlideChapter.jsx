"use client";

import SectionTransition from "../SectionTransition";

export default function FinalSlideChapter() {
  return (
    <SectionTransition className="wrapped-card wrapped-accent-green final-chapter" variant="fade" duration={1.6}>
      <span className="wrapped-kicker">happy 21st</span>
      <div className="wrapped-body">
        <p className="wrapped-title final-headline">
          <span className="final-headline-line">HAPPY BIRTHDAY ALI,</span>
          <br />
          <span className="final-headline-line">WE LOVE YOU ❤️</span>
        </p>
      </div>
    </SectionTransition>
  );
}
