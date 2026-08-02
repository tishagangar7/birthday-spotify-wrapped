import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getValidAccessToken,
  fetchTopArtists,
  fetchTopTracks,
  fetchRecentlyPlayed,
  buildWrappedResponse,
  getMockWrappedResponse,
} from "@/lib/spotify";
import { getMemoriesBlend, getMockMemoriesBlend } from "@/lib/wrappedMemories";

/**
 * GET /api/wrapped
 *
 * Returns a "Spotify Wrapped" style summary for the logged-in Spotify user
 * (see `lib/wrappedTypes.js` for the full `WrappedResponse` shape). This is a
 * read-only aggregation endpoint — no data is persisted.
 *
 * Query params:
 *   - `mock=true` — skip Spotify entirely and return sample Spotify fields via
 *     `getMockWrappedResponse()`, blended with the real memory archive from
 *     `getMemoriesBlend()` (falls back to `getMockMemoriesBlend()` if that fails).
 *
 * Auth: requires a Spotify session established via `/api/auth/spotify/login`
 * (httpOnly cookies set by `/api/auth/spotify/callback`). If no valid session
 * is found, responds 401 with a pointer to the login route and to `?mock=true`.
 *
 * Data flow:
 *   1. Resolve a valid (auto-refreshed if needed) access token from cookies.
 *   2. Fetch top artists, top tracks (long_term range — Spotify's closest
 *      approximation of "all time") and recently-played tracks in parallel.
 *   3. Hand the raw Spotify payloads to `buildWrappedResponse()`, which derives
 *      the minutes estimate, top genre, and personality heuristics.
 *   4. Blend in personal memory content from `data/memories.js` via
 *      `getMemoriesBlend()` (this is the "Ali's 21st Birthday Wrapped" hybrid
 *      concept — see `lib/wrappedMemories.js`). This step is additive and
 *      fail-safe: if memory data is unavailable, its fields simply come back
 *      as `null`/`0` rather than failing the whole request.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const useMock = searchParams.get("mock") === "true";

  if (useMock) {
    // Spotify half stays mocked; memory blend prefers the real archive so
    // Glow Up Timeline / topMemory still work without an OAuth session
    // (the frontend falls back here on 401).
    let memoriesBlend;
    try {
      memoriesBlend = await getMemoriesBlend();
    } catch {
      memoriesBlend = getMockMemoriesBlend();
    }
    return NextResponse.json({
      ...getMockWrappedResponse(),
      ...memoriesBlend,
    });
  }

  const cookieStore = await cookies();

  let accessToken;
  try {
    ({ accessToken } = await getValidAccessToken(cookieStore));
  } catch (error) {
    console.error("Failed to refresh Spotify access token:", error);
    return NextResponse.json(
      {
        error: "reauth_required",
        message:
          "Your Spotify session could not be refreshed. Please log in again via /api/auth/spotify/login.",
      },
      { status: 401 }
    );
  }

  if (!accessToken) {
    return NextResponse.json(
      {
        error: "not_authenticated",
        message:
          "No Spotify session found. Log in via /api/auth/spotify/login, or pass ?mock=true to preview the response shape without OAuth.",
      },
      { status: 401 }
    );
  }

  try {
    const [topArtists, topTracks, recentlyPlayed] = await Promise.all([
      fetchTopArtists(accessToken, { timeRange: "long_term", limit: 10 }),
      fetchTopTracks(accessToken, { timeRange: "long_term", limit: 10 }),
      fetchRecentlyPlayed(accessToken, { limit: 50 }),
    ]);

    const wrapped = buildWrappedResponse({ topArtists, topTracks, recentlyPlayed });

    // Additive + fail-safe: a problem loading memory data should never break
    // the Spotify half of the response. getMemoriesBlend() already degrades
    // internally, but we belt-and-suspenders it here too.
    let memoriesBlend;
    try {
      memoriesBlend = await getMemoriesBlend();
    } catch (error) {
      console.warn("Spotify Wrapped: memory blend failed unexpectedly, omitting it.", error);
      memoriesBlend = {
        topMemory: null,
        totalMemoryCount: 0,
        highlightedVoiceNote: null,
        memoryYearsSpan: null,
      };
    }

    return NextResponse.json({ ...wrapped, ...memoriesBlend });
  } catch (error) {
    console.error("Failed to build Spotify Wrapped response:", error);
    return NextResponse.json(
      { error: "spotify_api_error", message: error.message },
      { status: 502 }
    );
  }
}
