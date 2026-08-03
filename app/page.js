"use client";

import { useMemo, useState } from "react";
import { memories } from "../data/memories";
import AlbumTeaserCard from "../components/AlbumTeaserCard";
import AudioPlayer from "../components/AudioPlayer";
import AchievementsChapter from "../components/chapters/AchievementsChapter";
import AlbumPlaylistChapter from "../components/chapters/AlbumPlaylistChapter";
import AliOrElseQuizChapter from "../components/chapters/AliOrElseQuizChapter";
import CarChapter from "../components/chapters/CarChapter";
import ChapterMenu from "../components/chapters/ChapterMenu";
import ChipotleBowlChapter from "../components/chapters/ChipotleBowlChapter";
import ClosingCreditsChapter from "../components/chapters/ClosingCreditsChapter";
import CologneChapter from "../components/chapters/CologneChapter";
import FavoriteArtistCard from "../components/chapters/FavoriteArtistCard";
import FinalSlideChapter from "../components/chapters/FinalSlideChapter";
import GlowUpTimelineChapter from "../components/chapters/GlowUpTimelineChapter";
import GreenFlagsChapter from "../components/chapters/GreenFlagsChapter";
import HeartSizeChapter from "../components/chapters/HeartSizeChapter";
import OpeningCreditsChapter from "../components/chapters/OpeningCreditsChapter";
import PersonalityOrderChapter from "../components/chapters/PersonalityOrderChapter";
import PersonalStatsChapter from "../components/chapters/PersonalStatsChapter";
import PokerChapter from "../components/chapters/PokerChapter";
import PredictionsChapter from "../components/chapters/PredictionsChapter";
import RedFlagsChapter from "../components/chapters/RedFlagsChapter";
import RunnerMilesChapter from "../components/chapters/RunnerMilesChapter";
import ScreenTimeChapter from "../components/chapters/ScreenTimeChapter";
import StartingLineupChapter from "../components/chapters/StartingLineupChapter";
import StoriesChapter from "../components/chapters/StoriesChapter";
import TalkingMinutesChapter from "../components/chapters/TalkingMinutesChapter";
import TopSearchesChapter from "../components/chapters/TopSearchesChapter";
import Grain from "../components/Grain";
import ScrollDeck from "../components/ScrollDeck";
import WelcomeCard from "../components/WelcomeCard";
import useMemoriesData from "../components/useMemoriesData";
import useWrappedData from "../components/useWrappedData";
import { getDisplayNames } from "../lib/anonymizeNames";

/**
 * Order = Figma "Spotify Wrapped 2026" (L→R), plus New Ali Content after Ch.02.
 * Dropped the old actual-life black cover. First screen = Figma 01 Intro.
 */
const CHAPTER_TOC = [
  { id: "chapter-1-artist", title: "Your Soundtrack", subtitle: "ch. 01" },
  { id: "chapter-2-car", title: "Main Character Vehicle", subtitle: "ch. 02" },
  { id: "stat-chipotle", title: "Chipotle Minutes", subtitle: "your stats" },
  { id: "stat-mythology", title: "Greek Mythology", subtitle: "your stats" },
  { id: "stat-mo", title: "Communicating to Mo", subtitle: "your stats" },
  { id: "bonus-cologne", title: "Guess the Cologne", subtitle: "bonus" },
  { id: "bonus-poker", title: "Morongo vs Home Poker", subtitle: "your stats" },
  { id: "chapter-3-order", title: "Most Ordered Personality Trait", subtitle: "ch. 03" },
  { id: "bonus-bowl", title: "Make Your Own Chipotle Bowl", subtitle: "bonus" },
  { id: "chapter-4-miles", title: "Miles This Year", subtitle: "ch. 04" },
  { id: "chapter-5-talking", title: "Minutes Spent Talking", subtitle: "ch. 05" },
  { id: "bonus-quiz", title: "How Well Do You Know Ali", subtitle: "bonus" },
  { id: "chapter-6-stories", title: "Stories Told More Than Once", subtitle: "ch. 06" },
  { id: "chapter-7-heart", title: "Heart Size Off the Charts", subtitle: "ch. 07" },
  { id: "bonus-lineup", title: "Your Starting Lineup", subtitle: "ch. 08" },
  { id: "bonus-timeline", title: "Glow Up Timeline", subtitle: "ch. 09" },
  { id: "bonus-achievements", title: "Achievements Unlocked", subtitle: "ch. 10" },
  { id: "bonus-screentime", title: "Screen Time", subtitle: "ch. 11" },
  { id: "bonus-topsearches", title: "Top Searches", subtitle: "ch. 12" },
  { id: "bonus-redflags", title: "Red Flags", subtitle: "ch. 13" },
  { id: "bonus-greenflags", title: "Green Flags", subtitle: "ch. 14" },
  { id: "bonus-predictions", title: "Predictions for 22", subtitle: "ch. 15" },
  { id: "chapter-8-final", title: "Final Slide", subtitle: "final" },
];

function formatContributors(names) {
  if (!names || names.length === 0) return "his friends";
  const MAX = 6;
  if (names.length === 1) return names[0];
  if (names.length <= MAX) return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
  return `${names.slice(0, MAX).join(", ")} & ${names.length - MAX} more`;
}

export default function Home() {
  const [audioReady, setAudioReady] = useState(false);
  const [activeMemory] = useState(memories[0]);
  const wrapped = useWrappedData();
  const submittedMemories = useMemoriesData();

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
      { id: "credits-opening", content: <OpeningCreditsChapter /> },
      { id: "chapter-menu", content: <ChapterMenu chapters={CHAPTER_TOC} /> },
      { id: "chapter-1-artist", content: <FavoriteArtistCard /> },
      { id: "chapter-2-car", content: <CarChapter /> },
      { id: "stat-chipotle", content: <PersonalStatsChapter statId="chipotle" /> },
      { id: "stat-mythology", content: <PersonalStatsChapter statId="mythology" /> },
      { id: "stat-mo", content: <PersonalStatsChapter statId="mo" /> },
      { id: "bonus-cologne", content: <CologneChapter /> },
      { id: "bonus-poker", content: <PokerChapter /> },
      { id: "chapter-3-order", content: <PersonalityOrderChapter /> },
      { id: "bonus-bowl", content: <ChipotleBowlChapter /> },
      { id: "chapter-4-miles", content: <RunnerMilesChapter /> },
      { id: "chapter-5-talking", content: <TalkingMinutesChapter /> },
      { id: "bonus-quiz", content: <AliOrElseQuizChapter /> },
      { id: "chapter-6-stories", content: <StoriesChapter /> },
      { id: "chapter-7-heart", content: <HeartSizeChapter topMemory={wrapped.data?.topMemory ?? null} /> },
      { id: "bonus-lineup", content: <StartingLineupChapter /> },
      {
        id: "bonus-timeline",
        content: <GlowUpTimelineChapter status={wrapped.status} timeline={wrapped.data?.memoryTimeline} />,
      },
      { id: "bonus-achievements", content: <AchievementsChapter /> },
      { id: "bonus-screentime", content: <ScreenTimeChapter /> },
      { id: "bonus-topsearches", content: <TopSearchesChapter /> },
      { id: "bonus-redflags", content: <RedFlagsChapter /> },
      { id: "bonus-greenflags", content: <GreenFlagsChapter /> },
      { id: "bonus-predictions", content: <PredictionsChapter /> },
      { id: "chapter-8-final", content: <FinalSlideChapter /> },
      { id: "credits-closing", content: <ClosingCreditsChapter directedBy={directedBy} /> },
      { id: "album-teaser", content: <AlbumTeaserCard /> },
      { id: "album-playlist", content: <AlbumPlaylistChapter /> },
    ];
  }, [wrapped.status, wrapped.data, submittedMemories.status, submittedMemories.contributors]);

  return (
    <main className="actual-life">
      <ScrollDeck cards={cards} />
      <AudioPlayer memory={activeMemory} entered={audioReady} ducked={false} />
      <Grain />
    </main>
  );
}
