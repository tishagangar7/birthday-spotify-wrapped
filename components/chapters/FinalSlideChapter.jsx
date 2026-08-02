import SectionTransition from "../SectionTransition";
import { finalSlide } from "../../data/wrappedChapters";

export default function FinalSlideChapter() {
  return (
    <SectionTransition className="wrapped-card wrapped-accent-green final-chapter" variant="fade" duration={1.6}>
      <span className="wrapped-kicker">chapter eight</span>
      <div className="wrapped-body">
        <p className="wrapped-title final-headline">{finalSlide.headline}</p>
        <p className="wrapped-caption final-body">{finalSlide.body}</p>
      </div>
    </SectionTransition>
  );
}
