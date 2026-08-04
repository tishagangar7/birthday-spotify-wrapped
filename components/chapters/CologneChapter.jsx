"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import SectionTransition from "../SectionTransition";
import { cologneChapter } from "../../data/wrappedChapters";

function getOption(id) {
  return cologneChapter.options.find((option) => option.id === id);
}

export default function CologneChapter() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [pickedId, setPickedId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const totalRounds = cologneChapter.rounds.length;
  const round = cologneChapter.rounds[roundIndex];
  const correctOption = getOption(round?.correctId);
  const isLocked = pickedId !== null && feedback === cologneChapter.correctFeedback;

  const choices = useMemo(() => round?.options ?? [], [round]);

  function choose(id) {
    if (finished || isLocked || !round) return;

    setPickedId(id);
    const correct = id === round.correctId;
    setFeedback(correct ? cologneChapter.correctFeedback : cologneChapter.wrongFeedback);

    if (!correct) {
      window.setTimeout(() => {
        setPickedId(null);
        setFeedback(null);
      }, 900);
      return;
    }

    window.setTimeout(() => {
      if (roundIndex + 1 >= totalRounds) {
        setFinished(true);
      } else {
        setRoundIndex((index) => index + 1);
        setPickedId(null);
        setFeedback(null);
      }
    }, 850);
  }

  if (finished) {
    return (
      <SectionTransition className="wrapped-card wrapped-accent-purple story-no-nav" variant="rise">
        <span className="wrapped-kicker">{cologneChapter.kicker}</span>
        <div className="wrapped-body">
          <div className="cologne-shelf" aria-hidden>
            {cologneChapter.options.map((option) => (
              <Image
                key={option.id}
                src={option.silhouette}
                alt=""
                width={120}
                height={180}
                className="cologne-shelf-item"
              />
            ))}
          </div>
        </div>
      </SectionTransition>
    );
  }

  return (
    <SectionTransition className="wrapped-card wrapped-accent-purple story-no-nav" variant="rise">
      <span className="wrapped-kicker">{cologneChapter.kicker}</span>
      <div className="wrapped-body">
        <p className="wrapped-order-heading">{cologneChapter.prompt}</p>
        <p className="wrapped-caption cologne-round-label">
          round {roundIndex + 1} / {totalRounds}
        </p>

        <div className="cologne-silhouette-stage" aria-hidden={false}>
          <div className="cologne-silhouette-frame">
            <Image
              src={correctOption.silhouette}
              alt=""
              width={360}
              height={520}
              className="cologne-silhouette-image"
              priority={roundIndex === 0}
            />
          </div>
        </div>

        <p className="wrapped-caption cologne-round-hint">{round.hint}</p>

        <div className="cologne-options" role="group" aria-label="Choose a fragrance">
          {choices.map((option) => {
            const isPicked = pickedId === option.id;
            const isCorrect = option.id === round.correctId;
            let stateClass = "";
            if (isPicked) {
              stateClass = isCorrect ? "is-correct" : "is-wrong";
            }

            return (
              <button
                key={option.id}
                type="button"
                className={`cologne-option ${stateClass}`.trim()}
                onClick={() => choose(option.id)}
                disabled={isLocked}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        {feedback ? <p className="wrapped-caption cologne-feedback">{feedback}</p> : null}
      </div>
    </SectionTransition>
  );
}
