const PHOTO_COUNT = 49;

/** Real Ali camera roll — drop more files in /public/photos/ali as ali-XX.jpg */
export const photos = Array.from({ length: PHOTO_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/photos/ali/ali-${n}.jpg`;
});

const people = [
  ["tisha", "before any of us knew what we were doing"],
  ["mum", "the first camera roll"],
  ["dad", "you refused to look at the lens"],
  ["zain", "same street, every summer"],
  ["maya", "we missed the last train"],
  ["madhav", "we don't talk about this one"],
  ["sara", "three songs on repeat"],
  ["arjun", "somewhere after midnight"],
  ["nina", "the disposable camera"],
  ["the school group", "none of this was planned"],
  ["sam", "your blue era"],
  ["leah", "the long way home"],
  ["the cousins", "annual evidence"],
  ["jay", "no context survived"],
  ["isha", "one very ordinary perfect day"],
  ["everyone", "we found you"],
  ["the group chat", "do not zoom in"],
  ["noah", "the year everything moved"],
  ["home", "back where the archive started"],
  ["all of us", "almost twenty-one"],
  ["ali", "actual life"],
];

const layouts = [
  "hero",
  "phone",
  "split",
  "float",
  "overlap",
  "cinematic",
  "contact",
  "phone",
  "split",
  "hero",
  "float",
  "overlap",
  "cinematic",
  "contact",
  "phone",
  "found",
  "chaos",
  "split",
  "float",
  "overlap",
  "finale",
];

const dates = [
  ["oct 04 2005", "6:12 am", "home"],
  ["apr 16 2008", "3:40 pm", "the back garden"],
  ["jul 09 2011", "7:06 pm", "brighton"],
  ["aug 21 2013", "5:18 pm", "the old street"],
  ["dec 27 2015", "11:03 am", "london"],
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
  ["sep 07 2024", "2:46 am", "camera roll"],
  ["feb 22 2025", "7:57 pm", "platform 4"],
  ["dec 24 2025", "10:10 pm", "home"],
  ["jul 11 2026", "6:04 pm", "almost there"],
  ["oct 04 2026", "now", "here"],
];

const mediaFor = (index, layout) => {
  const count = layout === "contact" || layout === "chaos" || layout === "found" ? 6 : layout === "split" || layout === "overlap" ? 2 : 1;

  return Array.from({ length: count }, (_, offset) => {
    const photoIndex = (index * 2 + offset) % photos.length;
    return {
      src: photos[photoIndex],
      alt: `ali — archive frame ${photoIndex + 1}`,
      filename: `ALI_${String(photoIndex + 1).padStart(4, "0")}.JPG`,
    };
  });
};

export const memories = people.map(([person, subtitle], index) => {
  const [date, time, location] = dates[index];
  const layout = layouts[index];

  return {
    id: index + 1,
    person,
    subtitle,
    year: String(2005 + index),
    date,
    time,
    location,
    color: ["red", "yellow", "blue"][index % 3],
    media: mediaFor(index, layout),
    message:
      index === 20
        ? "these were the first 21 years.\nthanks for letting us be in them.\nhappy 21st, ali."
        : "a placeholder from the archive.\nreplace this with the words\nonly you would know how to write.",
    voiceNote: "",
    song: "",
    layout,
  };
});

export const foundYouPhotos = Array.from({ length: 12 }, (_, index) => ({
  src: photos[(index * 3) % photos.length],
  alt: `ali with friends, frame ${index + 1}`,
  color: ["red", "yellow", "blue"][index % 3],
}));
