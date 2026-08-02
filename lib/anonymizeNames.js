import { memories } from "../data/memories";
import { heartMessages, startingLineup } from "../data/wrappedChapters";

/**
 * Display-layer name anonymization — real names still live in
 * `data/memories.js` / `data/wrappedChapters.js` (and in submitted-memory
 * records) so whoever edits that content later still sees real names there.
 * Every *rendered* name gets swapped for a stable "Friend N" label instead,
 * via `getDisplayName()` — this file is the single source of truth for that
 * mapping so it can't drift between components.
 *
 * Rules:
 *  - "ali" (the birthday honoree) always stays "Ali".
 *  - Family-role labels ("mum", "dad") are kept as roles rather than
 *    numbered — they describe a relationship, not an identifying name.
 *  - Collective/place descriptors ("the cousins", "the group chat",
 *    "everyone", "home", "all of us", etc.) aren't a single person's name,
 *    so they pass through unchanged too.
 *  - Everything else gets "Friend N", numbered by first-seen order across
 *    data/memories.js then data/wrappedChapters.js. Any name not already
 *    known at that point (e.g. one submitted live via the memory form) is
 *    assigned the next free number the first time it's seen, then reuses
 *    that number for the rest of the page's lifetime.
 */

const RELATIONSHIP_LABELS = new Map([
  ["mum", "Mum"],
  ["dad", "Dad"],
]);

const NON_PERSON_LABELS = new Set([
  "the school group",
  "the cousins",
  "the group chat",
  "everyone",
  "all of us",
  "home",
  "unknown",
]);

const normalize = (raw) => (typeof raw === "string" ? raw.trim().toLowerCase() : "");

function buildKnownOrder() {
  const order = [];
  const seen = new Set();

  const add = (raw) => {
    const key = normalize(raw);
    if (!key || seen.has(key) || key === "ali" || RELATIONSHIP_LABELS.has(key) || NON_PERSON_LABELS.has(key)) return;
    seen.add(key);
    order.push(key);
  };

  memories.forEach((memory) => add(memory.person));
  startingLineup.forEach((player) => add(player.name));
  heartMessages.forEach((entry) => add(entry.from));

  return order;
}

const KNOWN_NUMBERS = new Map(buildKnownOrder().map((name, index) => [name, index + 1]));

// Names seen for the first time at runtime (e.g. a friend-submitted memory
// from someone not already in the data files above) get numbered on the fly,
// continuing after the known/static names.
let nextDynamicNumber = KNOWN_NUMBERS.size + 1;
const dynamicNumbers = new Map();

export function getDisplayName(rawName) {
  const key = normalize(rawName);
  if (!key) return typeof rawName === "string" ? rawName : "";

  if (key === "ali") return "Ali";
  if (RELATIONSHIP_LABELS.has(key)) return RELATIONSHIP_LABELS.get(key);
  if (NON_PERSON_LABELS.has(key)) return rawName;

  if (KNOWN_NUMBERS.has(key)) return `Friend ${KNOWN_NUMBERS.get(key)}`;

  if (!dynamicNumbers.has(key)) {
    dynamicNumbers.set(key, nextDynamicNumber);
    nextDynamicNumber += 1;
  }
  return `Friend ${dynamicNumbers.get(key)}`;
}

export function getDisplayNames(rawNames) {
  return Array.isArray(rawNames) ? rawNames.map((name) => getDisplayName(name)) : [];
}
