"use client";

import { getDisplayName } from "../lib/anonymizeNames";
import SectionTransition from "./SectionTransition";

// Each stat type gets one dominant accent gradient, per the Figma design system.
// Only the stats actually used in the "Your Soundtrack" chapter (see
// app/page.js) are handled below — `minutes`/`personality` were the generic
// Spotify-Wrapped screens this component originally rendered before the site
// was restructured around the narrative "[Ali] Wrapped" chapters.
const ACCENT_BY_STAT = {
  topArtists: "wrapped-accent-purple",
  topSong: "wrapped-accent-pink",
  topGenre: "wrapped-accent-orange",
  topMemory: "wrapped-accent-limegreen",
};

function StatShell({ kicker, badge, children }) {
  return (
    <>
      <span className="wrapped-kicker">{kicker}</span>
      <div className="wrapped-body">{children}</div>
      {badge ? <div className="wrapped-source">{badge}</div> : null}
    </>
  );
}

function SourceBadge({ source, needsAuth }) {
  if (!source) return null;
  return (
    <span className={`wrapped-badge ${source === "spotify" ? "is-live" : "is-preview"}`}>
      {source === "spotify" ? "spotify · live" : "spotify · preview"}
      {needsAuth ? (
        <a className="wrapped-connect" href="/api/auth/spotify/login">
          connect real data →
        </a>
      ) : null}
    </span>
  );
}

/**
 * Renders one Spotify-Wrapped-style stat card. Data comes from `/api/wrapped`
 * via `useWrappedData` (see page.js) — this component only handles presentation
 * and loading/error/empty states so it stays trivially reusable across stat types.
 */
export default function WrappedStat({ statKey, status, data, source, needsAuth }) {
  const accentClass = ACCENT_BY_STAT[statKey] ?? "wrapped-accent-green";

  if (status === "loading") {
    return (
      <SectionTransition className={`wrapped-card wrapped-loading ${accentClass}`} variant="fade">
        <span className="wrapped-kicker">ali’s 2026 wrapped</span>
        <p className="wrapped-loading-text">tallying up the year…</p>
      </SectionTransition>
    );
  }

  if (status === "error" || !data) {
    return (
      <SectionTransition className={`wrapped-card wrapped-loading ${accentClass}`} variant="fade">
        <span className="wrapped-kicker">ali’s 2026 wrapped</span>
        <p className="wrapped-loading-text">
          couldn’t load the wrapped stats right now — the memories keep going though.
        </p>
      </SectionTransition>
    );
  }

  const badge = <SourceBadge source={source} needsAuth={needsAuth} />;

  if (statKey === "topArtists") {
    const artists = data.topArtists ?? [];
    return (
      <SectionTransition className={`wrapped-card ${accentClass}`} variant="rise">
        <StatShell kicker="meanwhile, on spotify · top artists" badge={badge}>
          <ol className="wrapped-list">
            {artists.slice(0, 5).map((artist) => (
              <li key={artist.rank}>
                <span className={`wrapped-rank ${artist.rank === 1 ? "is-first" : ""}`}>{artist.rank}</span>
                <span className="wrapped-list-name">{artist.name}</span>
              </li>
            ))}
          </ol>
        </StatShell>
      </SectionTransition>
    );
  }

  if (statKey === "topSong") {
    const song = data.topSong ?? {};
    return (
      <SectionTransition className={`wrapped-card ${accentClass}`} variant="rise">
        <StatShell kicker="his most played song, for real" badge={badge}>
          <p className="wrapped-title">{song.title}</p>
          <p className="wrapped-caption">
            {song.artist} — {song.album}
          </p>
        </StatShell>
      </SectionTransition>
    );
  }

  if (statKey === "topGenre") {
    return (
      <SectionTransition className={`wrapped-card ${accentClass}`} variant="rise">
        <StatShell kicker="and the genre behind it all" badge={badge}>
          <p className="wrapped-title">{data.topGenre}</p>
          <p className="wrapped-caption">the genre doing the most work on this playlist.</p>
        </StatShell>
      </SectionTransition>
    );
  }

  if (statKey === "topMemory") {
    const memory = data.topMemory;
    if (!memory) return null;
    return (
      <SectionTransition className={`wrapped-card ${accentClass}`} variant="rise">
        <StatShell kicker="the memory that soundtracked it all">
          <p className="wrapped-title">{getDisplayName(memory.person)}</p>
          <p className="wrapped-caption">
            {memory.subtitle} — {memory.date}
          </p>
          <p className="wrapped-memory-message">{memory.message}</p>
          {memory.hasVoiceNote ? <p className="wrapped-caption wrapped-voice-hint">has a voice note attached</p> : null}
        </StatShell>
      </SectionTransition>
    );
  }

  return null;
}
