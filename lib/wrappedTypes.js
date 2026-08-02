/**
 * Shared type definitions for the Spotify Wrapped backend feature.
 *
 * This file has no runtime exports of its own — it exists purely so the
 * `/api/wrapped` JSON response shape is documented in one place that both
 * backend code and the (separately built) Wrapped UI/design work can refer
 * to. Import the typedefs with:
 *
 *   /** @type {import('@/lib/wrappedTypes').WrappedResponse} *\/
 *
 * Keep this file in sync with `buildWrappedResponse()` / `getMockWrappedResponse()`
 * in `lib/spotify.js` — those are the source of truth at runtime.
 */

/**
 * A single entry in the top artists list, ranked by the user's Spotify
 * "top artists" endpoint (long-term time range by default).
 *
 * @typedef {Object} WrappedTopArtist
 * @property {number} rank - 1-indexed rank, 1 = most-listened artist.
 * @property {string} name - Artist display name.
 * @property {string[]} genres - Genres Spotify associates with this artist (may be empty).
 * @property {number} playsOrPopularity - Spotify's 0-100 "popularity" score for the
 *   artist. This is used as a stand-in for play count/frequency because the Spotify
 *   Web API does not expose per-user play counts for artists — popularity is the
 *   closest available signal. Named `playsOrPopularity` to make this substitution
 *   explicit to consumers of the API.
 */

/**
 * The user's single most-played track (from the "top tracks" endpoint).
 *
 * @typedef {Object} WrappedTopSong
 * @property {string} title - Track name.
 * @property {string} artist - Primary artist name for the track.
 * @property {string} album - Album name the track appears on.
 */

/**
 * A lightweight, heuristically-derived "listening personality" label, akin to
 * a Myers-Briggs-style card in Spotify Wrapped. See `derivePersonality()` in
 * `lib/spotify.js` for exactly how this is computed.
 *
 * @typedef {Object} WrappedPersonality
 * @property {string} title - Short archetype name, e.g. "The Genre Hopper".
 * @property {string} description - One or two sentence explanation, safe to render as-is in a UI card.
 */

/**
 * A featured/"top" personal memory pulled from `data/memories.js`, for the
 * "Ali's 21st Birthday Wrapped" hybrid concept. Field names mirror the real
 * fields on a memory object in `data/memories.js` — no fields are invented.
 *
 * @typedef {Object} WrappedTopMemory
 * @property {number|null} id - Matches `memory.id` from `data/memories.js`.
 * @property {string} person - Matches `memory.person`.
 * @property {string} subtitle - Matches `memory.subtitle`.
 * @property {string} year - Matches `memory.year`.
 * @property {string} date - Matches `memory.date`.
 * @property {string} location - Matches `memory.location`.
 * @property {string} color - Matches `memory.color`.
 * @property {string} message - Matches `memory.message`.
 * @property {boolean} hasVoiceNote - True if `memory.voiceNote` is a non-empty string.
 */

/**
 * A pointer to a memory whose `voiceNote` field is populated, so a UI can
 * surface "here's a voice note worth listening to" alongside the Wrapped cards.
 *
 * @typedef {Object} WrappedHighlightedVoiceNote
 * @property {number|null} memoryId - The source memory's `id`.
 * @property {string} person - The source memory's `person`.
 * @property {string} voiceNote - The raw `voiceNote` value from that memory.
 */

/**
 * The earliest/latest `year` values found across all memories, derived
 * directly from real data — a nod to the "21 years" birthday framing.
 *
 * @typedef {Object} WrappedMemoryYearsSpan
 * @property {string} from
 * @property {string} to
 */

/**
 * The subset of `WrappedResponse` contributed by `lib/wrappedMemories.js`
 * (i.e. everything blended in from `data/memories.js`).
 *
 * @typedef {Object} WrappedMemoriesBlend
 * @property {WrappedTopMemory | null} topMemory
 * @property {number} totalMemoryCount
 * @property {WrappedHighlightedVoiceNote | null} highlightedVoiceNote
 * @property {WrappedMemoryYearsSpan | null} memoryYearsSpan
 * @property {WrappedTopMemory[]} memoryTimeline - All memories sorted chronologically
 *   (ascending by `year`) for a "Glow Up Timeline" (2005–2026) style chapter. Same
 *   per-entry shape as `topMemory`. Empty array if `data/memories.js` is unavailable.
 */

/**
 * Full response shape returned by `GET /api/wrapped` (and by `GET /api/wrapped?mock=true`).
 * Both the real and mock code paths return exactly this shape. The
 * `topArtists` → `personality` fields come from Spotify (see `lib/spotify.js`);
 * the `topMemory` → `memoryYearsSpan` fields are blended in from the existing
 * birthday-site data in `data/memories.js` (see `lib/wrappedMemories.js`) and
 * degrade to `null`/`0` rather than failing the request if that data is
 * unavailable or missing a field.
 *
 * @typedef {Object} WrappedResponse
 * @property {number} totalMinutesEstimate - Estimated total minutes listened. This is a
 *   heuristic extrapolation, NOT an exact figure — see the estimation method documented
 *   above `estimateTotalMinutes()` in `lib/spotify.js`.
 * @property {WrappedTopArtist[]} topArtists - Ranked list of top artists (typically 5-10).
 * @property {WrappedTopSong} topSong - The user's #1 most-played track.
 * @property {string} topGenre - The single genre that appears most often across the user's top artists.
 * @property {WrappedPersonality} personality - Derived "listening personality" card content.
 * @property {WrappedTopMemory | null} topMemory - Featured memory from `data/memories.js`
 *   (the memory with a voice note if one exists, otherwise the archive's finale entry).
 *   `null` if `data/memories.js` is unavailable or empty.
 * @property {number} totalMemoryCount - Number of entries in the `memories` array. `0` if unavailable.
 * @property {WrappedHighlightedVoiceNote | null} highlightedVoiceNote - First memory with a
 *   non-empty `voiceNote`, or `null` if none exists / data unavailable.
 * @property {WrappedMemoryYearsSpan | null} memoryYearsSpan - Min/max `year` across all
 *   memories, or `null` if unavailable.
 * @property {WrappedTopMemory[]} memoryTimeline - Every memory sorted chronologically
 *   (ascending by `year`), for a "Glow Up Timeline" (2005–2026) chapter. `[]` if
 *   `data/memories.js` is unavailable — see `getMemoryTimeline()` in `lib/wrappedMemories.js`.
 */

export {};
