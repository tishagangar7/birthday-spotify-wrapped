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
/* 3. Hinge Unhinged                                                  */
/* ------------------------------------------------------------------ */

export const hingeUnhingedChapter = {
  kicker: "stats · dating",
  headline: "hinge unhinged",
  subheading: "a year of thoughtful decisions, outsourced to the group chat.",
  instruction: "swipe through the evidence",
  cards: [
    {
      id: "volume",
      type: "stat",
      headline: "[TODO: number]",
      caption: "profiles reviewed with the seriousness of an admissions committee",
      secondary: "[TODO: number] sent to the group chat for peer review",
    },
    {
      id: "response",
      type: "stat",
      headline: "[TODO: duration]",
      caption: "average time spent drafting a two-line reply",
      footnote: "three friends consulted. message still unsent.",
    },
    {
      id: "standards",
      type: "prompts",
      prompts: [
        {
          id: "pleasure",
          label: "simple pleasure",
          answer: "explaining greek mythology",
          annotation: "we told him not to write this",
        },
        {
          id: "sunday",
          label: "typical sunday",
          answer: "chipotle, sauna, recovery score of 7",
          annotation: "he wrote it anyway",
        },
        {
          id: "green-flag",
          label: "green flag i look for",
          answer: "willing to wait while i am running late",
          annotation: "match rate remains under review",
        },
      ],
    },
    {
      id: "funnel",
      type: "funnel",
      steps: [
        { label: "Profiles viewed", value: "[TODO]" },
        { label: "Likes considered", value: "[TODO]" },
        { label: "Screenshots sent for analysis", value: "[TODO]" },
        { label: "Messages drafted", value: "[TODO]" },
        { label: "Messages actually sent", value: "[TODO]" },
        { label: "Dates reached on time", value: "0" },
      ],
      collapseLabel: "final conversion rate",
      collapseValue: "emotionally significant",
    },
  ],
  matchCard: {
    name: "Ali",
    age: 21,
    prompts: [
      { label: "together we could", answer: "miss the reservation and get chipotle" },
      { label: "i geek out on", answer: "greek mythology at 3am" },
      { label: "my most irrational fear", answer: "public transport" },
    ],
    question: "would you match with ali?",
    yesLabel: "yes",
    groupChatLabel: "ask the group chat",
    groupChatBubbles: ["obviously", "he’ll be late though", "still obviously"],
    matchTitle: "IT’S A MATCH",
    closing: "somehow, the green flags cleared review.",
  },
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
  tiers: ["Visitor", "Regular", "Gold", "Platinum", "Permanent Resident"],
  finalTier: "PERMANENT RESIDENT",
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
/* 5. Which Ali Are You?                                              */
/* Drop sprites into public/images/ali-archetypes/ — see README there. */
/* ------------------------------------------------------------------ */

export const whichAliChapter = {
  kicker: "stats · character select",
  headline: "life skin for the day",
  subheading: "choose your character for the day",
  pressStart: "PRESS START",
  chooseLabel: "choose this ali",
  chooseAgainLabel: "choose again",
  lockInLabel: "lock in",
  hiddenArchetypeId: "actual-ali",
  konamiSequence: ["a", "l", "i"],
  archetypes: [
    {
      id: "mythology-professor",
      name: "mythology professor",
      sprite: "/images/ali-archetypes/mythology-professor.png",
      initials: "MP",
      accent: "#7c6cf0",
      tagline: "one question. two-hour answer.",
      stats: { lore: 100, sleep: 4, yap: 99 },
      specialMove: "the family tree",
      weakness: "brief explanations",
      resultLine: "your plans end when the lecture ends.",
    },
    {
      id: "chipotle-loyalist",
      name: "chipotle loyalist",
      sprite: "/images/ali-archetypes/chipotle-loyalist.png",
      initials: "CL",
      accent: "#e85d04",
      tagline: "double chicken. very little red salsa.",
      stats: { appetite: 100, loyalty: 99, variety: 2 },
      specialMove: "the usual order",
      weakness: "trying somewhere new",
      resultLine: "you got: chipotle loyalist. bowl integrity non-negotiable.",
    },
    {
      id: "sauna-final-boss",
      name: "sauna final boss",
      sprite: "/images/ali-archetypes/sauna-final-boss.png",
      initials: "SF",
      accent: "#ef476f",
      tagline: "immune to reasonable exit times.",
      stats: { endurance: 100, hydration: 12, recovery: 7 },
      specialMove: "one more round",
      weakness: "whoop notifications",
      resultLine: "your plans end when ali decides the sauna session ends.",
    },
    {
      id: "home-game-hero",
      name: "home game hero",
      sprite: "/images/ali-archetypes/home-game-hero.png",
      initials: "HG",
      accent: "#06d6a0",
      tagline: "confidence rises when the casino disappears.",
      stats: { bluff: 94, confidence: 100, morongo: 3 },
      specialMove: "one more hand",
      weakness: "the actual casino",
      resultLine: "all-in energy. home-game odds.",
    },
    {
      id: "fred-disciple",
      name: "fred again.. disciple",
      sprite: "/images/ali-archetypes/fred-disciple.png",
      initials: "FD",
      accent: "#4cc9f0",
      tagline: "future best friend of fred again..",
      stats: { aux: 100, networking: 88, delusion: 100 },
      specialMove: "best-friend application",
      weakness: "being left on read",
      resultLine: "application pending. friendship inevitable.",
    },
    {
      id: "designated-driver",
      name: "big-hearted driver",
      sprite: "/images/ali-archetypes/big-hearted-driver.png",
      initials: "BD",
      accent: "#ffd166",
      tagline: "late to the plan. first there when it matters.",
      stats: { heart: 100, driving: 99, punctuality: 8 },
      specialMove: "the 2am pickup",
      weakness: "public transport",
      resultLine: "the rare build that always shows up for everyone",
    },
  ],
  hiddenArchetype: {
    id: "actual-ali",
    name: "actual ali",
    sprite: "/images/ali-archetypes/actual-ali.png",
    initials: "AA",
    accent: "#1ed760",
    tagline: "classified build. founding members only.",
    stats: { mystery: 100, lore: 100, heart: 100 },
    specialMove: "being ali",
    weakness: "[REDACTED]",
    resultLine: "you found him. say less.",
  },
};

/* ------------------------------------------------------------------ */
/* 6. The Ali Wrapped Awards                                          */
/* ------------------------------------------------------------------ */

export const awardsChapter = {
  kicker: "stats · awards",
  headline: "the ali wrapped awards",
  subheading: "one nominee. absolutely no competition.",
  openFirstLabel: "open first envelope",
  nextAwardLabel: "next award",
  finalPreamble: "one final category.",
  acceptLabel: "accept award",
  birthdayLine: "happy 21st, ali.",
  andTheAwardGoesTo: "and the award goes to...",
  awards: [
    {
      id: "supporting-driver",
      category: "best supporting driver",
      winner: "ali",
      citation: "for refusing public transport on behalf of the entire group",
      stat: "[TODO: distance or number of drives]",
      tone: "comedy",
    },
    {
      id: "unsolicited-explanation",
      category: "longest unsolicited explanation",
      winner: "ali",
      citation: "for turning one greek mythology question into a full curriculum",
      stat: "runtime: 2h 14m",
      tone: "comedy",
    },
    {
      id: "sauna-residency",
      category: "outstanding achievement in sauna residency",
      winner: "ali",
      citation: "for consistently outlasting both reason and hydration",
      stat: "[TODO]",
      tone: "comedy",
    },
    {
      id: "home-poker",
      category: "best financial comeback",
      winner: "ali",
      citation: "for recovering at home what morongo tried to take away",
      stat: "[TODO]",
      tone: "comedy",
    },
    {
      id: "ground-beef",
      category: "best original recipe",
      winner: "ali",
      citation: "for the ground beef and potato that united a divided academy",
      stat: "unanimous decision",
      tone: "warm",
    },
    {
      id: "person-of-the-year",
      category: "person of the year",
      winner: "ali",
      citation:
        "for showing up for everyone, remembering the small things and making every room better",
      stat: "selected unanimously by the people who love him",
      tone: "heart",
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
/* 7. Red Flags Tribunal                                              */
/* ------------------------------------------------------------------ */

export const redFlagsChapter = {
  kicker: "stats · red flags",
  headline: "the tribunal convenes",
  subheading: "exhibit by exhibit. the defense will not be present.",
  stampLabel: "sustain",
  doneLabel: "case closed",
  closing: "guilty of being ali. sentence: another year of this.",
  flags: [
    {
      id: "uber",
      flag: "never takes public transport",
      context: "uber is a personality trait",
      verdict: "sustained. the tube remains theoretical.",
    },
    {
      id: "late",
      flag: "chronically late",
      context: "the invite said 7; he heard 8:30",
      verdict: "sustained. clocks are decorative.",
    },
    {
      id: "sauna",
      flag: "can't get out of the sauna",
      context: "send a search party after 90 minutes",
      verdict: "sustained. hydration filed as optional.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 8. Green Flags Clearing                                            */
/* ------------------------------------------------------------------ */

export const greenFlagsChapter = {
  kicker: "stats · green flags",
  headline: "and yet",
  subheading: "flip each card. the case for the defence.",
  revealHint: "tap to reveal evidence",
  doneLabel: "cleared",
  closing: "somehow, the green flags still win.",
  flags: [
    {
      id: "beef",
      flag: "makes the best ground beef and potato",
      context: "non-negotiable. bring a plate.",
      evidence: "kitchen diplomacy. unanimous.",
    },
    {
      id: "myth",
      flag: "will explain any myth until you get it",
      context: "whether you asked or not",
      evidence: "patience disguised as a lecture.",
    },
    {
      id: "show-up",
      flag: "shows up for the people he loves",
      context: "even when he's late",
      evidence: "arrival time negotiable. presence is not.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 9. Predictions Desk                                                */
/* ------------------------------------------------------------------ */

export const predictionsChapter = {
  kicker: "stats · predictions",
  headline: "calling it now",
  subheading: "seal each forecast. no refunds if he proves us wrong.",
  sealLabel: "lock in",
  sealedLabel: "locked",
  doneLabel: "forecast filed",
  closing: "check back next birthday. we keep receipts.",
  predictions: [
    {
      id: "whoop",
      text: "finally nails a whoop recovery score he's proud of",
      odds: "long shot",
    },
    {
      id: "sauna-exit",
      text: "gets out of the sauna in under two hours (once)",
      odds: "historic",
    },
    {
      id: "mo",
      text: "mo actually responds on the first try",
      odds: "miracle",
    },
    {
      id: "bday",
      text: "hosts a birthday even bigger than this one",
      odds: "inevitable",
    },
  ],
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
