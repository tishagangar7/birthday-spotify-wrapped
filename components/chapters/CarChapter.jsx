import SectionTransition from "../SectionTransition";
import { carChapter } from "../../data/wrappedChapters";

export default function CarChapter() {
  const { dreamCar, currentCar, drivingHabit, funnyOpinion } = carChapter;

  return (
    <SectionTransition className="wrapped-card wrapped-accent-orange" variant="rise">
      <span className="wrapped-kicker">chapter two · main character vehicle</span>
      <div className="wrapped-body">
        <p className="wrapped-title">{dreamCar}</p>
        <ul className="wrapped-facts">
          <li>
            <span className="wrapped-facts-label">currently drives</span>
            <span>{currentCar}</span>
          </li>
          <li>
            <span className="wrapped-facts-label">driving habit</span>
            <span>{drivingHabit}</span>
          </li>
          <li>
            <span className="wrapped-facts-label">will die on this hill</span>
            <span>{funnyOpinion}</span>
          </li>
        </ul>
      </div>
    </SectionTransition>
  );
}
