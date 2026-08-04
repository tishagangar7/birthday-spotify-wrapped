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
  const [accepted, setAccepted] = useState(false);
  const [preamble, setPreamble] = useState(false);
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
    if (!opened) return undefined;
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
  }, [opened, index, reduceMotion]);

  const goNextAward = useCallback(() => {
    if (revealStep < 4) return;
    if (index === awards.length - 2 && !preamble) {
      setPreamble(true);
      setOpened(false);
      setRevealStep(0);
      return;
    }
    if (isLast) return;
    setPreamble(false);
    setIndex((i) => i + 1);
    setOpened(false);
    setRevealStep(0);
  }, [revealStep, index, awards.length, preamble, isLast]);

  const goPrevAward = useCallback(() => {
    if (index <= 0) return;
    if (index - 1 > maxOpened) return;
    setPreamble(false);
    setAccepted(false);
    setIndex((i) => i - 1);
    setOpened(true);
    setRevealStep(4);
  }, [index, maxOpened]);

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
        if (!started || !opened) openEnvelope();
        else if (preamble) {
          setPreamble(false);
          setIndex(awards.length - 1);
          setOpened(true);
          setRevealStep(0);
        } else if (isLast && revealStep >= 4 && !accepted) setAccepted(true);
        else if (revealStep >= 4) goNextAward();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopImmediatePropagation();
        goPrevAward();
      } else if (e.key === "ArrowRight" && revealStep >= 4) {
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
    isLast,
    accepted,
    preamble,
    awards.length,
  ]);

  return (
    <SectionTransition
      ref={rootRef}
      className={`wrapped-card wrapped-accent-purple story-no-nav awards-chapter${isHeart && opened ? " is-heart" : ""}`}
      variant="fade"
      duration={1.1}
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body awards-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>

        {started ? (
          <p className="awards-progress" aria-live="polite">
            award {index + 1} of {awards.length}
          </p>
        ) : null}

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
                setIndex(i);
                setOpened(true);
                setRevealStep(4);
                setPreamble(false);
                setAccepted(false);
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {preamble ? (
            <motion.div
              key="preamble"
              className="awards-preamble"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="awards-preamble-text">{data.finalPreamble}</p>
              <WrappedButton
                variant="primary"
                onClick={() => {
                  setPreamble(false);
                  setIndex(awards.length - 1);
                  setOpened(true);
                  setRevealStep(0);
                }}
              >
                open final envelope
              </WrappedButton>
            </motion.div>
          ) : null}

          {!preamble && !started ? (
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

          {!preamble && started ? (
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
                  {!isLast ? (
                    <WrappedButton variant="primary" onClick={goNextAward}>
                      {data.nextAwardLabel}
                    </WrappedButton>
                  ) : !accepted ? (
                    <WrappedButton variant="primary" onClick={() => setAccepted(true)}>
                      {data.acceptLabel}
                    </WrappedButton>
                  ) : (
                    <p className="awards-birthday">{data.birthdayLine}</p>
                  )}
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SectionTransition>
  );
}
