"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { aliOrElseQuiz } from "../../data/wrappedChapters";

function answerLabel(item) {
  const match = item.options.find((o) => o.id === item.answer);
  return match?.label ?? item.answer;
}

export default function AliOrElseQuizChapter() {
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const item = aliOrElseQuiz[index];
  const total = aliOrElseQuiz.length;
  const answered = picked !== null;

  const feedback = useMemo(() => {
    if (!answered || !item) return null;
    const correct = picked === item.answer;
    const who = answerLabel(item);
    return correct ? `correct — said by ${who}.` : `nope — said by ${who}.`;
  }, [answered, picked, item]);

  useEffect(() => {
    if (!answered || !item?.video) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const play = async () => {
      video.currentTime = 0;
      try {
        await video.play();
      } catch {
        if (!cancelled) {
          /* autoplay blocked — controls still available */
        }
      }
    };
    play();
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [answered, item?.video, index]);

  function choose(choice) {
    if (answered || done) return;
    const correct = choice === item.answer;
    setPicked(choice);
    if (correct) setScore((s) => s + 1);
  }

  function goNext() {
    if (!answered) return;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  }

  return (
    <SectionTransition className="wrapped-card wrapped-accent-green story-no-nav quiz-chapter" variant="rise">
      <span className="wrapped-kicker">how well do u know ali</span>
      <div className="wrapped-body quiz-body">
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
            <div className="quiz-top">
              <p className="wrapped-order-heading">{item.prompt}</p>
              {answered ? (
                <div className="quiz-next-slot">
                  <WrappedButton variant="primary" onClick={goNext}>
                    {index + 1 >= total ? "see score" : "next"}
                  </WrappedButton>
                </div>
              ) : null}
            </div>
            <p className="quiz-quote">“{item.quote}”</p>
            <p className="wrapped-caption" style={{ opacity: 0.6 }}>
              {index + 1} / {total}
            </p>

            {!answered ? (
              <div className="wrapped-cta-row quiz-actions">
                {item.options.map((opt, i) => (
                  <WrappedButton
                    key={opt.id}
                    variant={i === 0 ? "primary" : "ghost"}
                    onClick={() => choose(opt.id)}
                  >
                    {opt.label}
                  </WrappedButton>
                ))}
              </div>
            ) : (
              <>
                {feedback ? <p className="wrapped-caption">{feedback}</p> : null}
                {item.video ? (
                  <div className="quiz-video-wrap">
                    <video
                      ref={videoRef}
                      className="quiz-video"
                      src={item.video}
                      playsInline
                      controls
                      preload="auto"
                    />
                  </div>
                ) : item.image ? (
                  <div className="quiz-video-wrap">
                    <img
                      className="quiz-video quiz-image"
                      src={item.image}
                      alt=""
                    />
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </SectionTransition>
  );
}
