"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { awardsChapter as data } from "../../data/interactiveChapters";

export default function AliWrappedAwardsChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [revealStep, setRevealStep] = useState(0);
  const [showTrophy, setShowTrophy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [maxOpened, setMaxOpened] = useState(-1);

  const awards = data.awards;
  const award = awards[index];
  const isLast = index === awards.length - 1;
  const isHeart = award?.tone === "heart";

  const openEnvelope = useCallback(() => {
    if (!started) {
      setStarted(true);
      setOpened(true);
      setRevealStep(0);
      return;
    }
    if (!opened) {
      setOpened(true);
      setRevealStep(0);
    }
  }, [started, opened]);

  useEffect(() => {
    if (!opened || showTrophy) return undefined;
    const delays = reduceMotion ? [0, 0, 0, 0] : [0, 280, 520, 780];
    const timers = delays.map((d, step) =>
      window.setTimeout(() => {
        setRevealStep(step + 1);
        if (step === delays.length - 1) {
          setMaxOpened((m) => Math.max(m, index));
        }
      }, d)
    );
    return () => timers.forEach(clearTimeout);
  }, [opened, index, reduceMotion, showTrophy]);

  const goNextAward = useCallback(() => {
    if (revealStep < 4 || showTrophy) return;
    if (isLast) {
      setShowTrophy(true);
      return;
    }
    setIndex((i) => i + 1);
    setOpened(false);
    setRevealStep(0);
  }, [revealStep, isLast, showTrophy]);

  const goPrevAward = useCallback(() => {
    if (showTrophy) {
      setShowTrophy(false);
      setOpened(true);
      setRevealStep(4);
      return;
    }
    if (index <= 0) return;
    if (index - 1 > maxOpened) return;
    setIndex((i) => i - 1);
    setOpened(true);
    setRevealStep(4);
  }, [index, maxOpened, showTrophy]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.4),
      { threshold: [0.3, 0.45] }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (showTrophy) return;
        if (!started || !opened) openEnvelope();
        else if (revealStep >= 4) goNextAward();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopImmediatePropagation();
        goPrevAward();
      } else if (e.key === "ArrowRight" && revealStep >= 4 && !showTrophy) {
        e.preventDefault();
        e.stopImmediatePropagation();
        goNextAward();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [
    visible,
    started,
    opened,
    openEnvelope,
    goNextAward,
    goPrevAward,
    revealStep,
    showTrophy,
  ]);

  return (
    <SectionTransition
      ref={rootRef}
      className={`wrapped-card wrapped-accent-purple story-no-nav awards-chapter${isHeart && opened && !showTrophy ? " is-heart" : ""}${showTrophy ? " is-trophy" : ""}`}
      variant="fade"
      duration={1.1}
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body awards-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>

        {started && !showTrophy ? (
          <p className="awards-progress" aria-live="polite">
            award {index + 1} of {awards.length}
          </p>
        ) : null}

        {!showTrophy ? (
          <div className="awards-dots" role="tablist" aria-label="Opened awards">
            {awards.map((a, i) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Award ${i + 1}${i <= maxOpened ? "" : " (locked)"}`}
                className={`awards-dot${i === index ? " is-current" : ""}${i <= maxOpened ? " is-opened" : ""}`}
                disabled={i > maxOpened}
                onClick={() => {
                  if (i > maxOpened) return;
                  setShowTrophy(false);
                  setIndex(i);
                  setOpened(true);
                  setRevealStep(4);
                }}
              />
            ))}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div key="start" className="awards-start" initial={false} animate={{ opacity: 1 }}>
              <button type="button" className="awards-envelope" onClick={openEnvelope} aria-label={data.openFirstLabel}>
                <span className="awards-envelope-flap" aria-hidden="true" />
                <span className="awards-envelope-body" aria-hidden="true" />
              </button>
              <WrappedButton variant="primary" onClick={openEnvelope}>
                {data.openFirstLabel}
              </WrappedButton>
            </motion.div>
          ) : null}

          {started && !showTrophy ? (
            <motion.div
              key={`award-${index}-${opened}`}
              className="awards-reveal"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              aria-live="polite"
            >
              {!opened ? (
                <button
                  type="button"
                  className="awards-envelope"
                  onClick={openEnvelope}
                  aria-label={`Open ${award.category}`}
                >
                  <span className="awards-envelope-flap" aria-hidden="true" />
                  <span className="awards-envelope-body" aria-hidden="true" />
                </button>
              ) : (
                <div className={`awards-card tone-${award.tone}`}>
                  {revealStep >= 1 ? <p className="awards-category">{award.category}</p> : null}
                  {revealStep >= 2 ? (
                    <p className="awards-goes-to">{data.andTheAwardGoesTo}</p>
                  ) : null}
                  {revealStep >= 3 ? <p className="awards-winner">{award.winner}</p> : null}
                  {revealStep >= 4 ? (
                    <>
                      <p className="awards-citation">{award.citation}</p>
                      {!isHeart && award.stat ? (
                        <p className="awards-stat">{award.stat}</p>
                      ) : null}
                      {isHeart ? (
                        <>
                          <p className="awards-stat awards-stat-heart">{award.stat}</p>
                          <ul className="awards-sigs" aria-label="Friend signatures">
                            {data.friendSignatures.map((sig) => (
                              <li key={sig}>{sig}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                      {!isHeart && !reduceMotion ? (
                        <div className="awards-flash" aria-hidden="true" />
                      ) : null}
                    </>
                  ) : null}
                </div>
              )}

              {opened && revealStep >= 4 ? (
                <div className="wrapped-cta-row">
                  <WrappedButton variant="primary" onClick={goNextAward}>
                    {isLast ? data.acceptLabel : data.nextAwardLabel}
                  </WrappedButton>
                </div>
              ) : null}
            </motion.div>
          ) : null}

          {showTrophy ? (
            <motion.div
              key="trophy"
              className="awards-trophy"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.86, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 160, damping: 18 }
              }
            >
              <div className="awards-trophy-stage">
                <span className="awards-trophy-glow" aria-hidden="true" />
                <span className="awards-trophy-rays" aria-hidden="true" />
                <div className="awards-trophy-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="awards-trophy-img"
                    src={data.trophyImage}
                    alt={data.trophyAlt}
                    draggable={false}
                  />
                  {!reduceMotion ? (
                    <span className="awards-trophy-shine" aria-hidden="true" />
                  ) : null}
                </div>
                {!reduceMotion ? (
                  <div className="awards-trophy-sparkles" aria-hidden="true">
                    {Array.from({ length: 12 }, (_, i) => (
                      <span key={i} className={`awards-trophy-sparkle awards-trophy-sparkle--${i}`} />
                    ))}
                  </div>
                ) : null}
              </div>
              <p className="awards-trophy-caption">{data.trophyCaption}</p>
              <p className="awards-birthday">{data.birthdayLine}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SectionTransition>
  );
}
