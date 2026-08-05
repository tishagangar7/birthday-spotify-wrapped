import { photos } from "./memories";

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
];

/** Playlist features — one track per friend. */
const FRIENDS = [
  ["luke", "before any of us knew what we were doing"],
  ["rohaan", "same street, every summer"],
  ["madhav", "we don't talk about this one"],
  ["tisha", "three songs on repeat"],
  ["chaavan", "somewhere after midnight"],
  ["naavya", "the disposable camera"],
  ["shayan", "your blue era"],
  ["anjora", "the long way home"],
  ["kangna", "no context survived"],
  ["nehchal", "one very ordinary perfect day"],
  ["rajshree", "the year everything moved"],
];

/** Per-friend cover art (Actual Life filtered on the album page). */
const FRIEND_COVERS = {
  luke: {
    src: "/photos/friends/luke-v2.png",
    color: "red",
    alt: "luke",
    filename: "LUKE.JPG",
  },
  rohaan: {
    src: "/photos/friends/rohaan.png",
    color: "yellow",
    alt: "rohaan",
    filename: "ROHAAN.JPG",
  },
  madhav: {
    src: "/photos/friends/madhav-v2.png",
    color: "blue",
    alt: "madhav",
    filename: "MADHAV.JPG",
  },
  tisha: {
    src: "/photos/friends/tisha.png",
    color: "blue",
    alt: "tisha",
    filename: "TISHA.JPG",
  },
  chaavan: {
    src: "/photos/friends/chaavan.png",
    color: "yellow",
    alt: "chaavan",
    filename: "CHAAVAN.JPG",
  },
  naavya: {
    src: "/photos/friends/naavya.png",
    color: "yellow",
    alt: "naavya",
    filename: "NAAVYA.JPG",
  },
  shayan: {
    src: "/photos/friends/shayan.png",
    color: "red",
    alt: "shayan",
    filename: "SHAYAN.JPG",
  },
  kangna: {
    src: "/photos/friends/kangna.png",
    color: "yellow",
    alt: "kangna",
    filename: "KANGNA.JPG",
  },
  nehchal: {
    src: "/photos/friends/nehchal.png",
    color: "red",
    alt: "nehchal",
    filename: "NEHCHAL.JPG",
  },
  rajshree: {
    src: "/photos/friends/rajshree.png",
    color: "blue",
    alt: "rajshree",
    filename: "RAJSHREE.JPG",
  },
};

/** Per-friend audio — real tracks for the now-playing bar. */
const FRIEND_SONGS = {
  luke: {
    src: "/audio/friends/luke-carlos-make-it-thru.mp3",
    title: "Carlos (Make It Thru)",
  },
  rohaan: {
    src: "/audio/friends/rohaan-hannah-the-sun.mp3",
    title: "Hannah (The Sun)",
  },
  madhav: {
    src: "/audio/friends/madhav-bleu.mp3",
    title: "Bleu (28.10.2022)",
  },
  tisha: {
    src: "/audio/friends/tisha-ten.mp3",
    title: "ten",
  },
};

/** Per-friend lyric / message copy. */
const FRIEND_MESSAGES = {
  luke: "[placeholder for now replace w lukes message]",
  rohaan: "[placeholder for now replace w rohaan's message]",
  madhav: "[placeholder for now replace w madhav's message]",
  tisha: "[placeholder for now replace w tisha's message]",
  chaavan: "[placeholder for now replace w chaavan's message]",
  naavya: "[placeholder for now replace w naavya's message]",
  shayan: "[placeholder for now replace w shayan's message]",
  kangna: "[placeholder for now replace w kangna's message]",
  nehchal: "[placeholder for now replace w nehchal's message]",
  rajshree: "[placeholder for now replace w rajshree's message]",
};

const dates = [
  ["jun 18 2017", "1:23 am", "santa cruz, ca"],
  ["sep 02 2018", "8:44 pm", "somebody's kitchen"],
  ["mar 14 2019", "12:09 am", "northbound"],
  ["jul 31 2020", "4:52 pm", "the park"],
  ["nov 12 2020", "9:17 pm", "online, mostly"],
  ["may 23 2021", "6:31 pm", "the roof"],
  ["feb 05 2022", "2:14 am", "walking home"],
  ["aug 28 2022", "1:02 pm", "grandma's house"],
  ["jan 01 2023", "12:01 am", "no fixed address"],
  ["oct 19 2023", "4:38 pm", "east london"],
  ["jun 18 2024", "1:23 am", "everywhere"],
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

export const tracklist = FRIENDS.map(([person, subtitle], index) => {
  const [date, time, location] = dates[index];
  const cover = FRIEND_COVERS[person];
  const song = FRIEND_SONGS[person];
  const photoIndex = (index * 2) % photos.length;

  return {
    id: index + 1,
    person,
    subtitle,
    year: String(2017 + index),
    date,
    time,
    location,
    color: cover?.color ?? ["red", "yellow", "blue"][index % 3],
    media: [
      cover
        ? {
            src: cover.src,
            alt: cover.alt,
            filename: cover.filename,
          }
        : {
            src: photos[photoIndex],
            alt: `ali — archive frame ${photoIndex + 1}`,
            filename: `ALI_${String(photoIndex + 1).padStart(4, "0")}.JPG`,
          },
    ],
    message:
      FRIEND_MESSAGES[person] ||
      "a placeholder from the archive.\nreplace this with the words\nonly you would know how to write.",
    voiceNote: "",
    song: song?.src || "",
    layout: "hero",
    slug: slugify(person),
    trackNumber: index + 1,
    duration: mockDuration(index + 1),
    nowPlaying: song?.title || FRED_AGAIN_TRACKS[index % FRED_AGAIN_TRACKS.length],
  };
});

export function findTrackBySlug(slug) {
  return tracklist.find((track) => track.slug === slug);
}
