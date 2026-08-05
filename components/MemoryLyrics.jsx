"use client";

/**
 * Spotify-lyrics style memory display — one short line at a time, active line bright.
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

/** Soft lyric line length — short rows, not whole sentences. */
const WORDS_PER_LINE = 6;

/**
 * Prefer explicit newlines. Otherwise wrap prose into short lyric lines
 * by word count — never by sentence endings.
 */
export function splitLyricLines(text) {
  const blocks = String(text || "")
    .split(/\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  const lines = [];

  for (const block of blocks) {
    const words = block.split(/\s+/).filter(Boolean);
    if (words.length <= WORDS_PER_LINE) {
      lines.push(block);
      continue;
    }
    for (let i = 0; i < words.length; i += WORDS_PER_LINE) {
      lines.push(words.slice(i, i + WORDS_PER_LINE).join(" "));
    }
  }

  return lines;
}
