// Exact gradient stops pulled from the Figma "Album Page" design (fileKey
// 3MPOLutTIDGqGWxnl7V7Db) — one dominant diagonal gradient per track, cycling
// through 10 combinations across the full tracklist. No real image assets
// needed; this is the site's generative "cover art" language applied to the
// album/friend pages.
const TRACK_GRADIENTS = [
  "linear-gradient(135deg, rgb(240, 69, 163) 14.286%, rgb(30, 215, 96) 85.714%)",
  "linear-gradient(135deg, rgb(74, 61, 191) 14.286%, rgb(33, 82, 158) 85.714%)",
  "linear-gradient(135deg, rgb(217, 84, 33) 14.286%, rgb(250, 212, 38) 85.714%)",
  "linear-gradient(135deg, rgb(13, 140, 166) 14.286%, rgb(13, 26, 36) 85.714%)",
  "linear-gradient(135deg, rgb(217, 46, 46) 14.286%, rgb(107, 56, 173) 85.714%)",
  "linear-gradient(135deg, rgb(30, 215, 96) 14.286%, rgb(38, 115, 229) 85.714%)",
  "linear-gradient(135deg, rgb(237, 64, 140) 14.286%, rgb(74, 61, 191) 85.714%)",
  "linear-gradient(135deg, rgb(250, 212, 38) 14.286%, rgb(217, 84, 33) 85.714%)",
  "linear-gradient(135deg, rgb(33, 82, 158) 14.286%, rgb(240, 69, 163) 85.714%)",
  "linear-gradient(135deg, rgb(107, 56, 173) 14.286%, rgb(30, 215, 96) 85.714%)",
];

const HERO_GRADIENT = "linear-gradient(135deg, rgb(217, 89, 140) 14.286%, rgb(102, 51, 128) 50%, rgb(30, 215, 96) 85.714%)";

/**
 * Generative gradient "cover art" — no real image asset needed. `variant="hero"`
 * renders the main album-cover gradient (pink → purple → green); otherwise a
 * track's `index` picks one of ten Figma-matched diagonal gradients so every
 * row in the tracklist reads as its own distinct "cover".
 */
export default function AlbumCoverArt({ index = 0, size = "hero", label, variant = "track" }) {
  const gradient = variant === "hero" ? HERO_GRADIENT : TRACK_GRADIENTS[index % TRACK_GRADIENTS.length];

  return (
    <div className={`album-cover album-cover-${size}`} style={{ backgroundImage: gradient }} aria-hidden={label ? undefined : "true"}>
      {size === "thumb" ? (
        <svg className="album-cover-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="22" height="22" rx="4" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" />
          <circle cx="8" cy="8.5" r="2.1" fill="rgba(255,255,255,0.55)" />
          <path d="M2.5 18.5L8.5 12.5L12.5 16.5L16.5 11L21.5 17.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      <div className="album-cover-grain" />
      {label ? <span className="album-cover-label">{label}</span> : null}
    </div>
  );
}
