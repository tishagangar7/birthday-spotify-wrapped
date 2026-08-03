"use client";

import { useMemo, useState } from "react";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { aliOrElseQuiz } from "../../data/wrappedChapters";

export default function AliOrElseQuizChapter() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const item = aliOrElseQuiz[index];
  const total = aliOrElseQuiz.length;

  const feedback = useMemo(() => {
    if (picked === null || !item) return null;
    const correct = picked === (item.saidByAli ? "ali" : "else");
    return correct ? "correct." : `nope — ${item.saidByAli ? "ali" : "someone else"}.`;
  }, [picked, item]);

  function choose(choice) {
    if (picked !== null || done) return;
    const correct = choice === (item.saidByAli ? "ali" : "else");
    setPicked(choice);
    if (correct) setScore((s) => s + 1);

    window.setTimeout(() => {
      if (index + 1 >= total) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
        setPicked(null);
      }
    }, 900);
  }

  return (
    <SectionTransition className="wrapped-card wrapped-accent-green story-no-nav" variant="rise">
      <span className="wrapped-kicker">bonus · how well do you know ali</span>
      <div className="wrapped-body">
        {done ? (
          <>
            <p className="wrapped-number">
              {score}/{total}
            </p>
            <p className="wrapped-caption">
              {score === total
                ? "you know him too well. concerning."
                : score >= total / 2
                  ? "solid. you've been paying attention."
                  : "do you even go here."}
            </p>
          </>
        ) : (
          <>
            <p className="wrapped-order-heading">said by ali — or someone else?</p>
            <p className="quiz-quote">“{item.quote}”</p>
            <p className="wrapped-caption" style={{ opacity: 0.6 }}>
              {index + 1} / {total}
            </p>
            <div className="wrapped-cta-row quiz-actions">
              <WrappedButton variant="primary" onClick={() => choose("ali")} disabled={picked !== null}>
                ali
              </WrappedButton>
              <WrappedButton variant="ghost" onClick={() => choose("else")} disabled={picked !== null}>
                someone else
              </WrappedButton>
            </div>
            {feedback ? <p className="wrapped-caption">{feedback}</p> : null}
          </>
        )}
      </div>
    </SectionTransition>
  );
}
