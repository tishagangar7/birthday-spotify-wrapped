"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Grain from "../../../components/Grain";
import MemoryForm from "../../../components/MemoryForm";
import MemoryLyrics, { splitLyricLines } from "../../../components/MemoryLyrics";
import NowPlayingBar from "../../../components/NowPlayingBar";
import VoiceNote from "../../../components/VoiceNote";
import { findTrackBySlug } from "../../../data/tracklist";

export default function FriendPage() {
  const params = useParams();
  const track = findTrackBySlug(params?.friend);
  const [activeLine, setActiveLine] = useState(0);

  const displayName = track?.person || "";
  const cover = track?.media?.[0];

  const trackLines = useMemo(() => splitLyricLines(track?.message), [track?.message]);

  useEffect(() => {
    if (!trackLines.length) return undefined;
    const id = window.setInterval(() => {
      setActiveLine((current) => (current + 1) % trackLines.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [trackLines.length]);

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

  return (
    <div className="page-scroll friend-page">
      <div className="friend-main">
        <Link href="/album" className="friend-back">
          ‹ Track {trackNumber} · actual life (2005–2026)
        </Link>

        <header className="friend-header">
          {cover ? (
            <div className={`friend-cover actual-image actual-${track.color}`}>
              <Image
                src={cover.src}
                alt={cover.alt || displayName}
                fill
                sizes="96px"
                className="media-image"
                priority
              />
            </div>
          ) : null}
          <div className="friend-header-text">
            <h1 className="friend-title">{displayName}</h1>
          </div>
        </header>

        <MemoryLyrics
          credit={`lyrics · a message from ${displayName}`}
          lines={trackLines}
          activeIndex={activeLine}
        />

        {track.voiceNote ? <VoiceNote src={track.voiceNote} person={displayName} /> : null}
      </div>

      <div className="friend-side">
        <NowPlayingBar
          trackTitle={track.nowPlaying}
          duration={track.duration}
          src={track.song}
          autoPlay
        />

        <section className="friend-form-section">
          <h2 className="friend-form-heading">add your verse</h2>
          <MemoryForm friendName="" />
        </section>
      </div>

      <Link href="/album" className="friend-back-fab" aria-label="Back to the album">
        ←
      </Link>

      <Grain />
    </div>
  );
}
