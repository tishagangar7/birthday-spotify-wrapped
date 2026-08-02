import SectionTransition from "../SectionTransition";

/**
 * Shared layout for the paired "Red Flags" / "Green Flags" chapters — a
 * label (the flag itself) + supporting context, reusing the same
 * .wrapped-facts row pattern as the Car chapter.
 */
export default function FlagsChapter({ accent, kicker, heading, items }) {
  return (
    <SectionTransition className={`wrapped-card ${accent}`} variant="rise">
      <span className="wrapped-kicker">{kicker}</span>
      <div className="wrapped-body">
        <p className="wrapped-order-heading">{heading}</p>
        <ul className="wrapped-facts">
          {items.map((item) => (
            <li key={item.flag}>
              <span className="wrapped-facts-label">{item.flag}</span>
              <span>{item.context}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionTransition>
  );
}
