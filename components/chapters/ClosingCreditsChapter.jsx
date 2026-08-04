import SectionTransition from "../SectionTransition";

/** Figma frame: 20 Closing Credits */
export default function ClosingCreditsChapter({ directedBy = "his friends" }) {
  return (
    <SectionTransition className="wrapped-card wrapped-accent-green credits-stack" variant="fade" duration={1.1}>
      <span className="wrapped-kicker">stats · closing credits</span>

      <div className="credits-stack-block">
        <span className="wrapped-kicker">directed by</span>
        <p className="wrapped-title credits-value credits-value-sm">{directedBy}</p>
      </div>

      <div className="credits-stack-block">
        <span className="wrapped-kicker">written by</span>
        <p className="wrapped-title credits-value credits-value-sm">everyone who loves him</p>
      </div>

      <div className="credits-stack-block">
        <span className="wrapped-kicker">runtime</span>
        <p className="wrapped-title credits-value">21 years</p>
      </div>

      <p className="credits-years">happy 21st, ali.</p>
    </SectionTransition>
  );
}
