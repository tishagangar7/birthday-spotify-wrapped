import SectionTransition from "../SectionTransition";
import { predictions } from "../../data/wrappedChapters";

export default function PredictionsChapter() {
  return (
    <SectionTransition className="wrapped-card wrapped-accent-limegreen" variant="rise">
      <span className="wrapped-kicker">stats · predictions</span>
      <div className="wrapped-body">
        <p className="wrapped-order-heading">calling it now:</p>
        <ul className="wrapped-facts predictions-list">
          {predictions.map((prediction) => (
            <li key={prediction}>{prediction}</li>
          ))}
        </ul>
      </div>
    </SectionTransition>
  );
}
