"use client";

import SectionTransition from "../SectionTransition";
import { useStoryDeckNav } from "../StoryDeckContext";

/**
 * Table-of-contents card — a navigable index of every chapter. Tapping an
 * item jumps the deck straight there (non-linear), via the StoryDeck context
 * (see StoryDeckContext.js / StoryDeck.jsx). `chapters` is the single source
 * of truth for the deck's chapter order, passed down from app/page.js so
 * this list can never drift out of sync with the actual card ids.
 */
export default function ChapterMenu({ chapters }) {
  const nav = useStoryDeckNav();

  return (
    <SectionTransition className="wrapped-card chapter-menu wrapped-accent-purple" variant="rise">
      <span className="wrapped-kicker">table of contents</span>
      <div className="wrapped-body">
        <p className="chapter-menu-heading">jump to any chapter</p>
        <ol className="chapter-menu-list">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <button
                type="button"
                className="chapter-menu-item"
                onClick={() => nav?.goToId(chapter.id)}
              >
                <span className="wrapped-rank">{index + 1}</span>
                <span className="chapter-menu-text">
                  <span className="chapter-menu-title">{chapter.title}</span>
                  {chapter.subtitle ? <span className="chapter-menu-subtitle">{chapter.subtitle}</span> : null}
                </span>
                <span className="chapter-menu-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </SectionTransition>
  );
}
