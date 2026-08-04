"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { cologneChapter } from "../../data/wrappedChapters";

const BOTTLE_SRCS = cologneChapter.options.map((option) => option.silhouette);

/** Staggered rain config — sizes/speeds tuned for ~3s celebration, not spam. */
const FALLING_BOTTLES = [
  { left: "4%", size: 56, delay: 0, duration: 2.7, rotate: -22, drift: 18, src: 0 },
  { left: "14%", size: 40, delay: 0.18, duration: 3.1, rotate: 16, drift: -14, src: 1 },
  { left: "24%", size: 68, delay: 0.08, duration: 2.9, rotate: -8, drift: 10, src: 2 },
  { left: "34%", size: 46, delay: 0.35, duration: 3.3, rotate: 28, drift: -22, src: 0 },
  { left: "46%", size: 58, delay: 0.12, duration: 2.8, rotate: -14, drift: 8, src: 1 },
  { left: "56%", size: 36, delay: 0.42, duration: 3.4, rotate: 20, drift: -10, src: 2 },
  { left: "66%", size: 62, delay: 0.22, duration: 3.0, rotate: -26, drift: 16, src: 0 },
  { left: "76%", size: 44, delay: 0.05, duration: 2.6, rotate: 12, drift: -18, src: 1 },
  { left: "86%", size: 52, delay: 0.3, duration: 3.2, rotate: -18, drift: 14, src: 2 },
  { left: "9%", size: 34, delay: 0.55, duration: 2.85, rotate: 24, drift: 6, src: 0 },
  { left: "40%", size: 48, delay: 0.48, duration: 3.15, rotate: -12, drift: -8, src: 1 },
  { left: "70%", size: 38, delay: 0.6, duration: 2.95, rotate: 30, drift: 12, src: 2 },
  { left: "92%", size: 50, delay: 0.4, duration: 3.05, rotate: -20, drift: -16, src: 0 },
];

const RAIN_CLEAR_MS = 3600;

function getOption(id) {
  return cologneChapter.options.find((option) => option.id === id);
}

function CologneBottleRain() {
  return (
    <div className="cologne-rain" aria-hidden>
      {FALLING_BOTTLES.map((bottle, index) => (
        <span
          key={index}
          className="cologne-rain-bottle"
          style={{
            left: bottle.left,
            "--rain-size": `${bottle.size}px`,
            "--rain-delay": `${bottle.delay}s`,
            "--rain-duration": `${bottle.duration}s`,
            "--rain-rotate": `${bottle.rotate}deg`,
            "--rain-drift": `${bottle.drift}px`,
          }}
        >
          <img
            src={BOTTLE_SRCS[bottle.src % BOTTLE_SRCS.length]}
            alt=""
            draggable={false}
          />
        </span>
      ))}
    </div>
  );
}

export default function CologneChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const wasVisibleRef = useRef(false);
  const rainingRef = useRef(false);
  const [showRain, setShowRain] = useState(false);
  const [rainKey, setRainKey] = useState(0);

  const [roundIndex, setRoundIndex] = useState(0);
  const [pickedId, setPickedId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const totalRounds = cologneChapter.rounds.length;
  const round = cologneChapter.rounds[roundIndex];
  const correctOption = getOption(round?.correctId);
  const isLocked = pickedId !== null && feedback === cologneChapter.correctFeedback;

  const choices = useMemo(() => round?.options ?? [], [round]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;

        if (visible) {
          // Only start on not-visible → visible; skip if rain is mid-flight.
          if (!wasVisibleRef.current && !rainingRef.current) {
            rainingRef.current = true;
            setRainKey((key) => key + 1);
            setShowRain(true);
          }
          wasVisibleRef.current = true;
          return;
        }

        wasVisibleRef.current = false;
      },
      { threshold: [0.35, 0.45, 0.6, 0.8] }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (!showRain) return undefined;
    const timer = window.setTimeout(() => {
      rainingRef.current = false;
      setShowRain(false);
    }, RAIN_CLEAR_MS);
    return () => window.clearTimeout(timer);
  }, [showRain, rainKey]);

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

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-purple story-no-nav cologne-chapter"
      variant="rise"
    >
      {showRain ? <CologneBottleRain key={rainKey} /> : null}

      <span className="wrapped-kicker">{cologneChapter.kicker}</span>

      {finished ? (
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
      ) : (
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
      )}
    </SectionTransition>
  );
}
