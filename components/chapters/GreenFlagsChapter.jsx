import FlagsChapter from "./FlagsChapter";
import { greenFlags } from "../../data/wrappedChapters";

export default function GreenFlagsChapter() {
  return (
    <FlagsChapter
      accent="wrapped-accent-green"
      kicker="bonus · green flags"
      heading="and the real reasons why:"
      items={greenFlags}
    />
  );
}
