import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCodeForTokens,
  setSpotifyAuthCookies,
  SPOTIFY_OAUTH_STATE_COOKIE,
} from "@/lib/spotify";

/**
 * GET /api/auth/spotify/callback
 *
 * Step 2 of the Spotify Authorization Code OAuth flow. Spotify redirects the
 * browser here with either a `code` (success) or `error` query param after
 * the user approves/denies access at Spotify's login screen.
 *
 * On success: exchanges `code` for an access token + refresh token via
 * `exchangeCodeForTokens`, stores them in httpOnly cookies (see
 * `setSpotifyAuthCookies` in `lib/spotify.js` — no database is used for this
 * MVP), then redirects back to the app root with a `spotify_connected=true`
 * query param a frontend can key off of.
 *
 * On failure (missing/invalid `state`, Spotify-reported error, or a failed
 * token exchange): redirects back to the app root with a `spotify_error`
 * query param describing what went wrong.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const spotifyError = searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(SPOTIFY_OAUTH_STATE_COOKIE)?.value ?? null;
  cookieStore.delete(SPOTIFY_OAUTH_STATE_COOKIE);

  if (spotifyError) {
    return NextResponse.redirect(
      new URL(`/?spotify_error=${encodeURIComponent(spotifyError)}`, request.url)
    );
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/?spotify_error=invalid_state", request.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    setSpotifyAuthCookies(cookieStore, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
    });
  } catch (error) {
    console.error("Spotify token exchange failed:", error);
    return NextResponse.redirect(new URL("/?spotify_error=token_exchange_failed", request.url));
  }

  return NextResponse.redirect(new URL("/?spotify_connected=true", request.url));
}
