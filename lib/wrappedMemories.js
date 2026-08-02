/**
 * Blends personal birthday/memory content from the existing `data/memories.js`
 * (used by the unrelated birthday-site frontend — Intro/Memory/Finale/FoundYou/etc.)
 * into the Spotify Wrapped response, for the "Ali's 21st Birthday Wrapped" hybrid concept.
 *
 * IMPORTANT: this module only ever *reads* `data/memories.js` — it never modifies it,
 * and it makes no assumptions beyond the fields that file actually exports today
 * (`id`, `person`, `subtitle`, `year`, `date`, `location`, `color`, `message`, `voiceNote`).
 *
 * Fail-safe by design: every exported function here degrades to safe empty
 * defaults instead of throwing, so a problem loading/parsing memory data can
 * never break `/api/wrapped`. See `WrappedTopMemory`, `WrappedHighlightedVoiceNote`,
 * and `WrappedMemoryYearsSpan` in `lib/wrappedTypes.js` for the shapes produced here.
 */

const EMPTY_BLEND = {
  topMemory: null,
  totalMemoryCount: 0,
  highlightedVoiceNote: null,
  memoryYearsSpan: null,
  memoryTimeline: [],
};

function hasVoiceNote(memory) {
  return typeof memory?.voiceNote === "string" && memory.voiceNote.trim().length > 0;
}

function toTopMemoryShape(memory) {
  if (!memory || typeof memory !== "object") return null;
  return {
    id: typeof memory.id === "number" ? memory.id : null,
    person: memory.person ?? "unknown",
    subtitle: memory.subtitle ?? "",
    year: memory.year ?? "",
    date: memory.date ?? "",
    location: memory.location ?? "",
    color: memory.color ?? "",
    message: memory.message ?? "",
    hasVoiceNote: hasVoiceNote(memory),
  };
}

/**
 * Picks the "featured" memory to surface as `topMemory`:
 *   1. Prefer the first memory with a non-empty `voiceNote` — the richest,
 *      most personal artifact available in the data.
 *   2. Otherwise fall back to the last entry in the archive, which is
 *      structurally the finale/most-recent memory (`data/memories.js` orders
 *      memories chronologically).
 */
function pickFeaturedMemory(memories) {
  const withVoiceNote = memories.find(hasVoiceNote);
  if (withVoiceNote) return withVoiceNote;
  return memories[memories.length - 1] ?? null;
}

function findHighlightedVoiceNote(memories) {
  const memory = memories.find(hasVoiceNote);
  if (!memory) return null;
  return {
    memoryId: typeof memory.id === "number" ? memory.id : null,
    person: memory.person ?? "unknown",
    voiceNote: memory.voiceNote,
  };
}

function computeYearsSpan(memories) {
  const years = memories.map((m) => Number(m?.year)).filter((year) => Number.isFinite(year));
  if (years.length === 0) return null;
  return { from: String(Math.min(...years)), to: String(Math.max(...years)) };
}

/**
 * Chronological comparator for memories, for the "Glow Up Timeline" chapter
 * (2005–2026). Sorts primarily by the numeric `year` field; memories with a
 * missing/non-numeric `year` sort to the end rather than throwing or being
 * dropped. Ties (including entries with no year at all) fall back to array
 * order, which `data/memories.js` already produces chronologically.
 */
function compareMemoriesChronologically(a, b) {
  const yearA = Number(a?.year);
  const yearB = Number(b?.year);
  const hasYearA = Number.isFinite(yearA);
  const hasYearB = Number.isFinite(yearB);

  if (hasYearA && hasYearB && yearA !== yearB) return yearA - yearB;
  if (hasYearA !== hasYearB) return hasYearA ? -1 : 1;
  return 0; // equal year (or both missing) — preserve original relative order
}

/**
 * Builds a chronologically sorted timeline of all memories, for a "Glow Up
 * Timeline" style chapter. Reuses the same per-entry shape as `topMemory`
 * (`WrappedTopMemory`) so a timeline UI and a single "featured memory" card
 * can share rendering logic.
 *
 * @param {Array<Object>} memories
 * @returns {import('./wrappedTypes').WrappedTopMemory[]}
 */
export function getMemoryTimeline(memories) {
  if (!Array.isArray(memories)) return [];

  return [...memories]
    .sort(compareMemoriesChronologically)
    .map(toTopMemoryShape)
    .filter((memory) => memory !== null);
}

/**
 * Loads `data/memories.js` and derives the memory-blend fields for `/api/wrapped`.
 * Never throws: any failure (module missing, unexpected export shape, bad field
 * data) resolves to `EMPTY_BLEND` instead.
 *
 * @returns {Promise<import('./wrappedTypes').WrappedMemoriesBlend>}
 */
export async function getMemoriesBlend() {
  let memories;
  try {
    // Dynamic import (rather than a static one) so a missing/broken
    // data/memories.js degrades gracefully at request time instead of
    // taking down the whole module graph.
    const mod = await import("../data/memories.js");
    memories = mod?.memories;
  } catch (error) {
    console.warn("Spotify Wrapped: could not load data/memories.js — omitting memory blend.", error);
    return EMPTY_BLEND;
  }

  if (!Array.isArray(memories) || memories.length === 0) {
    return EMPTY_BLEND;
  }

  try {
    return {
      topMemory: toTopMemoryShape(pickFeaturedMemory(memories)),
      totalMemoryCount: memories.length,
      highlightedVoiceNote: findHighlightedVoiceNote(memories),
      memoryYearsSpan: computeYearsSpan(memories),
      memoryTimeline: getMemoryTimeline(memories),
    };
  } catch (error) {
    console.warn("Spotify Wrapped: failed to derive memory blend fields — omitting memory blend.", error);
    return EMPTY_BLEND;
  }
}

/**
 * Mock version of the memory blend, used by `GET /api/wrapped?mock=true`.
 * Shape matches `getMemoriesBlend()` exactly so the two modes are interchangeable.
 *
 * Note: `memoryTimeline` below is a short illustrative excerpt (not all 21
 * entries) — it's meant to verify the response shape/ordering contract for a
 * "Glow Up Timeline" chapter, not to numerically match `totalMemoryCount`.
 */
export function getMockMemoriesBlend() {
  return {
    topMemory: {
      id: 21,
      person: "ali",
      subtitle: "actual life",
      year: "2026",
      date: "oct 04 2026",
      location: "here",
      color: "blue",
      message: "these were the first 21 years.",
      hasVoiceNote: false,
    },
    totalMemoryCount: 21,
    highlightedVoiceNote: {
      memoryId: 7,
      person: "sara",
      voiceNote: "voice-note-sara-three-songs-on-repeat.m4a",
    },
    memoryYearsSpan: { from: "2005", to: "2026" },
    memoryTimeline: [
      { id: 1, person: "tisha", subtitle: "before any of us knew what we were doing", year: "2005", date: "oct 04 2005", location: "home", color: "red", message: "a placeholder from the archive.", hasVoiceNote: false },
      { id: 2, person: "mum", subtitle: "the first camera roll", year: "2006", date: "apr 16 2008", location: "the back garden", color: "yellow", message: "a placeholder from the archive.", hasVoiceNote: false },
      { id: 7, person: "sara", subtitle: "three songs on repeat", year: "2011", date: "sep 02 2018", location: "somebody's kitchen", color: "yellow", message: "a placeholder from the archive.", hasVoiceNote: true },
      { id: 12, person: "leah", subtitle: "the long way home", year: "2016", date: "feb 05 2022", location: "walking home", color: "blue", message: "a placeholder from the archive.", hasVoiceNote: false },
      { id: 18, person: "the group chat", subtitle: "do not zoom in", year: "2022", date: "feb 22 2025", location: "platform 4", color: "blue", message: "a placeholder from the archive.", hasVoiceNote: false },
      { id: 21, person: "ali", subtitle: "actual life", year: "2025", date: "oct 04 2026", location: "here", color: "blue", message: "these were the first 21 years.", hasVoiceNote: false },
    ],
  };
}
