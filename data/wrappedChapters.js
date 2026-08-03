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

/** Standalone "your stats" cards — not Spotify minutes. */
export const personalStats = [
  {
    id: "chipotle",
    kicker: "your stats · chipotle",
    big: "∞",
    isNumber: false,
    caption: "spent these many minutes at chipotle. the line is part of his personality now.",
    accent: "wrapped-accent-orange",
  },
  {
    id: "mythology",
    kicker: "your stats · greek mythology",
    big: "12h",
    isNumber: false,
    caption:
      "every night listening to greek mythology — then spent the same amount of time explaining it to the three of us.",
    accent: "wrapped-accent-purple",
  },
  {
    id: "mo",
    kicker: "your stats · communications",
    big: "2h+",
    isNumber: false,
    caption: "at least 2 hours every day trying to communicate to mo. a full-time unpaid internship.",
    accent: "wrapped-accent-pink",
  },
];

export const milesChapter = {
  miles: 412,
  comparison: "drag ALI through the obstacles — then we reveal how far he's actually gone.",
  motivationalNote: "whoop recovery score pending. sauna time does not count as cardio (he disagrees).",
};

/** Mini-runner: obstacles Ali dodges / hits while sliding. */
export const runnerObstacles = [
  { id: "sauna", label: "sauna", at: 18 },
  { id: "chipotle", label: "chipotle line", at: 38 },
  { id: "morongo", label: "morongo", at: 58 },
  { id: "mo", label: "texting mo", at: 78 },
];

export const talkingChapter = {
  minutes: 12 * 60 * 365,
  comparison: "twelve hours a night of mythology, times three captive friends who did not ask for this lecture series.",
  joke: "and he'll still say \"ok but hermes is underrated\" before starting another hour.",
};

export const recurringStories = [
  { title: "the mythology TED talk", quote: "\"ok but let me just explain the titanomachy real quick\"", tellCount: 47 },
  { title: "the mo dispatch", quote: "\"has he responded yet\" — every day", tellCount: 39 },
  { title: "the chipotle pilgrimage", quote: "\"i'm already in line\"", tellCount: 31 },
  { title: "the sauna disappearance", quote: "\"he's still in there\"", tellCount: 28 },
];

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
  kicker: "your stats · the tables",
  lostAt: "morongo",
  lostNote: "lost quite a bit at morongo.",
  wonAt: "home poker",
  wonNote: "made quite a bit at home poker games.",
  punchline: "the house always wins — unless the house is his living room.",
};

/** Guess the cologne — bottle shape tease, answer on reveal. */
export const cologneChapter = {
  kicker: "bonus · guess the cologne",
  prompt: "guess the cologne from the bottle shape.",
  hint: "silhouette only. no cheating.",
  answer: "TBD — swap in the real bottle name",
  bottleNote: "tall / rectangular / suspiciously expensive-looking.",
};

/**
 * How well do you know Ali — "said by Ali" vs "someone else".
 * `saidByAli: true` means Ali said it.
 */
export const aliOrElseQuiz = [
  {
    quote: "ok but let me just finish this one thought about hermes",
    saidByAli: true,
  },
  {
    quote: "he's still in the sauna",
    saidByAli: false,
  },
  {
    quote: "i'm already in the chipotle line",
    saidByAli: true,
  },
  {
    quote: "has mo responded yet",
    saidByAli: true,
  },
  {
    quote: "never again at morongo",
    saidByAli: true,
  },
  {
    quote: "he makes the best ground beef and potato",
    saidByAli: false,
  },
];

/**
 * Make-your-own Chipotle bowl — TBD for full interactivity.
 * Structure is ready; builder UI can light up later.
 */
export const chipotleBowl = {
  status: "ready",
  kicker: "bonus · build his bowl",
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
