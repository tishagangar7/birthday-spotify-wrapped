"use client";

/**
 * Spotify-lyrics style memory display — one phrase per line, active line bright.
 */
export default function MemoryLyrics({ lines = [], activeIndex = 0, credit }) {
  const safeLines = lines.filter(Boolean);

  if (!safeLines.length) return null;

  return (
    <div className="memory-lyrics" aria-label="memory lyrics">
      {credit ? <p className="memory-lyrics-credit">{credit}</p> : null}
      <div className="memory-lyrics-lines">
        {safeLines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className={`memory-lyrics-line${index === activeIndex ? " is-active" : ""}`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export function splitLyricLines(text) {
  return String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}
