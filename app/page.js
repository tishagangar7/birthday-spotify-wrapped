"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { memories } from "../data/memories";
import AlbumTeaserCard from "../components/AlbumTeaserCard";
import AudioPlayer from "../components/AudioPlayer";
import AchievementsChapter from "../components/chapters/AchievementsChapter";
import CarChapter from "../components/chapters/CarChapter";
import ChapterMenu from "../components/chapters/ChapterMenu";
import CreditsCard from "../components/chapters/CreditsCard";
import FavoriteArtistCard from "../components/chapters/FavoriteArtistCard";
import FinalSlideChapter from "../components/chapters/FinalSlideChapter";
import GlowUpTimelineChapter from "../components/chapters/GlowUpTimelineChapter";
import GreenFlagsChapter from "../components/chapters/GreenFlagsChapter";
import HeartSizeChapter from "../components/chapters/HeartSizeChapter";
import MilesChapter from "../components/chapters/MilesChapter";
import MusicMomentCard from "../components/chapters/MusicMomentCard";
import PersonalityOrderChapter from "../components/chapters/PersonalityOrderChapter";
import PredictionsChapter from "../components/chapters/PredictionsChapter";
import RedFlagsChapter from "../components/chapters/RedFlagsChapter";
import ScreenTimeChapter from "../components/chapters/ScreenTimeChapter";
import StartingLineupChapter from "../components/chapters/StartingLineupChapter";
import StoriesChapter from "../components/chapters/StoriesChapter";
import TalkingMinutesChapter from "../components/chapters/TalkingMinutesChapter";
import TopSearchesChapter from "../components/chapters/TopSearchesChapter";
import Finale from "../components/Finale";
import FoundYou from "../components/FoundYou";
import Grain from "../components/Grain";
import Intro from "../components/Intro";
import Outro from "../components/Outro";
import StoryDeck from "../components/StoryDeck";
import WelcomeCard from "../components/WelcomeCard";
import WrappedStat from "../components/WrappedStat";
import useMemoriesData from "../components/useMemoriesData";
import useWrappedData from "../components/useWrappedData";
import { getDisplayNames } from "../lib/anonymizeNames";

// The Chapter Menu's table of contents — the single source of truth for
// "which cards count as a chapter" so the menu can never drift from the
// actual deck below. Structural/utility cards (credits, menu, memories,
// finale, outro) are intentionally left off this list.
const CHAPTER_TOC = [
  { id: "chapter-1-artist", title: "Your Soundtrack", subtitle: "fred again.. + real spotify data" },
  { id: "chapter-2-car", title: "Main Character Vehicle", subtitle: "his dream car" },
  { id: "bonus-achievements", title: "Achievements Unlocked", subtitle: "bonus chapter" },
  { id: "chapter-3-order", title: "Most Ordered Personality Trait", subtitle: "built to spec" },
  { id: "bonus-screentime", title: "Screen Time: It's Complicated", subtitle: "bonus chapter" },
  { id: "chapter-4-miles", title: "Miles This Year", subtitle: "on the run" },
  { id: "chapter-5-talking", title: "Minutes Spent Talking", subtitle: "an exaggeration, probably" },
  { id: "bonus-topsearches", title: "Top Searches", subtitle: "bonus chapter" },
  { id: "chapter-6-stories", title: "Stories Told More Than Once", subtitle: "the classics" },
  { id: "bonus-timeline", title: "Glow Up Timeline", subtitle: "the real archive, in order" },
  { id: "bonus-lineup", title: "Your Starting Lineup", subtitle: "bonus chapter" },
  { id: "bonus-redflags", title: "Red Flags (But We Love Him Anyway)", subtitle: "bonus chapter" },
  { id: "bonus-greenflags", title: "Green Flags", subtitle: "bonus chapter" },
  { id: "chapter-7-heart", title: "Heart Size: Off the Charts", subtitle: "the emotional turn" },
  { id: "bonus-predictions", title: "Bonus: Predictions for 22", subtitle: "closing thoughts" },
  { id: "chapter-8-final", title: "Final Slide", subtitle: "the reveal" },
];

function formatContributors(names) {
  if (!names || names.length === 0) return "everyone who showed up";
  const MAX = 6;
  if (names.length === 1) return names[0];
  if (names.length <= MAX) return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
  return `${names.slice(0, MAX).join(", ")} & ${names.length - MAX} more`;
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [activeMemory, setActiveMemory] = useState(memories[0]);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const wrapped = useWrappedData();
  const submittedMemories = useMemoriesData();
  const finale = memories[20];

  const cards = useMemo(() => {
    const statProps = { status: wrapped.status, data: wrapped.data, source: wrapped.source, needsAuth: wrapped.needsAuth };

    const list = [
      { id: "welcome", content: <WelcomeCard /> },

      // Opening credits — movie-style title cards right after the intro.
      { id: "credits-starring", content: <CreditsCard accent="wrapped-accent-green" label="starring" value="ali" /> },
      {
        id: "credits-directedby-open",
        content: <CreditsCard accent="wrapped-accent-purple" label="directed by" value="his friends" />,
      },
      {
        id: "credits-basedon",
        content: <CreditsCard accent="wrapped-accent-pink" label="based on" value="a true story" />,
      },
      {
        id: "credits-years",
        content: <CreditsCard accent="wrapped-accent-orange" label="production years" value="2005–2026" />,
      },

      { id: "bonus-lineup", content: <StartingLineupChapter /> },
      { id: "chapter-menu", content: <ChapterMenu chapters={CHAPTER_TOC} /> },
      { id: "album-teaser", content: <AlbumTeaserCard /> },

      // Chapter 1 — Your Soundtrack: curated Fred again.. content, plus real
      // /api/wrapped Spotify data (top artists/genre/song) where it fits.
      { id: "chapter-1-artist", content: <FavoriteArtistCard /> },
      { id: "chapter-1-top-artists", content: <WrappedStat statKey="topArtists" {...statProps} /> },
      { id: "chapter-1-top-genre", content: <WrappedStat statKey="topGenre" {...statProps} /> },
      { id: "chapter-1-top-song", content: <WrappedStat statKey="topSong" {...statProps} /> },
      { id: "chapter-1-moment", content: <MusicMomentCard /> },

      { id: "chapter-2-car", content: <CarChapter /> },
      { id: "bonus-achievements", content: <AchievementsChapter /> },
      { id: "chapter-3-order", content: <PersonalityOrderChapter /> },
      { id: "bonus-screentime", content: <ScreenTimeChapter /> },
      { id: "chapter-4-miles", content: <MilesChapter /> },
      { id: "chapter-5-talking", content: <TalkingMinutesChapter /> },
      { id: "bonus-topsearches", content: <TopSearchesChapter /> },
      { id: "chapter-6-stories", content: <StoriesChapter /> },
      {
        id: "bonus-timeline",
        content: <GlowUpTimelineChapter status={wrapped.status} timeline={wrapped.data?.memoryTimeline} />,
      },
    ];

    // Individual friend/memory pages are intentionally NOT part of this linear
    // deck anymore — they're reachable on-demand from the "actual life" album
    // tracklist (see app/album/[friend]/page.js), with their own back affordance
    // back to the tracklist. FoundYou stays here since it's a collective
    // collage moment (not a per-friend page), and doubles as a warm lead-in
    // to the heartfelt turn below.
    list.push({ id: "bonus-redflags", content: <RedFlagsChapter /> });
    list.push({ id: "bonus-greenflags", content: <GreenFlagsChapter /> });
    list.push({ id: "foundyou", content: <FoundYou /> });

    // Chapter 7 — Heart Size: Off the Charts (folds in the real archive's
    // topMemory blend from /api/wrapped when the backend provides it).
    list.push({ id: "chapter-7-heart", content: <HeartSizeChapter topMemory={wrapped.data?.topMemory ?? null} /> });

    list.push({
      id: "finale",
      content: <Finale memory={finale} onActive={setActiveMemory} onVoicePlayback={setVoicePlaying} />,
    });

    list.push({ id: "bonus-predictions", content: <PredictionsChapter /> });
    list.push({ id: "chapter-8-final", content: <FinalSlideChapter /> });

    // Closing credits — after the Final Slide, before the technical outro.
    list.push({
      id: "credits-directedby-close",
      content: (
        <CreditsCard
          accent="wrapped-accent-purple"
          label="directed by"
          value={
            submittedMemories.status === "loading"
              ? "…"
              : formatContributors(getDisplayNames(submittedMemories.contributors))
          }
        />
      ),
    });
    list.push({
      id: "credits-writtenby",
      content: <CreditsCard accent="wrapped-accent-pink" label="written by" value="everyone who loves him" />,
    });
    list.push({
      id: "credits-runtime",
      content: <CreditsCard accent="wrapped-accent-green" label="runtime" value="21 years" />,
    });

    list.push({ id: "outro", content: <Outro finale={finale} /> });

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapped.status, wrapped.data, wrapped.source, wrapped.needsAuth, submittedMemories.status, submittedMemories.contributors]);

  return (
    <main className="actual-life">
      <AnimatePresence>{!entered ? <Intro onEnter={() => setEntered(true)} /> : null}</AnimatePresence>

      {entered ? <StoryDeck cards={cards} /> : null}

      <AudioPlayer memory={activeMemory} entered={entered} ducked={voicePlaying} />
      <Grain />
    </main>
  );
}
