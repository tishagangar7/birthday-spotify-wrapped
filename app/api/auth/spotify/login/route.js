import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildAuthorizeUrl, SPOTIFY_OAUTH_STATE_COOKIE } from "@/lib/spotify";

/**
 * GET /api/auth/spotify/login
 *
 * Step 1 of the Spotify Authorization Code OAuth flow. Generates a random
 * `state` value (stored in a short-lived httpOnly cookie for CSRF protection),
 * then redirects the browser to Spotify's `/authorize` endpoint requesting
 * the `user-top-read` and `user-read-recently-played` scopes needed by
 * `/api/wrapped`.
 *
 * Visiting this route in a browser is the entry point for connecting a
 * Spotify account: the user will be redirected to Spotify to log in and
 * approve access, then bounced back to `/api/auth/spotify/callback`.
 */
export async function GET() {
  const state = crypto.randomUUID();

  let authorizeUrl;
  try {
    authorizeUrl = buildAuthorizeUrl(state);
  } catch (error) {
    return NextResponse.json({ error: "configuration_error", message: error.message }, { status: 500 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SPOTIFY_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes is plenty for the OAuth round trip
  });

  return NextResponse.redirect(authorizeUrl);
}
