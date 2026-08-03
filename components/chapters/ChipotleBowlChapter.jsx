"use client";

import { useState } from "react";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { chipotleBowl } from "../../data/wrappedChapters";

const OPTIONS = {
  rice: ["white (obviously)", "brown", "half & half"],
  beans: ["black", "pinto", "no beans"],
  protein: ["ground beef energy", "chicken", "steak", "sofritas"],
  toppings: ["everything", "just cheese", "fajita veggies + cheese"],
  salsa: ["hot + mild on the side", "medium only", "corn salsa forever"],
};

export default function ChipotleBowlChapter() {
  const [picks, setPicks] = useState(() =>
    Object.fromEntries(chipotleBowl.defaults.map((d) => [d.step, d.pick]))
  );
  const [locked, setLocked] = useState(false);

  const cycle = (step) => {
    if (locked) return;
    const list = OPTIONS[step] ?? [picks[step]];
    const current = list.indexOf(picks[step]);
    const next = list[(current + 1 + list.length) % list.length];
    setPicks((prev) => ({ ...prev, [step]: next }));
  };

  return (
    <SectionTransition className="wrapped-card wrapped-accent-orange story-no-nav" variant="rise">
      <span className="wrapped-kicker">{chipotleBowl.kicker}</span>
      <div className="wrapped-body">
        <p className="wrapped-order-heading">{chipotleBowl.heading}</p>
        <ol className="wrapped-list bowl-builder-list">
          {Object.entries(picks).map(([step, pick]) => (
            <li key={step}>
              <button
                type="button"
                className="bowl-step-btn"
                onClick={() => cycle(step)}
                disabled={locked}
              >
                <span className="wrapped-list-name">{step}</span>
                <span className="wrapped-caption">{pick}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="wrapped-cta-row">
          {locked ? (
            <WrappedButton
              variant="ghost"
              onClick={() => {
                setLocked(false);
              }}
            >
              reset
            </WrappedButton>
          ) : (
            <WrappedButton variant="primary" onClick={() => setLocked(true)}>
              lock in bowl
            </WrappedButton>
          )}
        </div>
        {locked ? <p className="wrapped-caption">his order, more or less. respect.</p> : null}
      </div>
    </SectionTransition>
  );
}
