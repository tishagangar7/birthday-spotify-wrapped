import SectionTransition from "../SectionTransition";

/**
 * A single movie-credit-style title card — "LABEL" (small, uppercase) above
 * a big Archivo value line. Shared by the Opening Credits sequence (right
 * after the Intro) and the Closing Credits sequence (right after the Final
 * Slide), so both sides of the deck feel like the same title sequence.
 */
export default function CreditsCard({ accent = "wrapped-accent-green", label, value }) {
  return (
    <SectionTransition className={`wrapped-card credits-card ${accent}`} variant="fade" duration={1.1}>
      <span className="wrapped-kicker">{label}</span>
      <p className="wrapped-title credits-value">{value}</p>
    </SectionTransition>
  );
}
