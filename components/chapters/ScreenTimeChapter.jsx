import BigStatCard from "./BigStatCard";
import { screenTime } from "../../data/wrappedChapters";

export default function ScreenTimeChapter() {
  return (
    <BigStatCard accent="wrapped-accent-orange" kicker="stats · screen time" big={`${screenTime.hoursPerDay}h`}>
      <p className="wrapped-caption">
        average daily screen time. most-used app: {screenTime.mostUsedApp}. {screenTime.funnyNote}
      </p>
    </BigStatCard>
  );
}
