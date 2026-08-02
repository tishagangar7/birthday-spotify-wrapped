import { promises as fs } from "fs";
import path from "path";

/**
 * Persistence layer for friend-submitted memories/messages, submitted via
 * `POST /api/memories` from a friend page's "submit a memory" form (a
 * parallel frontend workstream building an album/playlist-style feature).
 *
 * PERSISTENCE APPROACH & LIMITATIONS (read before relying on this beyond a demo):
 *
 * This project has no database, so submissions are appended to a single JSON
 * file on disk at `data/submitted-memories.json` (a JSON array of memory
 * objects). This keeps the MVP dependency-free and trivially inspectable,
 * but comes with real caveats:
 *
 *   - EPHEMERAL FILESYSTEMS: this repo's README explicitly points at Vercel
 *     for deployment ("Deploy on Vercel"), and `next.config.mjs` sets no
 *     `output: 'standalone'`/`'export'` or custom server — nothing here
 *     rules out a standard serverless deployment. Serverless platforms
 *     (Vercel and most others) run route handlers in ephemeral, often
 *     read-only or per-invocation-isolated filesystems: writes made during
 *     one invocation are NOT guaranteed to be visible to (or even survive
 *     until) the next invocation, and concurrent invocations don't share
 *     disk at all. On such platforms this JSON-file approach will silently
 *     lose data, or throw write errors (e.g. `EROFS`/`EACCES`), which
 *     `addSubmittedMemory` surfaces as a `storage_error` (see route.js).
 *     This approach only durably persists data when the app runs as a
 *     single long-lived Node.js process against a normal, writable,
 *     persistent disk (e.g. `next start` on a VM/container with a
 *     persistent volume, or local development).
 *   - NO CONCURRENCY SAFETY ACROSS PROCESSES/INSTANCES: within a single
 *     Node.js process, writes are serialized via an in-memory queue (see
 *     `withWriteLock` below) so two simultaneous requests in the same
 *     process can't clobber each other's read-modify-write. That protection
 *     does NOT extend across multiple server processes/instances (e.g. a
 *     horizontally scaled deployment) — those would need a real database or
 *     a proper distributed lock instead.
 *   - NOT CRASH-ATOMIC: writes go to a temp file and are then renamed over
 *     the target file (an atomic operation on POSIX filesystems), which
 *     guarantees readers never see a half-written JSON file, but a process
 *     crash between "read existing data" and "rename" can still lose a
 *     concurrent write.
 *
 * Before deploying this anywhere with an ephemeral filesystem (Vercel
 * included), replace this module's storage with a real database (even
 * SQLite on a persistent volume, or a hosted DB) — the public function
 * signatures below (`getSubmittedMemories`, `addSubmittedMemory`) are
 * intentionally the only surface the route handler depends on, so swapping
 * the implementation later shouldn't require touching `app/api/memories/route.js`.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submitted-memories.json");

const MAX_FRIEND_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 2000;

/**
 * @typedef {Object} SubmittedMemory
 * @property {string} id - Server-generated unique id (UUID).
 * @property {string} friendName - Display name of the submitting friend, as entered in the form.
 * @property {string} message - The submitted memory/message text.
 * @property {string} submittedAt - ISO 8601 timestamp of when the server received it.
 */

/** Serializes writes within this process so concurrent requests can't clobber each other's read-modify-write. */
let writeQueue = Promise.resolve();
function withWriteLock(fn) {
  const result = writeQueue.then(fn, fn);
  // Always resolve the shared queue (regardless of this write's outcome) so
  // one failed write doesn't wedge every write that comes after it. Callers
  // still observe their own promise's rejection via `result`.
  writeQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

/**
 * Reads all submitted memories from disk. Returns `[]` if the file doesn't
 * exist yet, or if it contains invalid JSON — a corrupt/missing file should
 * degrade the list to empty rather than break the API. (A corrupt file is
 * left in place on disk for manual inspection rather than being overwritten.)
 *
 * @returns {Promise<SubmittedMemory[]>}
 */
export async function getSubmittedMemories() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    console.warn("submitted-memories.json is missing or contains invalid JSON; returning an empty list.", error);
    return [];
  }
}

/**
 * Derives a unique, alphabetically-sorted list of contributor names from
 * already-submitted memories, for a "Closing Credits" style page. This is a
 * pure, read-only derivation over existing data — no new storage is added.
 * Names are de-duplicated case-insensitively (keeping the casing of each
 * name's first occurrence) and empty/malformed `friendName` values are
 * skipped rather than throwing.
 *
 * @param {SubmittedMemory[]} memories
 * @returns {string[]}
 */
export function getContributorNames(memories) {
  const seen = new Map();

  for (const memory of memories ?? []) {
    const name = typeof memory?.friendName === "string" ? memory.friendName.trim() : "";
    if (!name) continue;

    const key = name.toLowerCase();
    if (!seen.has(key)) seen.set(key, name);
  }

  return [...seen.values()].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

function validateSubmission(input) {
  /** @type {Record<string, string>} */
  const fieldErrors = {};

  if (typeof input?.friendName !== "string" || input.friendName.trim().length === 0) {
    fieldErrors.friendName = "friendName is required.";
  } else if (input.friendName.trim().length > MAX_FRIEND_NAME_LENGTH) {
    fieldErrors.friendName = `friendName must be ${MAX_FRIEND_NAME_LENGTH} characters or fewer.`;
  }

  if (typeof input?.message !== "string" || input.message.trim().length === 0) {
    fieldErrors.message = "message is required.";
  } else if (input.message.trim().length > MAX_MESSAGE_LENGTH) {
    fieldErrors.message = `message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }

  return fieldErrors;
}

/**
 * Validates and appends a new submitted memory to `data/submitted-memories.json`.
 * Rejects empty/missing `friendName` or `message` (after trimming whitespace)
 * without touching disk.
 *
 * @param {{ friendName?: unknown, message?: unknown }} input
 * @returns {Promise<{ ok: true, memory: SubmittedMemory } | { ok: false, fieldErrors: Record<string, string> }>}
 */
export async function addSubmittedMemory(input) {
  const fieldErrors = validateSubmission(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  /** @type {SubmittedMemory} */
  const memory = {
    id: crypto.randomUUID(),
    friendName: input.friendName.trim(),
    message: input.message.trim(),
    submittedAt: new Date().toISOString(),
  };

  await withWriteLock(async () => {
    const existing = await getSubmittedMemories();
    const updated = [...existing, memory];

    await fs.mkdir(DATA_DIR, { recursive: true });

    // Write-to-temp-then-rename: guarantees readers never observe a
    // half-written JSON file, even if the process dies mid-write.
    const tmpFile = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmpFile, JSON.stringify(updated, null, 2), "utf-8");
    await fs.rename(tmpFile, DATA_FILE);
  });

  return { ok: true, memory };
}
