"use client";

import RadarChart from "./RadarChart";

function toEntries(stats = {}) {
  return Object.entries(stats)
    .slice(0, 3)
    .map(([key, value]) => ({
      key,
      label: String(key).toUpperCase(),
      value: Number(value) || 0,
    }));
}

/**
 * Radar (left) + numeric legend (right). Uses display:contents so panels
 * participate in the parent arcade layout grid.
 */
export default function CharacterStats({ archetype }) {
  const entries = toEntries(archetype?.stats);
  const accent = archetype?.accent || "#1ed760";

  return (
    <div className="which-ali-stats-panels">
      <div className="which-ali-stat-panel which-ali-stat-panel--radar">
        <RadarChart entries={entries} accent={accent} />
      </div>
      <ul
        className="which-ali-stat-panel which-ali-stat-panel--legend"
        aria-label="Character stats"
      >
        {entries.map((entry) => (
          <li key={entry.key} className="which-ali-stat-row">
            <span className="which-ali-stat-label">{entry.label}</span>
            <span className="which-ali-stat-value">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
