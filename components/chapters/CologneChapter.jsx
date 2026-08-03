"use client";

import { useState } from "react";
import SectionTransition from "../SectionTransition";
import { cologneChapter } from "../../data/wrappedChapters";

export default function CologneChapter() {
  const [revealed, setRevealed] = useState(false);

  return (
    <SectionTransition className="wrapped-card wrapped-accent-purple" variant="rise">
      <span className="wrapped-kicker">{cologneChapter.kicker}</span>
      <div className="wrapped-body">
        <p className="wrapped-order-heading">{cologneChapter.prompt}</p>
        <button
          type="button"
          className="cologne-bottle"
          onClick={(e) => {
            e.stopPropagation();
            setRevealed(true);
          }}
          aria-label="Reveal cologne guess"
        >
          <span className="cologne-bottle-shape" aria-hidden />
          <span className="cologne-bottle-hint">{revealed ? cologneChapter.answer : cologneChapter.hint}</span>
        </button>
        <p className="wrapped-caption">{cologneChapter.bottleNote}</p>
        {!revealed && (
          <p className="wrapped-caption" style={{ opacity: 0.7 }}>
            tap the bottle to reveal
          </p>
        )}
      </div>
    </SectionTransition>
  );
}
