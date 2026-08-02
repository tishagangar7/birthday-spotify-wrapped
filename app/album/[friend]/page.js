"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Grain from "../../../components/Grain";
import MediaFrame from "../../../components/MediaFrame";
import MemoryForm from "../../../components/MemoryForm";
import NowPlayingBar from "../../../components/NowPlayingBar";
import VoiceNote from "../../../components/VoiceNote";
import { findTrackBySlug } from "../../../data/tracklist";
import { getDisplayName } from "../../../lib/anonymizeNames";

export default function FriendPage() {
  const params = useParams();
  const track = findTrackBySlug(params?.friend);

  if (!track) {
    return (
      <div className="page-scroll friend-page">
        <Link href="/album" className="album-back">
          ← back to the album
        </Link>
        <p className="friend-not-found">couldn’t find that track in the archive.</p>
      </div>
    );
  }

  const trackNumber = String(track.trackNumber).padStart(2, "0");
  const displayName = getDisplayName(track.person);

  return (
    <div className="page-scroll friend-page">
      <div className="friend-main">
        <Link href="/album" className="friend-back">
          ‹ Track {trackNumber} · actual life (2005–2026)
        </Link>

        <h1 className="friend-title">{displayName}</h1>
        <p className="friend-subtitle">{track.subtitle}</p>

        {track.media?.length ? (
          <div className="friend-media">
            <MediaFrame
              media={track.media[0]}
              color={track.color}
              date={track.date}
              time={track.time}
              location={track.location}
              index={0}
            />
          </div>
        ) : null}

        <p className="friend-message">{track.message}</p>
        {track.voiceNote ? <VoiceNote src={track.voiceNote} person={displayName} /> : null}
      </div>

      <div className="friend-side">
        <NowPlayingBar trackTitle={track.nowPlaying} duration={track.duration} />

        <section className="friend-form-section">
          <h2 className="friend-form-heading">Add your own memory</h2>
          <MemoryForm />
        </section>
      </div>

      <Link href="/album" className="friend-back-fab" aria-label="Back to the album">
        ←
      </Link>

      <Grain />
    </div>
  );
}
