# Spotify Wrapped Backend — Setup

Backend-only implementation of an "Ali's 21st Birthday Wrapped" feature: real
Spotify listening stats (via OAuth) blended with personal memory content from
this repo's existing `data/memories.js`, plus a small endpoint for friends to
submit their own memories/messages from a friend page (a separate, parallel
"album/playlist" frontend feature). There is **no UI** in this codebase for
either feature — both are separate frontend workstreams. Everything here is
API routes + server helper modules, isolated from the existing birthday-site
frontend (`components/`, `data/memories.js`, `app/page.js`, `app/layout.js`),
which is untouched.

## What's included

- `app/api/auth/spotify/login/route.js` — `GET`, starts the OAuth flow.
- `app/api/auth/spotify/callback/route.js` — `GET`, completes the OAuth flow.
- `app/api/wrapped/route.js` — `GET`, returns the Wrapped JSON payload.
- `app/api/memories/route.js` — `GET`/`POST`, list/submit friend memories.
- `lib/spotify.js` — Spotify API + OAuth helpers, and the listening-minutes /
  top-genre / personality heuristics.
- `lib/wrappedMemories.js` — reads `data/memories.js` (read-only) and derives
  the personal-memory fields blended into the Wrapped response.
- `lib/wrappedTypes.js` — JSDoc typedefs documenting the Wrapped response shape.
- `lib/submittedMemories.js` — JSON-file persistence for friend-submitted
  memories (see caveats in that file and in the section below).

## 1. Create a Spotify Developer app

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in.
2. Click **Create app**.
3. Fill in an app name/description (anything works, e.g. "Ali Wrapped Dev").
4. Under **Redirect URIs**, add exactly:
   ```
   http://127.0.0.1:3000/api/auth/spotify/callback
   ```
   This must match `SPOTIFY_REDIRECT_URI` below **exactly**, including protocol,
   host, port, and path. If you deploy this app, add the production callback
   URL (e.g. `https://your-domain.com/api/auth/spotify/callback`) as an
   additional Redirect URI.
5. Under **APIs used**, select **Web API**.
6. Save, then open the app's **Settings** to copy the **Client ID** and **Client Secret**.

> Note: newly created Spotify apps in "Development Mode" only work for Spotify
> accounts explicitly added as testers under the app's **User Management**
> settings (this includes the account you log in with yourself). Add any
> accounts you want to test with there.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values from step 1:

```bash
cp .env.example .env.local
```

```bash
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/spotify/callback
```

`.env.local` is already git-ignored — never commit real secrets.

## 3. Run the app

```bash
npm run dev
```

By default this serves on `http://localhost:3000`. Spotify apps generally
require `127.0.0.1` rather than `localhost` for loopback redirect URIs, so
either visit the app at `http://127.0.0.1:3000` or adjust the dev server host
to match whatever you registered in step 1 — the redirect URI must match byte-for-byte.

## 4. Test locally

### Without real Spotify credentials (mock mode)

No setup required. With the dev server running:

```bash
curl "http://127.0.0.1:3000/api/wrapped?mock=true"
```

This returns realistic sample data in the exact same shape the real endpoint
returns, so a consuming UI can be built/tested against the contract without
any OAuth setup.

### With real Spotify credentials (full OAuth flow)

1. Complete steps 1–3 above.
2. In a browser, visit:
   ```
   http://127.0.0.1:3000/api/auth/spotify/login
   ```
3. Log in to Spotify and approve the requested scopes (`user-top-read`,
   `user-read-recently-played`) if prompted.
4. You'll be redirected back to `/?spotify_connected=true` (or `/?spotify_error=...`
   if something went wrong) with your access/refresh tokens now stored in
   httpOnly cookies.
5. Visit or `curl` (with cookies) the wrapped endpoint:
   ```
   http://127.0.0.1:3000/api/wrapped
   ```

If you get a 401 with `"error": "not_authenticated"`, the login step above
either wasn't completed or the cookies weren't sent (e.g. testing from a tool
that doesn't persist cookies — use a browser, or pass `-b`/`-c` cookie jar
flags with `curl`).

## Response shape

See `lib/wrappedTypes.js` for full JSDoc typedefs. Summary:

```jsonc
{
  "totalMinutesEstimate": 78432,
  "topArtists": [
    { "rank": 1, "name": "Phoebe Bridgers", "genres": ["indie folk", "sad girl indie"], "playsOrPopularity": 72 }
    // ...
  ],
  "topSong": { "title": "Motion Sickness", "artist": "Phoebe Bridgers", "album": "Stranger in the Alps" },
  "topGenre": "indie folk",
  "personality": { "title": "The Genre Hopper", "description": "..." },

  // Blended in from data/memories.js — degrade to null/0 if that data is unavailable.
  "topMemory": {
    "id": 21, "person": "ali", "subtitle": "actual life", "year": "2026",
    "date": "oct 04 2026", "location": "here", "color": "blue",
    "message": "these were the first 21 years.", "hasVoiceNote": false
  },
  "totalMemoryCount": 21,
  "highlightedVoiceNote": { "memoryId": 7, "person": "sara", "voiceNote": "..." },
  "memoryYearsSpan": { "from": "2005", "to": "2026" },

  // All memories sorted chronologically (ascending year), for a "Glow Up
  // Timeline" (2005–2026) chapter. Same per-entry shape as topMemory.
  "memoryTimeline": [
    { "id": 1, "person": "tisha", "subtitle": "...", "year": "2005", "date": "...", "location": "...", "color": "red", "message": "...", "hasVoiceNote": false }
    // ...one entry per memory, oldest first
  ]
}
```

## Known limitations / heuristics (by design, documented in code)

- **`totalMinutesEstimate`** is an estimate, not an exact figure — Spotify's
  Web API does not expose lifetime listening minutes. It's derived from the
  last ~50 recently-played tracks (sample size + time span → plays/day rate,
  multiplied by average track length and extrapolated to a year). See the
  comment above `estimateTotalMinutes()` in `lib/spotify.js`.
- **`personality`** is a small rule-based heuristic (genre diversity, average
  artist popularity, dominant listening time-of-day), not a hardcoded value.
  See `derivePersonality()` in `lib/spotify.js`.
- **`topMemory` / `highlightedVoiceNote`** only use fields that already exist
  in `data/memories.js` today. In the current placeholder data every
  `voiceNote` is an empty string, so `highlightedVoiceNote` will be `null`
  and `topMemory` will fall back to the archive's finale entry until real
  voice notes are added to that file.
- **`memoryTimeline`** sorts by the numeric `year` field (ascending); entries
  with a missing/non-numeric `year` sort to the end rather than being dropped.
  See `getMemoryTimeline()` in `lib/wrappedMemories.js`.

## Friend-submitted memories: `/api/memories`

A separate, simpler feature for a friend page where friends can submit their
own memory/message (part of a parallel "album/playlist" frontend workstream).
No OAuth or env vars required — this works out of the box.

### `GET /api/memories`

Lists all submitted memories, most recent first:

```jsonc
{
  "memories": [
    { "id": "b3f1...", "friendName": "sara", "message": "three songs on repeat, remember?", "submittedAt": "2026-08-02T18:03:11.482Z" }
  ],
  "count": 1,
  // Unique friendName values, alphabetically sorted (case-insensitive dedupe) —
  // a thin derivation of `memories`, no new storage. For a "Closing Credits" page.
  "contributors": ["sara"]
}
```

### `POST /api/memories`

Request body:

```jsonc
{ "friendName": "sara", "message": "three songs on repeat, remember?" }
```

Both fields are required and must be non-empty after trimming whitespace
(`friendName` ≤ 80 chars, `message` ≤ 2000 chars).

| Status | Body |
|---|---|
| `201` | `{ "memory": { "id", "friendName", "message", "submittedAt" } }` |
| `400` | `{ "error": "invalid_json", "message": "..." }` — body wasn't valid JSON |
| `400` | `{ "error": "validation_error", "message": "...", "fieldErrors": { "friendName"?: "...", "message"?: "..." } }` |
| `500` | `{ "error": "storage_error", "message": "..." }` — couldn't persist (see caveat below) |

Try it locally:

```bash
curl -s -X POST http://127.0.0.1:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{"friendName":"sara","message":"three songs on repeat, remember?"}'

curl -s http://127.0.0.1:3000/api/memories
```

### Persistence approach & important caveat

There's no database in this project, so submissions are appended to a plain
JSON file at `data/submitted-memories.json` (created on first submission;
git-ignored since it's runtime-generated data, not source data). Writes use a
write-temp-file-then-rename pattern to avoid corrupt partial writes, plus an
in-memory queue so concurrent requests within the same process don't clobber
each other. Full details and limitations are documented at the top of
`lib/submittedMemories.js`.

**This repo's own README recommends deploying to Vercel, and nothing in
`next.config.mjs`/`package.json` overrides that toward a persistent-server
setup (no `output: 'standalone'`, no custom server, no Dockerfile).** Standard
serverless platforms like Vercel run route handlers on ephemeral and/or
read-only filesystems, so **this JSON-file approach will not durably persist
data in that kind of deployment** — writes may throw (surfaced as a `500
storage_error`) or silently vanish between invocations. It only reliably
persists data when running as a single long-lived Node.js process against a
normal writable disk (e.g. local development, or `next start` on a VM/container
with a persistent volume). Before shipping this for real, swap
`lib/submittedMemories.js`'s storage for an actual database — the route
handler only depends on `getSubmittedMemories()`/`addSubmittedMemory()`, so
that swap doesn't require touching `app/api/memories/route.js`.

## Remaining setup needed from you

This was built and tested with `?mock=true` only — the live OAuth path needs:

1. A real Spotify Developer app (step 1 above) — I don't have credentials to create or test one.
2. Real `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` / `SPOTIFY_REDIRECT_URI` in `.env.local`.
3. If deploying anywhere other than `127.0.0.1:3000`, an additional Redirect
   URI registered on the Spotify app matching that deployment's callback URL.
