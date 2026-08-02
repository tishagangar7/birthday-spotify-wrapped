import FlagsChapter from "./FlagsChapter";
import { redFlags } from "../../data/wrappedChapters";

export default function RedFlagsChapter() {
  return (
    <FlagsChapter
      accent="wrapped-accent-orange"
      kicker="bonus · red flags (but we love him anyway)"
      heading="okay, fine, a few:"
      items={redFlags}
    />
  );
}
