import SectionTransition from "../SectionTransition";

/**
 * Shared "eyebrow → huge number/title → caption" hero layout used across the
 * Wrapped chapters (car, miles, talking-minutes, etc.) — reuses the same
 * .wrapped-card/.wrapped-number/.wrapped-title CSS as the original Spotify
 * stat screens this replaces, just fed with curated chapter content instead
 * of API data.
 */
export default function BigStatCard({
  accent = "wrapped-accent-green",
  className = "",
  kicker,
  big,
  isNumber = true,
  children,
}) {
  return (
    <SectionTransition className={`wrapped-card ${accent} ${className}`.trim()} variant="rise">
      <span className="wrapped-kicker">{kicker}</span>
      <div className="wrapped-body">
        <p className={isNumber ? "wrapped-number" : "wrapped-title"}>{big}</p>
        {children}
      </div>
    </SectionTransition>
  );
}
