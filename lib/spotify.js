/**
 * Spotify Web API integration helpers for the "Spotify Wrapped" backend feature.
 *
 * This module is intentionally self-contained (no database) so the whole
 * feature can be reviewed/tested in isolation from the rest of the app:
 *   - OAuth Authorization Code flow helpers (`buildAuthorizeUrl`, `exchangeCodeForTokens`,
 *     `refreshAccessToken`)
 *   - Cookie-based session helpers (`getValidAccessToken`, `setSpotifyAuthCookies`,
 *     `clearSpotifyAuthCookies`)
 *   - Spotify Web API fetchers (`fetchTopArtists`, `fetchTopTracks`, `fetchRecentlyPlayed`)
 *   - Pure heuristic functions that turn raw Spotify data into the Wrapped response
 *     shape (`estimateTotalMinutes`, `deriveTopGenre`, `derivePersonality`, `buildWrappedResponse`)
 *   - `getMockWrappedResponse` for local testing without real Spotify credentials.
 *
 * See `lib/wrappedTypes.js` for the JSDoc typedefs describing the response shape.
 */

const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

/** Scopes required for top artists/tracks + recently played. */
const SPOTIFY_SCOPES = ["user-top-read", "user-read-recently-played"];

/** Cookie names used to persist the user's Spotify session (no database, MVP-only). */
export const SPOTIFY_ACCESS_TOKEN_COOKIE = "spotify_access_token";
export const SPOTIFY_REFRESH_TOKEN_COOKIE = "spotify_refresh_token";
export const SPOTIFY_TOKEN_EXPIRES_AT_COOKIE = "spotify_token_expires_at";
export const SPOTIFY_OAUTH_STATE_COOKIE = "spotify_oauth_state";

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example / BACKEND_SETUP.md.`
    );
  }
  return value;
}

/**
 * Step 1 of the Authorization Code flow: build the URL the user should be
 * redirected to so they can log in to Spotify and approve the requested scopes.
 *
 * @param {string} state - Opaque CSRF-protection value; verify it matches on callback.
 * @returns {string}
 */
export function buildAuthorizeUrl(state) {
  const clientId = getRequiredEnv("SPOTIFY_CLIENT_ID");
  const redirectUri = getRequiredEnv("SPOTIFY_REDIRECT_URI");

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: SPOTIFY_SCOPES.join(" "),
    state,
    show_dialog: "false",
  });

  return `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`;
}

function basicAuthHeader() {
  const clientId = getRequiredEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = getRequiredEnv("SPOTIFY_CLIENT_SECRET");
  return "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

/**
 * Step 2 of the Authorization Code flow: exchange the `code` query param
 * Spotify redirected back with for an access token + refresh token.
 *
 * @param {string} code
 * @returns {Promise<{ access_token: string, refresh_token: string, expires_in: number, token_type: string, scope: string }>}
 */
export async function exchangeCodeForTokens(code) {
  const redirectUri = getRequiredEnv("SPOTIFY_REDIRECT_URI");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Spotify token exchange failed (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * Uses a refresh token to obtain a new access token once the previous one expires.
 * Spotify may or may not rotate the refresh token itself; callers should keep the
 * existing refresh token unless a new one is returned.
 *
 * @param {string} refreshToken
 * @returns {Promise<{ access_token: string, refresh_token?: string, expires_in: number, token_type: string, scope?: string }>}
 */
export async function refreshAccessToken(refreshToken) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Spotify token refresh failed (${response.status}): ${text}`);
  }

  return response.json();
}

const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days; refresh token long outlives the access token

function authCookieOptions(maxAgeSeconds) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/**
 * Persists a fresh set of Spotify tokens into httpOnly cookies on the given
 * Next.js cookie store (from `next/headers` `cookies()`, used inside a Route Handler).
 *
 * @param {Awaited<ReturnType<import('next/headers').cookies>>} cookieStore
 * @param {{ accessToken: string, refreshToken: string, expiresIn: number }} tokens
 */
export function setSpotifyAuthCookies(cookieStore, { accessToken, refreshToken, expiresIn }) {
  const expiresAt = Date.now() + expiresIn * 1000;

  cookieStore.set(SPOTIFY_ACCESS_TOKEN_COOKIE, accessToken, authCookieOptions(expiresIn));
  cookieStore.set(
    SPOTIFY_TOKEN_EXPIRES_AT_COOKIE,
    String(expiresAt),
    authCookieOptions(AUTH_COOKIE_MAX_AGE_SECONDS)
  );
  if (refreshToken) {
    cookieStore.set(SPOTIFY_REFRESH_TOKEN_COOKIE, refreshToken, authCookieOptions(AUTH_COOKIE_MAX_AGE_SECONDS));
  }
}

/** Clears all Spotify session cookies (e.g. on logout or invalid refresh token). */
export function clearSpotifyAuthCookies(cookieStore) {
  cookieStore.delete(SPOTIFY_ACCESS_TOKEN_COOKIE);
  cookieStore.delete(SPOTIFY_REFRESH_TOKEN_COOKIE);
  cookieStore.delete(SPOTIFY_TOKEN_EXPIRES_AT_COOKIE);
}

/** Small buffer so we refresh slightly before actual expiry, avoiding races. */
const EXPIRY_BUFFER_MS = 60 * 1000;

/**
 * Returns a valid (non-expired) access token for the current request, refreshing
 * it via the refresh token and updating cookies if necessary.
 *
 * @param {Awaited<ReturnType<import('next/headers').cookies>>} cookieStore
 * @returns {Promise<{ accessToken: string | null, refreshToken: string | null }>}
 */
export async function getValidAccessToken(cookieStore) {
  const accessToken = cookieStore.get(SPOTIFY_ACCESS_TOKEN_COOKIE)?.value ?? null;
  const refreshToken = cookieStore.get(SPOTIFY_REFRESH_TOKEN_COOKIE)?.value ?? null;
  const expiresAt = Number(cookieStore.get(SPOTIFY_TOKEN_EXPIRES_AT_COOKIE)?.value ?? 0);

  if (!refreshToken) {
    return { accessToken: null, refreshToken: null };
  }

  const isExpired = !accessToken || Date.now() >= expiresAt - EXPIRY_BUFFER_MS;
  if (!isExpired) {
    return { accessToken, refreshToken };
  }

  const refreshed = await refreshAccessToken(refreshToken);
  const nextRefreshToken = refreshed.refresh_token ?? refreshToken;

  setSpotifyAuthCookies(cookieStore, {
    accessToken: refreshed.access_token,
    refreshToken: nextRefreshToken,
    expiresIn: refreshed.expires_in,
  });

  return { accessToken: refreshed.access_token, refreshToken: nextRefreshToken };
}

async function spotifyApiGet(pathAndQuery, accessToken) {
  const response = await fetch(`${SPOTIFY_API_BASE}${pathAndQuery}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Spotify API request to ${pathAndQuery} failed (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * Fetches the user's top artists.
 * @param {string} accessToken
 * @param {{ timeRange?: 'short_term'|'medium_term'|'long_term', limit?: number }} [options]
 */
export async function fetchTopArtists(accessToken, { timeRange = "long_term", limit = 10 } = {}) {
  const data = await spotifyApiGet(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
  return data.items ?? [];
}

/**
 * Fetches the user's top tracks.
 * @param {string} accessToken
 * @param {{ timeRange?: 'short_term'|'medium_term'|'long_term', limit?: number }} [options]
 */
export async function fetchTopTracks(accessToken, { timeRange = "long_term", limit = 10 } = {}) {
  const data = await spotifyApiGet(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
  return data.items ?? [];
}

/**
 * Fetches the user's most recently played tracks (Spotify caps this endpoint
 * at the last 50 plays, regardless of `limit`).
 * @param {string} accessToken
 * @param {{ limit?: number }} [options]
 */
export async function fetchRecentlyPlayed(accessToken, { limit = 50 } = {}) {
  const data = await spotifyApiGet(`/me/player/recently-played?limit=${limit}`, accessToken);
  return data.items ?? [];
}

// ---------------------------------------------------------------------------
// Heuristic derivations
// ---------------------------------------------------------------------------

/**
 * Estimates total minutes listened.
 *
 * ESTIMATION METHOD (documented per requirement — Spotify's API does not expose
 * exact lifetime listening minutes for a user, so this is a heuristic):
 *
 *   1. Take the "recently played" sample (up to the last 50 plays Spotify will
 *      return) and compute the time span it covers, from the oldest to the
 *      newest `played_at` timestamp in the sample.
 *   2. Compute a "plays per day" rate: sample size / span in days (with a
 *      1-day floor so a very tight cluster of recent plays doesn't produce an
 *      absurd extrapolated rate).
 *   3. Compute the average track length from that same recently-played sample
 *      (falling back to the average length of the user's top tracks if recently-played
 *      is empty, and to a generic 3.5 minute average if both are unavailable).
 *   4. Multiply plays/day * avg track minutes * 365 to project a rough annual
 *      total, matching the "wrapped year in review" framing.
 *   5. Clamp the result to a sane range (1,000–200,000 minutes/year) since this
 *      is an extrapolation from a very small sample and should not be presented
 *      as an exact figure.
 *
 * This is explicitly an estimate — the response is named `totalMinutesEstimate`
 * (not `totalMinutes`) to keep that honest for any consuming UI.
 *
 * @param {Array<{ played_at: string, track?: { duration_ms?: number } }>} recentlyPlayed
 * @param {Array<{ duration_ms?: number }>} topTracks
 * @returns {number}
 */
export function estimateTotalMinutes(recentlyPlayed, topTracks) {
  const FALLBACK_AVG_TRACK_MINUTES = 3.5;
  const MIN_ESTIMATE = 1000;
  const MAX_ESTIMATE = 200000;
  const DAYS_PER_YEAR = 365;
  const MIN_SPAN_DAYS = 1;

  const playedDurationsMinutes = (recentlyPlayed ?? [])
    .map((item) => item?.track?.duration_ms)
    .filter((ms) => typeof ms === "number" && ms > 0)
    .map((ms) => ms / 60000);

  const topTrackDurationsMinutes = (topTracks ?? [])
    .map((track) => track?.duration_ms)
    .filter((ms) => typeof ms === "number" && ms > 0)
    .map((ms) => ms / 60000);

  const avgTrackMinutes = average(playedDurationsMinutes.length ? playedDurationsMinutes : topTrackDurationsMinutes) ?? FALLBACK_AVG_TRACK_MINUTES;

  const timestamps = (recentlyPlayed ?? [])
    .map((item) => (item?.played_at ? new Date(item.played_at).getTime() : null))
    .filter((ms) => typeof ms === "number" && !Number.isNaN(ms));

  if (timestamps.length < 2) {
    // Not enough data points to derive a plays/day rate (e.g. brand-new account,
    // or only a single recently-played entry). Fall back to a conservative flat
    // assumption of ~2 hours/day of listening at the sample's average track length.
    const FALLBACK_MINUTES_PER_DAY = 120;
    return clamp(Math.round(FALLBACK_MINUTES_PER_DAY * DAYS_PER_YEAR), MIN_ESTIMATE, MAX_ESTIMATE);
  }

  const spanMs = Math.max(...timestamps) - Math.min(...timestamps);
  const spanDays = Math.max(spanMs / 86400000, MIN_SPAN_DAYS);
  const playsPerDay = recentlyPlayed.length / spanDays;
  const minutesPerDay = playsPerDay * avgTrackMinutes;
  const annualEstimate = Math.round(minutesPerDay * DAYS_PER_YEAR);

  return clamp(annualEstimate, MIN_ESTIMATE, MAX_ESTIMATE);
}

/**
 * Aggregates genres across the user's top artists and returns the single most
 * frequently occurring one. Falls back to a friendly default when no artist
 * has genre data (Spotify sometimes returns an empty `genres` array).
 *
 * @param {Array<{ genres?: string[] }>} topArtists
 * @returns {string}
 */
export function deriveTopGenre(topArtists) {
  const counts = new Map();

  for (const artist of topArtists ?? []) {
    for (const genre of artist?.genres ?? []) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }

  if (counts.size === 0) {
    return "eclectic mix";
  }

  let topGenre = "";
  let topCount = -1;
  for (const [genre, count] of counts) {
    if (count > topCount) {
      topGenre = genre;
      topCount = count;
    }
  }

  return topGenre;
}

function hourOf(dateString) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date.getUTCHours();
}

/**
 * Buckets recently-played timestamps into a dominant time-of-day (UTC, since
 * the Spotify API does not return the user's local timezone).
 * @param {Array<{ played_at: string }>} recentlyPlayed
 * @returns {'night'|'morning'|'afternoon'|'evening'|null}
 */
function dominantTimeOfDay(recentlyPlayed) {
  const buckets = { night: 0, morning: 0, afternoon: 0, evening: 0 };

  for (const item of recentlyPlayed ?? []) {
    const hour = hourOf(item?.played_at);
    if (hour === null) continue;
    if (hour >= 0 && hour < 6) buckets.night += 1;
    else if (hour >= 6 && hour < 12) buckets.morning += 1;
    else if (hour >= 12 && hour < 18) buckets.afternoon += 1;
    else buckets.evening += 1;
  }

  const entries = Object.entries(buckets);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  if (total === 0) return null;

  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

/**
 * Derives a lightweight "listening personality" archetype from three signals:
 *
 *   1. Genre diversity — number of distinct genres across the user's top artists.
 *      A high count suggests an eclectic listener; a low count suggests a listener
 *      loyal to one lane.
 *   2. Obscurity — the average Spotify "popularity" score (0-100) of the user's
 *      top artists. Low average popularity suggests the user gravitates toward
 *      lesser-known/underground acts; high average popularity suggests mainstream taste.
 *   3. Time-of-day pattern — the most common hour bucket (UTC) across recently
 *      played tracks, e.g. a "night" majority suggests late-night listening habits.
 *
 * This is a small rule-based scoring function, not a hardcoded label: the same
 * inputs always produce the same output, and different Spotify accounts with
 * different listening habits will land on different archetypes.
 *
 * @param {{ topArtists: Array<{ genres?: string[], popularity?: number }>, recentlyPlayed: Array<{ played_at: string }> }} params
 * @returns {{ title: string, description: string }}
 */
export function derivePersonality({ topArtists, recentlyPlayed }) {
  const genreSet = new Set();
  for (const artist of topArtists ?? []) {
    for (const genre of artist?.genres ?? []) genreSet.add(genre);
  }
  const genreDiversity = genreSet.size;

  const popularityScores = (topArtists ?? [])
    .map((artist) => artist?.popularity)
    .filter((score) => typeof score === "number");
  const avgPopularity = average(popularityScores) ?? 50;

  const timeOfDay = dominantTimeOfDay(recentlyPlayed);

  // Rule-based archetype selection, most-specific rules first.
  if (avgPopularity < 40 && genreDiversity >= 4) {
    return {
      title: "The Underground Explorer",
      description:
        "You dig deep past the algorithm's front page — your top artists skew niche and span a wide range of genres. Chances are your friends discover new music through you, not the other way around.",
    };
  }

  if (avgPopularity >= 70 && genreDiversity <= 3) {
    return {
      title: "The Mainstream Superfan",
      description:
        "You know exactly what you like and the charts agree with you. Your top artists are certified crowd-pleasers, and you're not afraid to run it back on the same few genres all year.",
    };
  }

  if (genreDiversity >= 6) {
    return {
      title: "The Genre Hopper",
      description:
        "Your library refuses to sit still. With a wide spread of genres across your top artists, your listening habits are less a playlist and more a mood ring.",
    };
  }

  if (timeOfDay === "night") {
    return {
      title: "The Night Owl Listener",
      description:
        "Your most active listening hours skew late — plenty of your recent plays land well after midnight. Whatever you're doing at 2am, it has a great soundtrack.",
    };
  }

  if (timeOfDay === "morning") {
    return {
      title: "The Sunrise Sessioner",
      description:
        "Mornings are your prime listening window. You're getting a head start on the day with your top artists in your ears before most people are awake.",
    };
  }

  return {
    title: "The Steady Companion",
    description:
      "Consistent, comfortable, and a little bit predictable in the best way — your top artists and genres form a reliable soundtrack you keep coming back to.",
  };
}

/**
 * Assembles the final Wrapped response from raw Spotify API data.
 * @param {{ topArtists: Array<Object>, topTracks: Array<Object>, recentlyPlayed: Array<Object> }} params
 * @returns {import('./wrappedTypes').WrappedResponse}
 */
export function buildWrappedResponse({ topArtists, topTracks, recentlyPlayed }) {
  const rankedArtists = (topArtists ?? []).map((artist, index) => ({
    rank: index + 1,
    name: artist.name,
    genres: artist.genres ?? [],
    playsOrPopularity: artist.popularity ?? 0,
  }));

  const topTrack = (topTracks ?? [])[0];
  const topSong = topTrack
    ? {
        title: topTrack.name,
        artist: topTrack.artists?.[0]?.name ?? "Unknown Artist",
        album: topTrack.album?.name ?? "Unknown Album",
      }
    : { title: "Unknown", artist: "Unknown", album: "Unknown" };

  return {
    totalMinutesEstimate: estimateTotalMinutes(recentlyPlayed, topTracks),
    topArtists: rankedArtists,
    topSong,
    topGenre: deriveTopGenre(topArtists),
    personality: derivePersonality({ topArtists, recentlyPlayed }),
  };
}

// ---------------------------------------------------------------------------
// Mock data (for `GET /api/wrapped?mock=true`)
// ---------------------------------------------------------------------------

/**
 * Returns realistic sample data in the exact same shape as the real
 * `buildWrappedResponse()` output, so the `/api/wrapped` contract can be
 * verified end-to-end without setting up Spotify OAuth credentials.
 *
 * @returns {import('./wrappedTypes').WrappedResponse}
 */
export function getMockWrappedResponse() {
  return {
    totalMinutesEstimate: 78432,
    topArtists: [
      { rank: 1, name: "Phoebe Bridgers", genres: ["indie folk", "sad girl indie"], playsOrPopularity: 72 },
      { rank: 2, name: "Tame Impala", genres: ["psychedelic rock", "neo-psychedelic"], playsOrPopularity: 81 },
      { rank: 3, name: "Bon Iver", genres: ["indie folk", "art pop"], playsOrPopularity: 68 },
      { rank: 4, name: "Mac Miller", genres: ["hip hop", "rap"], playsOrPopularity: 79 },
      { rank: 5, name: "Clairo", genres: ["bedroom pop", "indie pop"], playsOrPopularity: 74 },
      { rank: 6, name: "Men I Trust", genres: ["dream pop", "bedroom pop"], playsOrPopularity: 63 },
      { rank: 7, name: "Boygenius", genres: ["indie rock", "sad girl indie"], playsOrPopularity: 66 },
      { rank: 8, name: "Steve Lacy", genres: ["neo soul", "r&b"], playsOrPopularity: 77 },
    ],
    topSong: {
      title: "Motion Sickness",
      artist: "Phoebe Bridgers",
      album: "Stranger in the Alps",
    },
    topGenre: "indie folk",
    personality: {
      title: "The Genre Hopper",
      description:
        "Your library refuses to sit still. With a wide spread of genres across your top artists, your listening habits are less a playlist and more a mood ring.",
    },
  };
}

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------

function average(numbers) {
  if (!numbers || numbers.length === 0) return null;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
