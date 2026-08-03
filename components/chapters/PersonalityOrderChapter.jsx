import StaggeredList from "./StaggeredList";
import { personalityTraits } from "../../data/wrappedChapters";

/**
 * "Custom order" build-up: personality traits appear one at a time, like
 * watching a Chipotle order get assembled — building toward the full "order"
 * of who he is. See StaggeredList for the shared reveal animation.
 */
export default function PersonalityOrderChapter() {
  const items = personalityTraits.map((trait) => ({ label: trait.label, detail: trait.detail }));

  return (
    <StaggeredList
      accent="wrapped-accent-purple"
      kicker="chapter three · most ordered personality trait"
      heading="his chipotle order, built to spec:"
      items={items}
      footer="extra everything. no substitutions. bowl builder TBD."
    />
  );
}
