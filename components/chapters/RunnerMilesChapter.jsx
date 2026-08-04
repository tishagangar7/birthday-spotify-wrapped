"use client";

import { useState } from "react";
import SectionTransition from "../SectionTransition";
import { milesChapter } from "../../data/wrappedChapters";

/** Funny slider — drag cartoon Ali across to unlock miles. */
export default function RunnerMilesChapter() {
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  function onSlide(e) {
    e.stopPropagation();
    const next = Number(e.target.value);
    setProgress(next);
    if (next >= 97) setFinished(true);
  }

  return (
    <SectionTransition className="wrapped-card wrapped-accent-limegreen runner-miles-chapter" variant="rise">
      <span className="wrapped-kicker">chapter four · miles this year</span>
      <div className="wrapped-body">
        {finished ? (
          <>
            <p className="wrapped-number">{milesChapter.miles.toLocaleString("en-US")}</p>
            <p className="wrapped-caption">
              miles covered. {milesChapter.motivationalNote}
            </p>
          </>
        ) : (
          <>
            <p className="wrapped-order-heading">drag him across</p>

            <div className="runner-stage">
              <div className="runner-track" aria-hidden>
                <div className="runner-lanes" />
                <span className="runner-start">start</span>
                <div className="runner-finish">
                  <span className="runner-finish-flag" />
                  <span className="runner-finish-label">finish</span>
                </div>
              </div>
              <span
                className="runner-ali"
                style={{ left: `calc(${progress}% - 3.5rem)` }}
                aria-hidden
              >
                <img
                  src="/photos/runner/ali-run-0.png?v=2"
                  alt=""
                  className="runner-ali-image"
                  width={140}
                  height={224}
                  draggable={false}
                />
              </span>
            </div>

            <input
              className="runner-slider"
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={onSlide}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label="Drag Ali across the track"
            />
          </>
        )}
      </div>
    </SectionTransition>
  );
}
