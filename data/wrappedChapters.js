/**
 * Curated content for Ali's 21st Birthday Wrapped.
 * Edit freely — nothing here is API-fetched. Interactive chapters (quiz,
 * runner, cologne) read from the exports below.
 */

export const soundtrackChapter = {
  favoriteArtist: "fred again..",
  favoriteSong: {
    title: "Marea (we've lost dancing)",
    note: "the one that comes on and the whole room changes.",
  },
  concertMemory: {
    headline: "that one fred again.. set",
    body: "he queued for six hours in the rain, lost his voice by the second song, and still talks about the strobe drop on \"Delilah\" like it happened yesterday.",
  },
  musicMoment: {
    headline: "the emotional one",
    body: "\"Turn on the lights again..\" played at 4am on a drive home nobody wanted to end, and somehow it made the whole year make sense.",
  },
};

/** Page 3 — Wrapped-style top artists (static list, no audio). */
export const topArtists = [
  {
    rank: 1,
    name: "fred again..",
    slug: "fred-again",
    image: "/photos/artists/fred-again.jpg",
    label: "Artist",
    video: "/videos/artists/fred-again.mp4",
    videoTitle: "now playing: floor",
    videoCaption: "one of the best memories. can't wait for more.",
  },
  {
    rank: 2,
    name: "Subtronics",
    slug: "subtronics",
    image: "/photos/artists/subtronics.jpg",
    label: "Artist",
    video: "/videos/artists/subtronics.mp4",
    videoTitle: "now playing: crystallized",
    videoCaption: "can't wait to hear all about this day from u.",
  },
  {
    rank: 3,
    name: "Karan Aujla",
    slug: "karan-aujla",
    image: "/photos/artists/karan-aujla.jpg",
    label: "Artist",
    comingSoon: true,
  },
];

/** Page 2 — Wrapped-style top songs (replaces movie opening credits). */
export const topSongs = [
  {
    rank: 1,
    title: "5AM",
    artist: "Lil Baby",
    cover: "/photos/songs/5am.jpg",
    src: "/audio/top-songs/5am.mp3",
  },
  {
    rank: 2,
    title: "Julia (deep diving)",
    artist: "fred again..",
    cover: "/photos/songs/julia.jpg",
    src: "/audio/top-songs/julia.mp3",
  },
  {
    rank: 3,
    title: "American Pie",
    artist: "Don McLean",
    cover: "/photos/songs/american-pie.jpg",
    src: "/audio/top-songs/american-pie.mp3",
  },
  {
    rank: 4,
    title: "GREECE (feat. Drake)",
    artist: "DJ Khaled",
    cover: "/photos/songs/greece.jpg",
    src: "/audio/top-songs/greece.mp3",
  },
  {
    rank: 5,
    title: "Bachke Bachke - Unplugged",
    artist: "Karan Aujla",
    cover: "/photos/songs/bachke-bachke.jpg",
    src: "/audio/top-songs/bachke-bachke.mp3",
  },
];

export const carChapter = {
  dreamCar: "porsche 911 (any year, he's not picky)",
  currentCar: "a very tired honda civic named steve",
  drivingHabit: "changes the aux three songs into any car ride, no exceptions",
  funnyOpinion: "will die on the hill that roundabouts are more efficient than stop signs",
};

/** Chipotle-style personality build — also feeds the optional bowl builder. */
export const personalityTraits = [
  { label: "base", detail: "effortless charm" },
  { label: "protein", detail: "big loyalty energy" },
  { label: "toppings", detail: "greek mythology deep cuts" },
  { label: "salsa", detail: "extra hot confidence" },
  { label: "side", detail: "chronically late (small)" },
];

/** Standalone stats cards — not Spotify minutes. */
export const personalStats = [
  {
    id: "chipotle",
    bigStat: true,
    kicker: "stats · chipotle",
    big: "259,967",
    caption:
      "the number of times ali ordered a brown rice double chicken pinto bean queso bowl with very little red salsa — with a side of the cashier's number",
    accent: "wrapped-accent-orange",
  },
  {
    id: "mythology",
    kicker: "stats · greek mythology",
    big: "12h",
    isNumber: false,
    caption:
      "every night listening to greek mythology — then spent the same amount of time explaining it to the three of us.",
    accent: "wrapped-accent-purple",
  },
  {
    id: "mo",
    bigStat: true,
    kicker: "stats · youtube",
    big: "12,472",
    caption:
      "number of hours the birthday boy listened to youtube videos to fall asleep to",
    accent: "wrapped-accent-pink",
  },
];

export const milesChapter = {
  miles: 6.7,
  comparison: "drag ali to the finish — then we reveal how far he's actually gone.",
  motivationalNote: "and somehow still late to everything.",
};

export const talkingChapter = {
  minutes: 444000,
  minutesLabel: "444,000 K",
  comparison: "number of minutes we spent listening to our fav yapper",
  joke: "",
  video: "/videos/talking/yapper.mp4",
};

export const recurringStories = [
  { title: "the mythology TED talk", quote: "\"ok but let me just explain the titanomachy real quick\"", tellCount: 47 },
  { title: "the mo dispatch", quote: "\"has he responded yet\" — every day", tellCount: 39 },
  { title: "the chipotle pilgrimage", quote: "\"i'm already in line\"", tellCount: 31 },
  { title: "the sauna disappearance", quote: "\"he's still in there\"", tellCount: 28 },
];

/** Glow-up photo strip (childhood → now), left → right. */
export const glowUpPhotos = Array.from({ length: 17 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/photos/glowup/${n}.png`;
});

export const heartMessages = [
  {
    from: "mum",
    message: "he has shown up for every single person in this archive at least once — usually at 2am, usually without being asked.",
  },
  {
    from: "friend",
    message: "the most generous person we know with his time, his car, and his last slice of pizza.",
  },
  {
    from: "friend",
    message: "he remembers the small things — and somehow also every greek god's family tree.",
  },
];

export const finalSlide = {
  headline: "made because of him",
  body: "every chapter in this archive exists because he's the kind of person people want to remember things about. happy 21st.",
};

export const startingLineup = [
  { position: "captain", name: "friend 1", note: "day-one friend, still starting every lineup" },
  { position: "point guard", name: "friend 2", note: "runs the group chat like a full-time job" },
  { position: "wildcard", name: "friend 3", note: "responsible for at least 40% of the chaos" },
  { position: "bench (but clutch)", name: "friend 4", note: "shows up right when it counts" },
];

export const achievements = [
  { title: "Mythology Professor (unpaid)", detail: "12h nightly lectures, attendance mandatory" },
  { title: "Chipotle Frequent Flyer", detail: "minutes logged: uncountable" },
  { title: "Mo Whisperer", detail: "2h/day communications attempt streak" },
  { title: "Sauna Endurance", detail: "unlocked for staying until someone goes looking" },
  { title: "Home Game Hero", detail: "won quite a bit at home poker" },
];

export const screenTime = {
  hoursPerDay: 12,
  mostUsedApp: "greek mythology podcasts + whatever mo is on",
  funnyNote: "half of it is \"research,\" half of it is explaining the research.",
};

export const topSearches = [
  "how to speak persian",
  "10 ways to kill a bona",
  "how to snort addy",
  "what to do if the girl u like doesnt shave her armpits",
  "is it normal to spend 2 hrs in the sauna",
  "how to increase whoop recovery score",
];

export const redFlags = [
  { flag: "never takes public transport", context: "uber is a personality trait" },
  { flag: "chronically late", context: "the invite said 7; he heard 8:30" },
  { flag: "can't get out of the sauna", context: "send a search party after 90 minutes" },
];

export const greenFlags = [
  { flag: "makes the best ground beef and potato", context: "non-negotiable. bring a plate." },
  { flag: "will explain any myth until you get it", context: "whether you asked or not" },
  { flag: "shows up for the people he loves", context: "even when he's late" },
];

export const predictions = [
  "finally nails a whoop recovery score he's proud of",
  "gets out of the sauna in under two hours (once)",
  "mo actually responds on the first try",
  "hosts a birthday even bigger than this one",
];

/** Poker / casino money vibes. */
export const pokerChapter = {
  kicker: "stats · poker",
  setupLine: "number of times he pushed all in while playing poker",
  punchline: "number of times we called his bluff",
  countTo: 720,
};

/** 3-round silhouette quiz — all three are Ali's; each round gets harder. */
export const cologneChapter = {
  kicker: "guess the cologne",
  prompt: "identify the bottle from the silhouette.",
  options: [
    {
      id: "bleu-de-chanel",
      name: "Bleu de Chanel",
      silhouette: "/photos/cologne/bleu-de-chanel.png",
    },
    {
      id: "baccarat-rouge-540",
      name: "Baccarat Rouge 540",
      silhouette: "/photos/cologne/baccarat-rouge-540.png",
    },
    {
      id: "aventus",
      name: "Creed Aventus",
      silhouette: "/photos/cologne/aventus.png",
    },
  ],
  rounds: [
    {
      correctId: "bleu-de-chanel",
      difficulty: "easy",
      hint: "distinct square. start easy.",
      options: [
        { id: "sauvage", name: "Dior Sauvage" },
        { id: "bleu-de-chanel", name: "Bleu de Chanel" },
        { id: "acqua-di-gio", name: "Acqua di Gio" },
      ],
    },
    {
      correctId: "baccarat-rouge-540",
      difficulty: "medium",
      hint: "sharper edges. getting trickier.",
      options: [
        { id: "ysl-y", name: "YSL Y" },
        { id: "oud-wood", name: "Tom Ford Oud Wood" },
        { id: "baccarat-rouge-540", name: "Baccarat Rouge 540" },
      ],
    },
    {
      correctId: "aventus",
      difficulty: "hard",
      hint: "good luck — this one's mean.",
      options: [
        { id: "dior-homme", name: "Dior Homme" },
        { id: "aventus", name: "Creed Aventus" },
        { id: "spicebomb", name: "Viktor & Rolf Spicebomb" },
      ],
    },
  ],
  wrongFeedback: "not quite — try again.",
  correctFeedback: "yep.",
};

/**
 * Bonus filmstrip — clips we love.
 * Media in public/videos/loved-clips/ (dance first). Optional poster/caption TBD.
 * Schema: { id, src, type: 'video'|'image', caption?, poster? }
 */
export const lovedClips = [
  {
    id: "dance",
    type: "video",
    src: "/videos/loved-clips/dance.mp4",
  },
  {
    id: "clip-2",
    type: "video",
    src: "/videos/loved-clips/clip-2.mp4",
  },
  {
    id: "clip-3",
    type: "video",
    src: "/videos/loved-clips/clip-3.mp4",
  },
  {
    id: "clip-4",
    type: "video",
    src: "/videos/loved-clips/clip-4.mp4",
  },
  {
    id: "clip-5",
    type: "video",
    src: "/videos/loved-clips/clip-5.mp4",
  },
  {
    id: "clip-6",
    type: "video",
    src: "/videos/loved-clips/clip-6.mp4",
  },
  {
    id: "clip-7",
    type: "video",
    src: "/videos/loved-clips/clip-7.mp4",
  },
  {
    id: "clip-8",
    type: "video",
    src: "/videos/loved-clips/clip-8.mp4",
  },
  {
    id: "clip-9",
    type: "video",
    src: "/videos/loved-clips/clip-9.mp4",
  },
];

/**
 * How well do you know Ali — who said each quote.
 * After answering: feedback + optional video + Next (no auto-advance).
 */
export const aliOrElseQuiz = [
  {
    prompt: "who said it",
    quote: "good boy, sit down",
    options: [
      { id: "ali", label: "ali" },
      { id: "rohaan", label: "rohaan" },
    ],
    answer: "ali",
    video: "/videos/quiz/good-boy-sit-down.mp4",
  },
  {
    prompt: "who said it",
    quote: "TRENCHESSSS",
    options: [
      { id: "ali", label: "ali" },
      { id: "rohaan", label: "rohaan" },
    ],
    answer: "rohaan",
    video: "/videos/quiz/trenchessss.mp4",
  },
  {
    prompt: "who said it",
    quote: "the third user bucket i would put.....",
    options: [
      { id: "ali", label: "ali" },
      { id: "michelle", label: "michelle" },
    ],
    answer: "ali",
    video: "/videos/quiz/third-user-bucket.mp4",
  },
  {
    prompt: "who said it",
    quote: "you're good bro",
    options: [
      { id: "ali", label: "ali" },
      { id: "rohaan", label: "rohaan" },
    ],
    answer: "ali",
    image: "/photos/quiz/youre-good.png",
  },
];

/**
 * Make-your-own Chipotle bowl — TBD for full interactivity.
 * Structure is ready; builder UI can light up later.
 */
export const chipotleBowl = {
  status: "ready",
  kicker: "build his bowl",
  heading: "make your own chipotle bowl",
  note: "tap each line to cycle options, then lock it in.",
  defaults: [
    { step: "rice", pick: "white (obviously)" },
    { step: "beans", pick: "black" },
    { step: "protein", pick: "ground beef energy" },
    { step: "toppings", pick: "everything" },
    { step: "salsa", pick: "hot + mild on the side" },
  ],
};
