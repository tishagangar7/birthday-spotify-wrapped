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
  ["shayan", "your blue era"],
  ["anjora", "the long way home"],
  ["kangna", "no context survived"],
  ["nehchal", "one very ordinary perfect day"],
  ["chaavan", "somewhere after midnight"],
  ["rajshree", "the year everything moved"],
  ["naavya", "the disposable camera"],
];

/** Tracks that open as a coming-soon page until their message lands. */
const COMING_SOON = new Set(["chaavan", "rajshree", "naavya"]);

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
  anjora: {
    src: "/photos/friends/anjora.png",
    color: "blue",
    alt: "anjora",
    filename: "ANJORA.JPG",
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
    src: "/audio/friends/luke-message.mp3",
    title: "a message from luke",
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
  shayan: {
    src: "/audio/friends/shayan-big-hen-steal-my-joy.mp3",
    title: "Big Hen (Steal My Joy)",
  },
  anjora: {
    src: "/audio/friends/anjora-danielle-smile-on-my-face.mp3",
    title: "Danielle (smile on my face)",
  },
  kangna: {
    src: "/audio/friends/kangna-marea-weve-lost-dancing.mp3",
    title: "Marea (we've lost dancing)",
  },
  nehchal: {
    src: "/audio/friends/nehchal-carlos-make-it-thru.mp3",
    title: "Carlos (Make It Thru)",
  },
};

/** Per-friend lyric / message copy. */
const FRIEND_MESSAGES = {
  luke: "PLAY THE AUDIO MESSAGE",
  rohaan:
    "Happy birthday brother, hope you have the best day. Still so grateful that I got to meet you as I entered college, found a friend who is so much more than just a friend, someone who I learn so much from, have so many memories with, some of the most interesting conversations I've had with anyone and someone who I love and respect so much. Couldn't thank you enough with words for everything you've done for me. Here's to an amazing birthday and an amazing year ahead, and many many more memories to come.\n\nHappy 21st twin, more life🙏🏻",
  madhav:
    "Happy Janamdin Mubarak, can’t believe you’re 21 have the best day week month year ahead i don’t have to say much for me to appreciate what bond we’ve made in the last couple years but I jist want you to know that you mean everything and more and to much more life cakes and candles you nonchalant monkey pig cow",
  tisha:
    "In your words: Actual Life (2005-2026) is the lock in set for this dedicated note I have been so ecstatic to write (make?) same thing, making this website was genuinely the most fun thing I have done this week, and I hope you had half the fun I did, I really wish we all could be there in person to celebrate the BIG 2 1, but we will celebrate even more once we all are back. Our brother sister bond has been roller coaster in the best way, and I cannot imagine a life without you now, ur the big brother I never asked for but am really grateful for , you rohaan madhu are family and I think ill never be able to express how grateful I am, im not great at writing these things, but I love you, keep smiling, keep spreading your energy, and I hope you like this little gift we all made, HAPPY BIRTHDAY SNOOP DAWGIE - with love scoop dawgie",
  chaavan: "[placeholder for now replace w chaavan's message]",
  naavya: "[placeholder for now replace w naavya's message]",
  shayan:
    "Happy birthday Ali!! You have been a very supportive friend people are very lucky to have you as a friend and ur smile oho mere Ap Dhillon!! Keep being great I love you and hope the moving years bring great joy and adventures.☺️",
  anjora:
    "Hi ali,\n\nWhen I think about our friendship, I get hit with a whirlwind of emotions. You are genuinely one of the realest, most insightful, funniest, and caring people I know. One thing I'll always admire about you is how fiercely you stand by the people you care about. There have been so many moments where you've said things that others might misunderstand, but after knowing you for so long, I've come to realize that it always comes from a place of wanting to protect and guide your friends. That's something I've grown to respect so much about you. It reminds me that you always have your friends' best interests at heart, even when it's not the easiest thing to say. I also admire how you're unapologetically yourself. You never change who you are based on who's in the room, and I hope you never lose that. I know for a fact that everyone in our group loves you for exactly who you are. I hope your 21st brings you so much growth, and new adventures. Happy 21st, Ali!!!",
  kangna:
    "happy birthday aliii! hope you have an amazing one, looking forward to many more accidental chef collabs😁",
  nehchal:
    "Happy Birthday you monkey!! I hope you have the most amazing day and year ahead, 21 is gonna be so much fun and we cant wait to make so so many more memories with you! I genuinely love how easy you are to talk to and joke with and I cant wait to be coming back to visit SC and try bullying and annoying you even more than last year - Nonch",
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
    comingSoon: COMING_SOON.has(person),
  };
});

export function findTrackBySlug(slug) {
  return tracklist.find((track) => track.slug === slug);
}
