import SectionTransition from "../SectionTransition";
import { talkingChapter } from "../../data/wrappedChapters";

/** Minutes spent talking — big centered stat, no video. */
export default function TalkingMinutesChapter() {
  return (
    <SectionTransition
      className="wrapped-card wrapped-accent-pink talking-minutes-chapter"
      variant="rise"
    >
      <div className="talking-stats is-visible" aria-live="polite">
        <div className="talking-stats-hero">
          <span className="wrapped-kicker">stats · talking</span>
          <p className="wrapped-number talking-stats-number">
            <span className="talking-stats-number-line">{talkingChapter.minutesLabel}</span>
          </p>
          <p className="wrapped-caption talking-stats-caption">
            {talkingChapter.comparison}
          </p>
        </div>
      </div>
    </SectionTransition>
  );
}
