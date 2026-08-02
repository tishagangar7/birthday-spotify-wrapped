import SectionTransition from "../SectionTransition";
import { soundtrackChapter } from "../../data/wrappedChapters";

export default function MusicMomentCard() {
  const { concertMemory, musicMoment } = soundtrackChapter;

  return (
    <SectionTransition className="wrapped-card wrapped-accent-teal" variant="rise">
      <span className="wrapped-kicker">a music memory</span>
      <div className="wrapped-body wrapped-body-stacked">
        <div className="wrapped-moment">
          <p className="wrapped-moment-label">{concertMemory.headline}</p>
          <p className="wrapped-caption">{concertMemory.body}</p>
        </div>
        <div className="wrapped-moment">
          <p className="wrapped-moment-label">{musicMoment.headline}</p>
          <p className="wrapped-caption">{musicMoment.body}</p>
        </div>
      </div>
    </SectionTransition>
  );
}
