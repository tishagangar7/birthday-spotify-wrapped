import { getDisplayName } from "../../lib/anonymizeNames";
import SectionTransition from "../SectionTransition";
import { heartMessages } from "../../data/wrappedChapters";

/**
 * The emotional turn — softer, slower, more sincere than the punchy chapters
 * before it. Accepts an optional `topMemory` (from the real /api/wrapped
 * blend, when the backend provides it) to fold a genuine archive memory in
 * alongside the curated messages.
 */
export default function HeartSizeChapter({ topMemory }) {
  const messages = topMemory
    ? [...heartMessages, { from: topMemory.person, message: topMemory.message }]
    : heartMessages;

  return (
    <SectionTransition className="wrapped-card wrapped-accent-pink heart-chapter" variant="fade" duration={1.4}>
      <span className="wrapped-kicker">stats · heart</span>
      <div className="wrapped-body">
        <div className="heart-messages">
          {messages.map((entry, index) => (
            <p className="heart-message" key={`${entry.from}-${index}`}>
              <span className="heart-message-text">“{entry.message}”</span>
              <span className="heart-message-from">— {getDisplayName(entry.from)}</span>
            </p>
          ))}
        </div>
      </div>
    </SectionTransition>
  );
}
