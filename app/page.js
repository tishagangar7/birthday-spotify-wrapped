"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import AlbumTeaserCard from "../components/AlbumTeaserCard";
import AudioPlayer from "../components/AudioPlayer";
import { topSongs } from "../data/wrappedChapters";
import AlbumPlaylistChapter from "../components/chapters/AlbumPlaylistChapter";
import AliOrElseQuizChapter from "../components/chapters/AliOrElseQuizChapter";
import AliWrappedAwardsChapter from "../components/chapters/AliWrappedAwardsChapter";
import LovedClipsChapter from "../components/chapters/LovedClipsChapter";
import WhichAliAreYouChapter from "../components/chapters/WhichAliAreYouChapter";
import PolaroidWallChapter from "../components/chapters/PolaroidWallChapter";
import ClosingCreditsChapter from "../components/chapters/ClosingCreditsChapter";
import CologneChapter from "../components/chapters/CologneChapter";
import TopArtistsChapter from "../components/chapters/TopArtistsChapter";
import FinalSlideChapter from "../components/chapters/FinalSlideChapter";
import FratPerformanceReviewChapter from "../components/chapters/FratPerformanceReviewChapter";
import GlowUpTimelineChapter from "../components/chapters/GlowUpTimelineChapter";
import GreenFlagsChapter from "../components/chapters/GreenFlagsChapter";
import HingeUnhingedChapter from "../components/chapters/HingeUnhingedChapter";
import LoreIcebergChapter from "../components/chapters/LoreIcebergChapter";
import MotivPlatinumChapter from "../components/chapters/MotivPlatinumChapter";
import PersonalStatsChapter from "../components/chapters/PersonalStatsChapter";
import PokerChapter from "../components/chapters/PokerChapter";
import PredictionsChapter from "../components/chapters/PredictionsChapter";
import RedFlagsChapter from "../components/chapters/RedFlagsChapter";
import RunnerMilesChapter from "../components/chapters/RunnerMilesChapter";
import SocialMediaPodiumChapter from "../components/chapters/SocialMediaPodiumChapter";
import TalkingMinutesChapter from "../components/chapters/TalkingMinutesChapter";
import TopSearchesChapter from "../components/chapters/TopSearchesChapter";
import TopSongsChapter from "../components/chapters/TopSongsChapter";
import Grain from "../components/Grain";
import ScrollDeck from "../components/ScrollDeck";
import WelcomeCard from "../components/WelcomeCard";
import useMemoriesData from "../components/useMemoriesData";
import { getDisplayNames } from "../lib/anonymizeNames";

/**
 * Order = Figma "Spotify Wrapped 2026" (L→R), plus New Ali Content after Ch.02.
 * Dropped the old actual-life black cover. First screen = Figma 01 Intro.
 *
 * Replaced: heart → iceberg, lineup → frat review, achievements → which ali,
 * screentime → hinge. Added: motiv, social podium, awards. Enhanced: top searches.
 */
function formatContributors(names) {
  if (!names || names.length === 0) return "his friends";
  const MAX = 6;
  if (names.length === 1) return names[0];
  if (names.length <= MAX) return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
  return `${names.slice(0, MAX).join(", ")} & ${names.length - MAX} more`;
}

export default function Home() {
  const [audioReady, setAudioReady] = useState(false);
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef(null);
  const submittedMemories = useMemoriesData();

  const playTrack = useCallback(async (song) => {
    if (!song?.src) return;
    setAudioReady(true);
    // Play inside the click gesture before React re-renders with the new track.
    // Updating activeTrack first lets the sync effect call load() and abort play().
    const ok = await audioPlayerRef.current?.play(song.src);
    if (ok !== false) setActiveTrack(song);
  }, []);

  const selectSong = useCallback(
    async (song, { autoplay = true } = {}) => {
      if (!song?.src) return;
      const same = activeTrack?.src === song.src;
      if (same && !autoplay) return;
      if (same && isPlaying) {
        audioPlayerRef.current?.pause();
        return;
      }
      if (same && !isPlaying) {
        setAudioReady(true);
        await audioPlayerRef.current?.play();
        return;
      }
      if (autoplay) {
        await playTrack(song);
      } else {
        setAudioReady(true);
        setActiveTrack(song);
      }
    },
    [activeTrack?.src, isPlaying, playTrack]
  );

  const cards = useMemo(() => {
    const directedBy =
      submittedMemories.status === "loading"
        ? "…"
        : formatContributors(getDisplayNames(submittedMemories.contributors));

    return [
      {
        id: "intro-wrapped",
        content: (
          <WelcomeCard
            onStart={() => {
              setAudioReady(true);
            }}
          />
        ),
      },
      {
        id: "top-songs",
        content: (
          <TopSongsChapter
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            onSelectSong={(song) => selectSong(song, { autoplay: true })}
          />
        ),
      },
      { id: "top-artists", content: <TopArtistsChapter /> },
      { id: "stat-chipotle", content: <PersonalStatsChapter statId="chipotle" /> },
      { id: "stat-mo", content: <PersonalStatsChapter statId="mo" /> },
      { id: "bonus-cologne", content: <CologneChapter /> },
      { id: "bonus-poker", content: <PokerChapter /> },
      { id: "bonus-polaroids", content: <PolaroidWallChapter /> },
      { id: "chapter-4-miles", content: <RunnerMilesChapter /> },
      { id: "chapter-5-talking", content: <TalkingMinutesChapter /> },
      { id: "bonus-quiz", content: <AliOrElseQuizChapter /> },
      { id: "bonus-loved-clips", content: <LovedClipsChapter /> },
      { id: "bonus-lore-iceberg", content: <LoreIcebergChapter /> },
      { id: "bonus-frat-review", content: <FratPerformanceReviewChapter /> },
      {
        id: "bonus-timeline",
        content: <GlowUpTimelineChapter />,
      },
      { id: "bonus-which-ali", content: <WhichAliAreYouChapter /> },
      { id: "bonus-social-podium", content: <SocialMediaPodiumChapter /> },
      { id: "bonus-hinge", content: <HingeUnhingedChapter /> },
      { id: "bonus-motiv", content: <MotivPlatinumChapter /> },
      { id: "bonus-topsearches", content: <TopSearchesChapter /> },
      { id: "bonus-redflags", content: <RedFlagsChapter /> },
      { id: "bonus-greenflags", content: <GreenFlagsChapter /> },
      { id: "bonus-predictions", content: <PredictionsChapter /> },
      { id: "bonus-awards", content: <AliWrappedAwardsChapter /> },
      { id: "chapter-8-final", content: <FinalSlideChapter /> },
      { id: "credits-closing", content: <ClosingCreditsChapter directedBy={directedBy} /> },
      { id: "album-teaser", content: <AlbumTeaserCard /> },
      { id: "album-playlist", content: <AlbumPlaylistChapter /> },
    ];
  }, [
    submittedMemories.status,
    submittedMemories.contributors,
    activeTrack,
    isPlaying,
    selectSong,
  ]);

  return (
    <main className="actual-life">
      <ScrollDeck cards={cards} />
      <AudioPlayer
        ref={audioPlayerRef}
        track={activeTrack}
        playlist={topSongs}
        entered={audioReady}
        ducked={false}
        onSelectTrack={(song, opts) => selectSong(song, opts)}
        onPlayingChange={setIsPlaying}
      />
      <Grain />
    </main>
  );
}
