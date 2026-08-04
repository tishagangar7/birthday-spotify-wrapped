import BigStatCard from "./BigStatCard";
import { talkingChapter } from "../../data/wrappedChapters";

export default function TalkingMinutesChapter() {
  return (
    <BigStatCard accent="wrapped-accent-pink" kicker="chapter five · minutes spent talking" big={talkingChapter.minutes.toLocaleString("en-US")}>
      <p className="wrapped-caption">{talkingChapter.comparison}</p>
    </BigStatCard>
  );
}
