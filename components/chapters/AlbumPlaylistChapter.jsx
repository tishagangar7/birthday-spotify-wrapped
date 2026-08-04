"use client";

import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { playlistGroups } from "../../data/playlistPhotos";

/** Actual Life playlist — text-forward finale; photos live on the polaroid wall + /album. */
export default function AlbumPlaylistChapter() {
  const total =
    playlistGroups.red.length + playlistGroups.yellow.length + playlistGroups.blue.length;

  return (
    <SectionTransition className="album-playlist-chapter wrapped-card wrapped-accent-pink" variant="rise">
      <header className="album-playlist-hero">
        <span className="wrapped-kicker">stats · playlist</span>
        <h2 className="album-playlist-title">
          actual life
          <br />
          (2005–2026)
        </h2>
        <p className="album-playlist-artist">
          {total} tracks · {playlistGroups.red.length} red · {playlistGroups.yellow.length} yellow ·{" "}
          {playlistGroups.blue.length} blue
        </p>
        <p className="wrapped-caption album-playlist-blurb">
          every friend gets a song. the full archive is on the album page.
        </p>
      </header>

      <div className="wrapped-cta-row">
        <WrappedButton variant="ghost" href="/album">
          open full album →
        </WrappedButton>
      </div>
    </SectionTransition>
  );
}
