import StaggeredList from "./StaggeredList";
import { topSearches } from "../../data/wrappedChapters";

export default function TopSearchesChapter() {
  const items = topSearches.map((query) => ({ label: `“${query}”` }));

  return (
    <StaggeredList
      accent="wrapped-accent-pink"
      kicker="stats · top searches"
      heading="his search history, allegedly:"
      items={items}
    />
  );
}
