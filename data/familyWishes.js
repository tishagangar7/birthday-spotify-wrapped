/**
 * Family wishes — cinema film-reel clips.
 * Drop media in public/videos/family-wishes/{id}/
 * Paths below match the files currently on disk.
 *
 * Clip shapes:
 *   { video }                         — play video, advance on end
 *   { video, audio }                  — mute+loop video, play audio, advance on audio end
 *   { audio, name }                   — audio-only card, advance on audio end
 *   { text, name, image? }            — text card (optional photo), timed advance
 */

export const familyWishesChapter = {
  kicker: "from home",
  headline: "messages for ali",
  subheading: "a reel from the people who love you",
  emptyVideoLabel: "coming soon",
  prevLabel: "previous message",
  nextLabel: "next message",
  clips: [
    {
      id: "mom",
      name: "mom",
      video: "/videos/family-wishes/mom/mom.mp4",
    },
    {
      id: "dad",
      name: "dad",
      video: "/videos/family-wishes/dad/dad.mp4",
    },
    {
      id: "daadi",
      name: "daadi",
      video: "/videos/family-wishes/daadi/daadi.mp4",
    },
    {
      id: "brian",
      name: "brian",
      video: "/videos/family-wishes/brian/brian.mp4",
    },
    {
      id: "wish-6",
      name: "",
      video: "/videos/family-wishes/wish-6/clip.mp4",
    },
    {
      id: "wish-1",
      name: "",
      video: "/videos/family-wishes/wish-1/clip.mp4",
    },
    {
      id: "wish-2",
      name: "",
      video: "/videos/family-wishes/wish-2/clip.mp4",
    },
    {
      id: "wish-3",
      name: "",
      video: "/videos/family-wishes/wish-3/clip.mp4",
    },
    {
      id: "wish-4",
      name: "",
      video: "/videos/family-wishes/wish-4/clip.mp4",
    },
    {
      id: "wish-5",
      name: "",
      video: "/videos/family-wishes/wish-5/clip.mp4",
    },
    {
      id: "neil",
      name: "neil",
      audio: "/videos/family-wishes/neil/neil.m4a",
    },
    {
      id: "abhi-uncle",
      name: "abhi uncle",
      text: "Happy Birthday Ali…!!!\nMay this year bring all your wishes come true. Wishing you many more years of happiness and success, and may you continue to make some wonderful memories in your senior year…",
    },
    {
      id: "ruchi-aunty",
      name: "ruchi aunty",
      image: "/videos/family-wishes/ruchi-aunty/paratha.jpg",
      text: "Happy Birthday, Ali! 💕 Wishing you a truly wonderful year ahead filled with happiness, good health, and lots of success.\n\nI still can't wait to finally eat those parathas you kept claiming you could make! 😄 I wasn't sure your promise of making them for me would ever come true, but now it finally looks like it might! 😛\n\nJokes apart, you're genuinely a wonderful person, inside out. I'm really looking forward to spending more relaxed, fun, and chill time with you. Have an amazing birthday—you deserve the very best! 🥳🎂💕\n\nWith lots of love — your favorite Ruchi Aunty",
    },
    {
      id: "huzi",
      name: "huzi",
      video: "/videos/family-wishes/huzi/huzi-video.mp4",
      audio: "/videos/family-wishes/huzi/huzi-audio.m4a",
    },
    {
      id: "tishu",
      name: "tishu",
      video: "/videos/family-wishes/tishu/tishu.mp4",
    },
    {
      id: "maahir",
      name: "maahir",
      video: "/videos/family-wishes/maahir/maahir.mp4",
    },
    {
      id: "nabil",
      name: "nabil",
      video: "/videos/family-wishes/nabil/nabil.mp4",
    },
    {
      id: "haider",
      name: "haider",
      description: "gone but not forgotten · forever in our hearts",
      video: "/videos/family-wishes/haider/haider.mp4",
    },
    {
      id: "didi",
      name: "dua",
      description: "we saved the best for the last",
      video: "/videos/family-wishes/didi/dua.mp4",
    },
  ],
};
