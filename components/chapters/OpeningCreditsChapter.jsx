import SectionTransition from "../SectionTransition";

/** Figma frame: 02 Opening Credits — single title card */
export default function OpeningCreditsChapter() {
  return (
    <SectionTransition className="wrapped-card wrapped-accent-purple credits-stack" variant="fade" duration={1.1}>
      <span className="wrapped-kicker">a true story</span>
      <p className="credits-stack-sub">based on real events</p>

      <div className="credits-stack-block">
        <span className="wrapped-kicker">starring</span>
        <p className="wrapped-title credits-value">ali</p>
      </div>

      <div className="credits-stack-block">
        <span className="wrapped-kicker">directed by</span>
        <p className="wrapped-title credits-value credits-value-sm">his friends</p>
      </div>

      <div className="credits-stack-block">
        <span className="wrapped-kicker">written by</span>
        <p className="wrapped-title credits-value credits-value-sm">everyone who knows him</p>
      </div>

      <p className="credits-years">2005 — 2026</p>
    </SectionTransition>
  );
}
