import { photos } from "./memories";

/**
 * Actual Life playlist — Ali's photos split into three monochrome groups.
 * Filters on the playlist UI map 1:1 to these colors.
 */
const COLORS = ["red", "yellow", "blue"];

function chunkIntoThree(list) {
  const size = Math.ceil(list.length / 3);
  return {
    red: list.slice(0, size),
    yellow: list.slice(size, size * 2),
    blue: list.slice(size * 2),
  };
}

const chunks = chunkIntoThree(
  photos.map((src, index) => ({
    id: `ali-${String(index + 1).padStart(2, "0")}`,
    src,
    alt: `ali — actual life ${index + 1}`,
    filename: `ALI_${String(index + 1).padStart(4, "0")}.JPG`,
    index,
  }))
);

export const playlistGroups = {
  red: chunks.red.map((photo) => ({ ...photo, color: "red" })),
  yellow: chunks.yellow.map((photo) => ({ ...photo, color: "yellow" })),
  blue: chunks.blue.map((photo) => ({ ...photo, color: "blue" })),
};

export const playlistPhotos = [...playlistGroups.red, ...playlistGroups.yellow, ...playlistGroups.blue];

export const PLAYLIST_FILTERS = [
  { id: "all", label: "all" },
  ...COLORS.map((color) => ({ id: color, label: color })),
];

export function getPlaylistPhotos(filter = "all") {
  if (filter === "all") return playlistPhotos;
  return playlistGroups[filter] ?? playlistPhotos;
}
