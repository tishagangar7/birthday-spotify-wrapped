import fs from "fs";
import path from "path";

const GLOWUP_DIR = path.join(process.cwd(), "public/photos/glowup");
const SET2_DIR = path.join(GLOWUP_DIR, "new_glowup_imgs");
const IMAGE_RE = /\.(png|jpe?g|webp|gif)$/i;
/** Only true timeline slots: 01.jpg, 17.png — not UUID/IMG names. */
const NUMBERED_RE = /^(\d+)\.(png|jpe?g|webp|gif)$/i;
const SET_SIZE = 17;

function listImagesInDir(dir, urlPrefix, { numberedOnly = false } = {}) {
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((name) => IMAGE_RE.test(name) && !name.startsWith("."));

  if (numberedOnly) {
    const numbered = files.filter((name) => NUMBERED_RE.test(name));
    numbered.sort((a, b) => {
      const na = Number(a.match(NUMBERED_RE)[1]);
      const nb = Number(b.match(NUMBERED_RE)[1]);
      if (na !== nb) return na - nb;
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
    return numbered.map((name) => `${urlPrefix}/${name}`);
  }

  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  return files.map((name) => `${urlPrefix}/${name}`);
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Glow-up timeline photo sets (17 each).
 * Set 1: numbered 01–17 in public/photos/glowup/
 * Later sets: chunks of 17 from public/photos/glowup/new_glowup_imgs/
 */
export function listGlowUpPhotoSets() {
  const set1 = listImagesInDir(GLOWUP_DIR, "/photos/glowup", { numberedOnly: true }).slice(0, SET_SIZE);
  const extras = listImagesInDir(SET2_DIR, "/photos/glowup/new_glowup_imgs");
  const extraSets = chunk(extras, SET_SIZE);
  return [set1, ...extraSets].filter((set) => set.length > 0);
}

/** Flat list (set 1 only) — kept for any older callers. */
export function listGlowUpPhotos() {
  return listGlowUpPhotoSets()[0] ?? [];
}
