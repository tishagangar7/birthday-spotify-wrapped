"use client";

import BigStatCard from "./BigStatCard";
import { personalStats } from "../../data/wrappedChapters";

/** Stack of personal (non-Spotify) stats: Chipotle, mythology, Mo. */
export default function PersonalStatsChapter({ statId }) {
  const stat = personalStats.find((s) => s.id === statId) ?? personalStats[0];

  return (
    <BigStatCard accent={stat.accent} kicker={stat.kicker} big={stat.big} isNumber={stat.isNumber !== false}>
      <p className="wrapped-caption">{stat.caption}</p>
    </BigStatCard>
  );
}
