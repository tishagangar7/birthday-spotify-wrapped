"use client";

import { useState } from "react";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { cologneChapter } from "../../data/wrappedChapters";

export default function CologneChapter() {
  const [revealed, setRevealed] = useState(false);

  return (
    <SectionTransition className="wrapped-card wrapped-accent-purple story-no-nav" variant="rise">
      <span className="wrapped-kicker">{cologneChapter.kicker}</span>
      <div className="wrapped-body">
        <p className="wrapped-order-heading">{cologneChapter.prompt}</p>
        <button
          type="button"
          className="cologne-bottle"
          onClick={() => setRevealed(true)}
          aria-label="Reveal cologne guess"
        >
          <span className="cologne-bottle-shape" aria-hidden />
          <span className="cologne-bottle-hint">{revealed ? cologneChapter.answer : cologneChapter.hint}</span>
        </button>
        <p className="wrapped-caption">{cologneChapter.bottleNote}</p>
        {!revealed ? (
          <div className="wrapped-cta-row">
            <WrappedButton variant="primary" onClick={() => setRevealed(true)}>
              reveal
            </WrappedButton>
          </div>
        ) : (
          <p className="wrapped-caption">yeah. that tracks.</p>
        )}
      </div>
    </SectionTransition>
  );
}
