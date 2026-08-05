import fs from "fs";
import path from "path";

const GLOWUP_DIR = path.join(process.cwd(), "public/photos/glowup");
const IMAGE_RE = /\.(png|jpe?g|webp|gif)$/i;
/** Only true timeline slots: 01.jpg, 17.png, 21.webp — not UUID/IMG names. */
const NUMBERED_RE = /^(\d+)\.(png|jpe?g|webp|gif)$/i;

/**
 * Lists glow-up timeline photos from public/photos/glowup/
 * Numbered files (01.jpg, 02.png, …) come first in numeric order,
 * then any other dropped files alphabetically.
 */
export function listGlowUpPhotos() {
  if (!fs.existsSync(GLOWUP_DIR)) return [];

  const files = fs
    .readdirSync(GLOWUP_DIR)
    .filter((name) => IMAGE_RE.test(name) && !name.startsWith("."));

  const numbered = [];
  const rest = [];

  for (const name of files) {
    if (NUMBERED_RE.test(name)) numbered.push(name);
    else rest.push(name);
  }

  numbered.sort((a, b) => {
    const na = Number(a.match(NUMBERED_RE)[1]);
    const nb = Number(b.match(NUMBERED_RE)[1]);
    if (na !== nb) return na - nb;
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  });

  rest.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  return [...numbered, ...rest].map((name) => `/photos/glowup/${name}`);
}
