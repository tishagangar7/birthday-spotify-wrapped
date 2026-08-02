import { memories } from "./memories";

// Real fred again.. track titles used as flavor text for the "now playing" UI on
// each friend's page — no audio is actually streamed, this is purely aesthetic.
const FRED_AGAIN_TRACKS = [
  "Marea (we've lost dancing)",
  "Delilah (pull me out of this)",
  "Kyle (i found you)",
  "Billie (loving arms)",
  "Danielle (smile on my face)",
  "Turn on the lights again..",
  "Jungle",
  "Places to be",
  "Adore u",
  "Leavemealone",
  "Rumble",
  "Peavey",
];

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Deterministic mock duration (2:30–5:00), just for track-list authenticity.
const mockDuration = (id) => {
  const totalSeconds = 150 + ((id * 37) % 150);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

// One "track" per friend — everyone except the finale entry (Ali herself, who's
// the artist/subject of the album, not a feature on it).
export const tracklist = memories.slice(0, 20).map((memory, index) => ({
  ...memory,
  slug: slugify(memory.person),
  trackNumber: index + 1,
  duration: mockDuration(memory.id),
  nowPlaying: FRED_AGAIN_TRACKS[index % FRED_AGAIN_TRACKS.length],
}));

export function findTrackBySlug(slug) {
  return tracklist.find((track) => track.slug === slug);
}
