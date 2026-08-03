"use client";

import { useMemo, useState } from "react";
import SectionTransition from "../SectionTransition";
import { milesChapter, runnerObstacles } from "../../data/wrappedChapters";

/**
 * Slide ALI past obstacles; release near the end to reveal miles covered.
 */
export default function RunnerMilesChapter() {
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  const hitLabels = useMemo(
    () => runnerObstacles.filter((o) => progress >= o.at).map((o) => o.label),
    [progress],
  );

  function onSlide(e) {
    e.stopPropagation();
    const next = Number(e.target.value);
    setProgress(next);
    if (next >= 95) setFinished(true);
  }

  return (
    <SectionTransition className="wrapped-card wrapped-accent-limegreen" variant="rise">
      <span className="wrapped-kicker">chapter four · miles this year</span>
      <div className="wrapped-body">
        {finished ? (
          <>
            <p className="wrapped-number">{milesChapter.miles.toLocaleString("en-US")}</p>
            <p className="wrapped-caption">
              miles covered. {milesChapter.comparison} {milesChapter.motivationalNote}
            </p>
          </>
        ) : (
          <>
            <p className="wrapped-order-heading">run ali through the year</p>
            <p className="wrapped-caption">slide him past the obstacles. miles unlock at the finish.</p>

            <div className="runner-track" aria-hidden>
              {runnerObstacles.map((o) => (
                <span
                  key={o.id}
                  className={`runner-obstacle${progress >= o.at ? " is-hit" : ""}`}
                  style={{ left: `${o.at}%` }}
                >
                  {o.label}
                </span>
              ))}
              <span className="runner-ali" style={{ left: `calc(${progress}% - 1.1rem)` }}>
                ALI
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
              aria-label="Slide Ali along the track"
            />

            {hitLabels.length > 0 && (
              <p className="wrapped-caption" style={{ opacity: 0.75 }}>
                cleared: {hitLabels.join(" · ")}
              </p>
            )}
          </>
        )}
      </div>
    </SectionTransition>
  );
}
