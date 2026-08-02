/**
 * Curated, hand-written content for the "[Ali] Wrapped" narrative chapters —
 * a cinematic recap of who he is, not just what he streamed. Unlike
 * `data/memories.js` (per-friend memories) this file is pure editorial copy
 * for the Wrapped story deck (see components/chapters/*.jsx + app/page.js).
 *
 * Everything here is placeholder content written to feel specific rather than
 * generic — swap in real details (his actual dream car, real quotes people
 * say about him, real running stats, etc.) whenever they're ready. Nothing in
 * this file is fetched from an API; it ships with the app.
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

export const personalityTraits = [
  { label: "chronically late", detail: "but always brings a good excuse" },
  { label: "will fight you over aux privileges", detail: "and win" },
  { label: "remembers everyone's coffee order", detail: "since the year you met him" },
  { label: "unreasonably competitive at board games", detail: "monopoly is not safe" },
  { label: "shows up when it actually matters", detail: "every single time" },
];

export const milesChapter = {
  miles: 412,
  comparison: "that's roughly a straight line from here to the coast and back.",
  motivationalNote: "half of it run before 7am, out of pure spite for snooze buttons.",
};

export const talkingChapter = {
  minutes: 214_500,
  comparison: "enough to explain the plot of every movie he's ever half-watched, twice.",
  joke: "and he'll still say \"quick story\" before starting a 20 minute one.",
};

export const recurringStories = [
  { title: "the airport story", quote: "\"we made the gate with four minutes to spare\"", tellCount: 47 },
  { title: "the group chat incident", quote: "\"i'm not saying who did it but it was madhav\"", tellCount: 33 },
  { title: "the disposable camera reveal", quote: "\"i forgot we even took that photo\"", tellCount: 21 },
  { title: "the one about the flight home", quote: "\"you had to be there\"", tellCount: 18 },
];

export const heartMessages = [
  {
    from: "mum",
    message: "he has shown up for every single person in this archive at least once — usually at 2am, usually without being asked.",
  },
  {
    from: "zain",
    message: "the most generous person i know with his time, his car, and his last slice of pizza.",
  },
  {
    from: "sara",
    message: "he remembers the small things — the exact way you take your coffee, the thing you mentioned once in passing. that's rare.",
  },
];

export const finalSlide = {
  headline: "made because of him",
  body: "every chapter in this archive exists because he's the kind of person people want to remember things about. happy 21st.",
};

// ---- Bonus chapters ----

export const startingLineup = [
  { position: "captain", name: "zain", note: "day-one friend, still starting every lineup" },
  { position: "point guard", name: "sara", note: "runs the group chat like a full-time job" },
  { position: "wildcard", name: "madhav", note: "responsible for at least 40% of the chaos" },
  { position: "bench (but clutch)", name: "tisha", note: "shows up right when it counts" },
];

export const achievements = [
  { title: "Group Chat MVP", detail: "sent the most voice notes no one asked for" },
  { title: "Perfect Attendance", detail: "showed up to every birthday since 2014" },
  { title: "Speedrun Any Room", detail: "makes new friends before the appetizers arrive" },
  { title: "Aux Cord Veteran", detail: "500+ hours logged behind the wheel and the wheel of fortune (the playlist)" },
  { title: "Night Owl", detail: "unlocked for texting back fastest between 1–3am" },
];

export const screenTime = {
  hoursPerDay: 6.4,
  mostUsedApp: "notes app (all drafts, no sent messages)",
  funnyNote: "reports his screen time is \"down 12% this week\" every single week.",
};

export const topSearches = [
  "is it normal to text this much",
  "best 24 hour diners near me",
  "how to fix aux cord static",
  "why do we say \"one more episode\" and mean four",
  "gas station open right now",
];

export const redFlags = [
  { flag: "double texts within 30 seconds", context: "and somehow it's never annoying" },
  { flag: "will not admit he's lost", context: "the GPS says otherwise" },
  { flag: "\"five more minutes\" means forty", context: "every single time, no exceptions" },
];

export const greenFlags = [
  { flag: "remembers your order without asking", context: "every time, no matter how long it's been" },
  { flag: "first to offer his jacket", context: "even when he's the one who's cold" },
  { flag: "actually listens", context: "asks the follow-up question three weeks later" },
];

export const predictions = [
  "finally gets that porsche (probably a toy one first)",
  "starts a podcast, quits after two episodes, we still hype it up",
  "somehow gets even better at remembering everyone's order",
  "hosts a birthday even bigger than this one",
];

