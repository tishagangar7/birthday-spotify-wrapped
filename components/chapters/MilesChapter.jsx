import BigStatCard from "./BigStatCard";
import { milesChapter } from "../../data/wrappedChapters";

export default function MilesChapter() {
  return (
    <BigStatCard
      accent="wrapped-accent-limegreen"
      kicker="stats · miles ran this year"
      big={
        <span className="runner-miles-stat">
          <span>{milesChapter.miles.toLocaleString("en-US")}</span>
          <span className="runner-miles-unit">miles covered</span>
        </span>
      }
    >
      <p className="wrapped-caption">{milesChapter.motivationalNote}</p>
    </BigStatCard>
  );
}
