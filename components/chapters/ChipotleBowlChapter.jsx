"use client";

import StaggeredList from "./StaggeredList";
import { chipotleBowl } from "../../data/wrappedChapters";

/** Stub for the bowl builder — TBD full interactivity. */
export default function ChipotleBowlChapter() {
  const items = chipotleBowl.defaults.map((d) => ({
    label: d.step,
    detail: d.pick,
  }));

  return (
    <StaggeredList
      accent="wrapped-accent-orange"
      kicker={chipotleBowl.kicker}
      heading={chipotleBowl.heading}
      items={items}
      footer={chipotleBowl.note}
    />
  );
}
