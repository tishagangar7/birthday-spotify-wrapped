import { getDisplayName } from "../../lib/anonymizeNames";
import SectionTransition from "../SectionTransition";

/**
 * Renders the real `memoryTimeline` field from `/api/wrapped` (see
 * useWrappedData in app/page.js) — a genuine chronological 2005–2026 walk
 * through data/memories.js, not curated placeholder content.
 */
export default function GlowUpTimelineChapter({ status, timeline }) {
  const entries = Array.isArray(timeline) ? timeline : [];

  return (
    <SectionTransition className="wrapped-card timeline-chapter wrapped-accent-teal" variant="fade">
      <span className="wrapped-kicker">bonus · glow up timeline</span>
      <div className="wrapped-body">
        <p className="wrapped-caption timeline-intro">2005 → 2026, straight from the archive.</p>
        {status === "loading" ? (
          <p className="wrapped-loading-text">pulling up the timeline…</p>
        ) : entries.length === 0 ? (
          <p className="wrapped-loading-text">
            the timeline’s empty for now — the memories coming up tell the story anyway.
          </p>
        ) : (
          <ol className="timeline-list">
            {entries.map((entry) => (
              <li key={entry.id} className="timeline-item">
                <span className="timeline-year">{entry.year}</span>
                <span className="timeline-text">
                  <span className="timeline-person">{getDisplayName(entry.person)}</span>
                  <span className="timeline-subtitle">{entry.subtitle}</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </SectionTransition>
  );
}
