"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Grain from "../../../components/Grain";
import MediaFrame from "../../../components/MediaFrame";
import MemoryForm from "../../../components/MemoryForm";
import MemoryLyrics, { splitLyricLines } from "../../../components/MemoryLyrics";
import NowPlayingBar from "../../../components/NowPlayingBar";
import VoiceNote from "../../../components/VoiceNote";
import useMemoriesData from "../../../components/useMemoriesData";
import { findTrackBySlug } from "../../../data/tracklist";
import { getDisplayName } from "../../../lib/anonymizeNames";

export default function FriendPage() {
  const params = useParams();
  const track = findTrackBySlug(params?.friend);
  const submitted = useMemoriesData();
  const [activeLine, setActiveLine] = useState(0);
  const [localMemories, setLocalMemories] = useState([]);

  const displayName = track ? getDisplayName(track.person) : "";

  const trackLines = useMemo(() => splitLyricLines(track?.message), [track?.message]);

  const friendMemories = useMemo(() => {
    const fromApi = (submitted.memories || []).filter((memory) => {
      const name = String(memory.friendName || "").toLowerCase();
      return name.includes(String(track?.person || "").toLowerCase()) || name.length > 0;
    });
    return [...localMemories, ...fromApi];
  }, [submitted.memories, localMemories, track?.person]);

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

        <MemoryLyrics
          credit={`lyrics · ${displayName}`}
          lines={trackLines}
          activeIndex={activeLine}
        />

        {friendMemories.slice(0, 4).map((memory) => (
          <MemoryLyrics
            key={memory.id || `${memory.friendName}-${memory.message?.slice(0, 12)}`}
            credit={`lyrics by ${memory.friendName}`}
            lines={splitLyricLines(memory.message)}
            activeIndex={0}
          />
        ))}

        {track.voiceNote ? <VoiceNote src={track.voiceNote} person={displayName} /> : null}
      </div>

      <div className="friend-side">
        <NowPlayingBar trackTitle={track.nowPlaying} duration={track.duration} />

        <section className="friend-form-section">
          <h2 className="friend-form-heading">add your verse</h2>
          <MemoryForm
            friendName=""
            onSubmitted={(entry) => {
              setLocalMemories((prev) => [
                { id: `local-${Date.now()}`, friendName: entry.friendName, message: entry.message },
                ...prev,
              ]);
            }}
          />
        </section>
      </div>

      <Link href="/album" className="friend-back-fab" aria-label="Back to the album">
        ←
      </Link>

      <Grain />
    </div>
  );
}
