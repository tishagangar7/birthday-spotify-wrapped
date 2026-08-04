import { getDisplayName } from "../../lib/anonymizeNames";
import StaggeredList from "./StaggeredList";
import { startingLineup } from "../../data/wrappedChapters";

export default function StartingLineupChapter() {
  const items = startingLineup.map((player) => ({
    label: getDisplayName(player.name),
    detail: `${player.position} — ${player.note}`,
  }));

  return (
    <StaggeredList
      accent="wrapped-accent-green"
      kicker="stats · starting lineup"
      heading="the starting five, suited up:"
      items={items}
    />
  );
}
