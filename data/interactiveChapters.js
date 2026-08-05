/**
 * Editable copy for the interactive Wrapped chapters.
 * Replace every [TODO] / placeholder with the real joke before sharing.
 */

/* ------------------------------------------------------------------ */
/* 1. Frat Performance Review                                         */
/* ------------------------------------------------------------------ */

export const fratReviewChapter = {
  kicker: "stats · annual review",
  headline: "frat performance review",
  employee: {
    name: "Ali Haryanawalla",
    frat: "AEPi",
    position: "Lieutenant Pledge Master",
    dues: "Paid on time (by Rohaan)",
  },
  beginLabel: "begin evaluation",
  competencies: [
    {
      id: "storytelling",
      title: "storytelling",
      score: 5,
      comment: "every four-minute incident receives a complete cinematic universe",
    },
    {
      id: "punctuality",
      title: "punctuality",
      score: 1,
      comment: "the event started at 8. ali started getting ready at 8.",
    },
    {
      id: "afters-motiv",
      title: "afters at motiv 24/7",
      score: 5,
      scoreLabel: "24/7",
      comment: "the party shuts. ali does not.",
    },
  ],
  maxScore: 5,
  managerFeedback: {
    body: "Ali consistently exceeds expectations in social stamina, storytelling and turning a quick appearance into a full shift.",
    improvement: 'Key area for improvement: understanding that “on my way” is a measurable statement.',
  },
  stamps: [
    { id: "promo", label: "PROMOTION RECOMMENDED" },
    { id: "punctuality", label: "PUNCTUALITY PLAN REQUIRED" },
    { id: "dayger", label: "10/10 DAYGER HOST" },
  ],
  finalRating: {
    label: "overall rating",
    value: "EXCEEDS EXPECTATIONS",
    closing: "the room is always better when he finally gets there.",
  },
  punctualityEasterEgg: "arriving soon...",
  nextStageLabels: ["begin evaluation", "continue review", "see stamps", "final rating"],
};

/* ------------------------------------------------------------------ */
/* 4. Motiv Platinum Status                                           */
/* ------------------------------------------------------------------ */

export const motivPlatinumChapter = {
  kicker: "stats · loyalty",
  headline: "motiv platinum status",
  subheading: "membership earned through commitment nobody requested.",
  tapHint: "tap card to verify status",
  card: {
    brand: "MOTIV",
    tier: "PLATINUM RESIDENT",
    memberName: "ALI",
    memberSince: "2023",
    memberNumber: "000021",
    status: "emotionally permanent",
  },
  stats: {
    visits: "170",
    hoursLogged: "8,400",
    bouncersDodged: "6",
    conversations: "9,000",
  },
  statLines: [
    { key: "visits", suffix: "visits completed" },
    { key: "hoursLogged", suffix: "hours logged" },
    { key: "bouncersDodged", suffix: "bouncers dodged" },
    { key: "conversations", suffix: "minutes spent making conversations with random people" },
  ],
  quickVisitLine: "“quick visit” success rate: 0%",
  tiers: ["Visitor", "Regular", "Gold", "Platinum", "Permanent Resident"],
  finalTier: "PERMANENT RESIDENT",
  nextReward: "his own set of keys",
  perks: [
    {
      id: "priority",
      title: "Priority Entry",
      detail: "mostly because he is best friends with Amanda",
    },
    {
      id: "extended",
      title: "Extended Stay",
      detail: "socialising outside for at least 30",
    },
  ],
  closingLabel: "member status",
  closingValue: "forever now because no more fake ids",
};

/* ------------------------------------------------------------------ */
/* 5. Which Ali Are You? — retro arcade character select              */
/* Drop transparent PNGs into public/images/ali-archetypes/           */
/* Names + stats are editable here without touching the carousel UI.  */
/* ------------------------------------------------------------------ */

export const whichAliChapter = {
  kicker: "stats · character select",
  headline: "which ali are you?",
  subheading: "choose your fighter.",
  selectLabel: "select fighter",
  chooseAgainLabel: "choose again",
  lockInLabel: "lock in",
  archetypes: [
    {
      id: "certified-lover-boy",
      name: "certified lover boy",
      image: "/images/ali-archetypes/certified-lover-boy.png",
      initials: "CL",
      accent: "#ef476f",
      tagline: "looking for a wife",
      stats: { heart: 100, texting: 97, charm: 94 },
      specialMove: "knows the game too well",
      weakness: "seen with no reply",
    },
    {
      id: "racer-ali",
      name: "racer ali",
      image: "/images/ali-archetypes/racer-ali.png",
      initials: "RA",
      accent: "#ff9f1c",
      tagline: "aux up. windows down. eta: optimistic.",
      stats: { speed: 99, cool: 100, night: 88 },
      specialMove: "the golden-hour pull-up",
      weakness: "speed limits",
    },
    {
      id: "bedrot-ali",
      name: "bedrot ali",
      image: "/images/ali-archetypes/bedrot-ali.png",
      initials: "BA",
      accent: "#7c6cf0",
      tagline: "horizontal since 3am. scroll integrity non-negotiable.",
      stats: { sleep: 100, lore: 92, yap: 41 },
      specialMove: "one more reel",
      weakness: "daylight",
    },
    {
      id: "sauna-ali",
      name: "sauna ali",
      image: "/images/ali-archetypes/sauna-ali.png",
      initials: "SA",
      accent: "#ef476f",
      tagline: "immune to reasonable exit times.",
      stats: { endurance: 100, hydration: 12, recovery: 7 },
      specialMove: "one more round",
      weakness: "whoop notifications",
    },
    {
      id: "rave-ali",
      name: "rave ali",
      image: "/images/ali-archetypes/rave-ali.png",
      initials: "RV",
      accent: "#2ec4b6",
      tagline: "glow stick diplomacy. headphones as personality.",
      stats: { aux: 100, energy: 96, networking: 88 },
      specialMove: "the afters invite",
      weakness: "closing time",
    },
    {
      id: "table-tennis-champ",
      name: "table tennis champ",
      image: "/images/ali-archetypes/table-tennis-champ.png",
      initials: "TT",
      accent: "#4cc9f0",
      tagline: "paddle up. trash talk calibrated. rematch assumed.",
      stats: { reflexes: 98, spin: 100, stamina: 86 },
      specialMove: "the unreturnable serve",
      weakness: "losing gracefully",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 6. The Ali Wrapped Awards                                          */
/* ------------------------------------------------------------------ */

export const awardsChapter = {
  kicker: "awards",
  headline: "the ali wrapped awards",
  subheading: "one nominee. absolutely no competition.",
  openFirstLabel: "open first envelope",
  nextAwardLabel: "next award",
  acceptLabel: "accept award",
  birthdayLine: "happy 21st, ali.",
  andTheAwardGoesTo: "and the award goes to...",
  trophyImage: "/photos/award/2DF3CAF4-5F71-42FB-9C8C-ABF4424F0FF8.jpeg",
  trophyAlt: "Academy Award for Best Performance — Ali",
  trophyCaption: "Academy Award for Best Performance",
  awards: [
    {
      id: "supporting-driver",
      category: "best supporting driver",
      winner: "ali",
      citation: "for refusing public transport on behalf of the entire group",
      stat: "3k miles",
      tone: "comedy",
    },
    {
      id: "unsolicited-explanation",
      category: "longest unsolicited explanation",
      winner: "ali",
      citation: "for entertaining anjora's endless yaps, from tahoe all nighter to sne larping",
      stat: "runtime: atleast 3h",
      tone: "comedy",
    },
    {
      id: "home-poker",
      category: "best financial comeback",
      winner: "ali",
      citation: "for recovering at home what morongo tried to take away",
      stat: "[maybe]",
      tone: "comedy",
    },
    {
      id: "ground-beef",
      category: "best cook among the 210 boys",
      winner: "ali",
      citation: "for the ground beef and potato",
      stat: "unanimous decision",
      tone: "warm",
    },
  ],
  friendSignatures: ["T", "M", "S", "A", "R", "K"],
};

/* ------------------------------------------------------------------ */
/* 10. Unlock New Life Skins                                          */
/* Sprites: public/images/life-skins/{id}.png                         */
/* ------------------------------------------------------------------ */

export const lifeSkinsChapter = {
  kicker: "stats · life skins",
  headline: "unlock new life skins",
  subheading: "tap a locked skin. collect the full set.",
  coins: "x 999",
  hearts: 4,
  unlockLabel: "unlock",
  unlockedLabel: "unlocked",
  closing: "full wardrobe acquired. ali.exe is running every skin at once.",
  skins: [
    {
      id: "heart-locked",
      title: "Heart Locked",
      subtitle: "Likes: 99+",
      sprite: "/images/life-skins/heart-locked.png",
      accent: "#b14cff",
      titleColor: "#ffd84d",
    },
    {
      id: "luxury-drive",
      title: "Luxury Drive",
      subtitle: "Dream Speed",
      sprite: "/images/life-skins/luxury-drive.png",
      accent: "#39ff14",
      titleColor: "#ffd84d",
    },
    {
      id: "marathon-run",
      title: "Marathon Run",
      subtitle: "5K → 10K",
      sprite: "/images/life-skins/marathon-run.png",
      accent: "#4ecbff",
      titleColor: "#7ad7ff",
    },
    {
      id: "doomscroll",
      title: "Doomscroll",
      subtitle: "3AM Ctrl + Scroll",
      sprite: "/images/life-skins/doomscroll.png",
      accent: "#7b3cff",
      titleColor: "#ff4fd8",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Top searches — enhanced interaction copy                           */
/* ------------------------------------------------------------------ */

export const topSearchesChapter = {
  kicker: "stats · top searches",
  headline: "his search history, allegedly:",
  queryPlaceholder: "search the archive…",
  footer: "browser history: cleared. these remain.",
};

/* ------------------------------------------------------------------ */
/* Social media podium                                                */
/* ------------------------------------------------------------------ */

export const socialMediaPodiumChapter = {
  kicker: "stats · social media",
  headline: "scroll rankings",
  subheading: "hours of thoughtful engagement. allegedly.",
  places: [
    {
      id: "linkedin",
      place: 3,
      platform: "LinkedIn",
      metric: "scrolls",
      countTo: 420,
      durationMs: 1600,
    },
    {
      id: "instagram",
      place: 2,
      platform: "Instagram Reels",
      metric: "reels",
      countTo: 5081,
      durationMs: 2200,
    },
    {
      id: "twitter",
      place: 1,
      platform: "Twitter",
      metric: "scrolls",
      countTo: 210,
      durationMs: 2000,
      /** Morph digits of the final count into letters, right → left (0→m, 1→v, 2→n). */
      punchlineMorph: ["n", "v", "m"],
      punchlineFromEnd: true,
      punchlineStepMs: 90,
      punchlineDelayMs: 80,
    },
  ],
};
