import FlagsChapter from "./FlagsChapter";
import { redFlags } from "../../data/wrappedChapters";

export default function RedFlagsChapter() {
  return (
    <FlagsChapter
      accent="wrapped-accent-orange"
      kicker="stats · red flags"
      heading="okay, fine, a few:"
      items={redFlags}
    />
  );
}
