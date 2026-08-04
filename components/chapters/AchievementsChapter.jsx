import StaggeredList from "./StaggeredList";
import { achievements } from "../../data/wrappedChapters";

export default function AchievementsChapter() {
  const items = achievements.map((achievement) => ({ label: achievement.title, detail: achievement.detail }));

  return (
    <StaggeredList
      accent="wrapped-accent-purple"
      kicker="stats · achievements"
      heading="unlocking now:"
      items={items}
      footer="achievement rate: 100%."
    />
  );
}
