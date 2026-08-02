import BigStatCard from "./BigStatCard";
import { milesChapter } from "../../data/wrappedChapters";

export default function MilesChapter() {
  return (
    <BigStatCard accent="wrapped-accent-limegreen" kicker="chapter four · miles this year" big={milesChapter.miles.toLocaleString("en-US")}>
      <p className="wrapped-caption">
        {milesChapter.comparison} {milesChapter.motivationalNote}
      </p>
    </BigStatCard>
  );
}
