"use client";

import SectionTransition from "../SectionTransition";
import { pokerChapter } from "../../data/wrappedChapters";

export default function PokerChapter() {
  return (
    <SectionTransition className="wrapped-card wrapped-accent-orange" variant="rise">
      <span className="wrapped-kicker">{pokerChapter.kicker}</span>
      <div className="wrapped-body">
        <ul className="wrapped-facts">
          <li>
            <span className="wrapped-facts-label">lost at {pokerChapter.lostAt}</span>
            <span>{pokerChapter.lostNote}</span>
          </li>
          <li>
            <span className="wrapped-facts-label">won at {pokerChapter.wonAt}</span>
            <span>{pokerChapter.wonNote}</span>
          </li>
        </ul>
        <p className="wrapped-caption" style={{ marginTop: "1.25rem" }}>
          {pokerChapter.punchline}
        </p>
      </div>
    </SectionTransition>
  );
}
