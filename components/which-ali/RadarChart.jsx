"use client";

import { useReducedMotion } from "framer-motion";

const SIZE = 120;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 42;
const ANGLES = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];

function polar(value, angleIndex) {
  const t = Math.max(0, Math.min(100, Number(value) || 0)) / 100;
  const angle = ANGLES[angleIndex];
  return {
    x: CX + Math.cos(angle) * RADIUS * t,
    y: CY + Math.sin(angle) * RADIUS * t,
  };
}

function ringPoints(scale) {
  return ANGLES.map((angle) => {
    const x = CX + Math.cos(angle) * RADIUS * scale;
    const y = CY + Math.sin(angle) * RADIUS * scale;
    return `${x},${y}`;
  }).join(" ");
}

function labelPos(angleIndex) {
  const angle = ANGLES[angleIndex];
  const r = RADIUS + 18;
  return {
    x: CX + Math.cos(angle) * r,
    y: CY + Math.sin(angle) * r,
  };
}

/**
 * Compact three-axis radar. `entries` = [{ key, label, value }, ...] length 3.
 */
export default function RadarChart({ entries, accent = "#1ed760" }) {
  const reduceMotion = useReducedMotion();
  const safe = [0, 1, 2].map((i) => entries[i] ?? { key: `s${i}`, label: "—", value: 0 });
  const poly = safe
    .map((entry, i) => {
      const { x, y } = polar(entry.value, i);
      return `${x},${y}`;
    })
    .join(" ");

  const shapeKey = safe.map((e) => `${e.key}:${e.value}`).join("|");

  return (
    <svg
      className="which-ali-radar"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      aria-hidden="true"
      focusable="false"
    >
      {[0.35, 0.65, 1].map((scale) => (
        <polygon key={scale} className="which-ali-radar-ring" points={ringPoints(scale)} />
      ))}
      {ANGLES.map((angle, i) => (
        <line
          key={i}
          className="which-ali-radar-axis"
          x1={CX}
          y1={CY}
          x2={CX + Math.cos(angle) * RADIUS}
          y2={CY + Math.sin(angle) * RADIUS}
        />
      ))}
      <polygon
        key={shapeKey}
        className={`which-ali-radar-fill${reduceMotion ? " is-reduced" : ""}`}
        points={poly}
        style={{ fill: accent, stroke: accent }}
      />
      {safe.map((entry, i) => {
        const { x, y } = labelPos(i);
        return (
          <text
            key={entry.key}
            className="which-ali-radar-label"
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {entry.label}
          </text>
        );
      })}
    </svg>
  );
}
