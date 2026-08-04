"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { hingeUnhingedChapter as data } from "../../data/interactiveChapters";

const SWIPE_THRESHOLD = 90;

export default function HingeUnhingedChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const dragX = useRef(0);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("cards"); // cards | match | group | done
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [openPrompts, setOpenPrompts] = useState({});
  const [funnelDone, setFunnelDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [bubbleStep, setBubbleStep] = useState(0);

  const cards = data.cards;
  const total = cards.length;
  const card = cards[index];
  const atEnd = index >= total - 1;

  const goNext = useCallback(() => {
    if (phase !== "cards") return;
    if (card?.type === "funnel" && !funnelDone) {
      setFunnelDone(true);
      return;
    }
    if (atEnd) {
      setPhase("match");
      setOffset(0);
      return;
    }
    setIndex((i) => i + 1);
    setOffset(0);
  }, [phase, card, funnelDone, atEnd]);

  const goPrev = useCallback(() => {
    if (phase === "match" || phase === "group" || phase === "done") {
      setPhase("cards");
      setIndex(total - 1);
      return;
    }
    if (index > 0) {
      setIndex((i) => i - 1);
      setOffset(0);
      if (cards[index - 1]?.type === "funnel") setFunnelDone(false);
    }
  }, [phase, index, total, cards]);

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
      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopImmediatePropagation();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopImmediatePropagation();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, goNext, goPrev]);

  useEffect(() => {
    if (phase !== "group") return undefined;
    const timers = data.matchCard.groupChatBubbles.map((_, i) =>
      window.setTimeout(() => setBubbleStep(i + 1), reduceMotion ? 0 : 350 * (i + 1))
    );
    const done = window.setTimeout(
      () => setPhase("done"),
      reduceMotion ? 200 : 350 * (data.matchCard.groupChatBubbles.length + 1) + 400
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [phase, reduceMotion]);

  function onPointerDown(e) {
    if (phase !== "cards") return;
    dragX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    setOffset(e.clientX - dragX.current);
  }

  function onPointerUp(e) {
    if (!dragging) return;
    setDragging(false);
    const dx = e.clientX - dragX.current;
    if (dx <= -SWIPE_THRESHOLD) goNext();
    else if (dx >= SWIPE_THRESHOLD) goPrev();
    else setOffset(0);
  }

  function startMatch(viaGroup) {
    if (viaGroup) {
      setBubbleStep(0);
      setPhase("group");
    } else {
      setPhase("done");
    }
  }

  const rotation = reduceMotion || !dragging ? 0 : offset / 28;

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-pink story-no-nav hinge-chapter"
      variant="rise"
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body hinge-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>

        {phase === "cards" ? (
          <>
            <p className="hinge-instruction">{data.instruction}</p>
            <div className="hinge-stack">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={card.id}
                  className="hinge-card"
                  style={{
                    x: offset,
                    rotate: rotation,
                    touchAction: "none",
                  }}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: offset < 0 ? -160 : 160, rotate: offset < 0 ? -8 : 8 }}
                  transition={{ duration: 0.28 }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  {card.type === "stat" ? (
                    <>
                      <p className="hinge-stat-number">{card.headline}</p>
                      <p className="hinge-stat-caption">{card.caption}</p>
                      {card.secondary ? <p className="hinge-stat-secondary">{card.secondary}</p> : null}
                      {card.footnote ? <p className="hinge-stat-footnote">{card.footnote}</p> : null}
                    </>
                  ) : null}

                  {card.type === "prompts" ? (
                    <ul className="hinge-prompts">
                      {card.prompts.map((p) => {
                        const open = openPrompts[p.id];
                        return (
                          <li key={p.id}>
                            <button
                              type="button"
                              className={`hinge-prompt${open ? " is-open" : ""}`}
                              onClick={() =>
                                setOpenPrompts((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                              }
                              aria-expanded={!!open}
                            >
                              <span className="hinge-prompt-label">{p.label}</span>
                              <span className="hinge-prompt-answer">{p.answer}</span>
                              {open ? (
                                <span className="hinge-prompt-note">{p.annotation}</span>
                              ) : (
                                <span className="hinge-prompt-hint">tap for friend notes</span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  {card.type === "funnel" ? (
                    <div className="hinge-funnel" aria-live="polite">
                      {!funnelDone ? (
                        <ul className="hinge-funnel-list">
                          {card.steps.map((step, i) => (
                            <li
                              key={step.label}
                              className="hinge-funnel-step"
                              style={{
                                width: `${100 - i * 10}%`,
                                animationDelay: reduceMotion ? "0s" : `${i * 0.08}s`,
                              }}
                            >
                              <span>{step.label}</span>
                              <strong>{step.value}</strong>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="hinge-funnel-collapse">
                          <p className="hinge-funnel-collapse-label">{card.collapseLabel}</p>
                          <p className="hinge-funnel-collapse-value">{card.collapseValue}</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="wrapped-cta-row hinge-nav">
              <WrappedButton variant="ghost" onClick={goPrev} disabled={index === 0} ariaLabel="Previous card">
                back
              </WrappedButton>
              <span className="hinge-progress" aria-live="polite">
                {index + 1} / {total}
              </span>
              <WrappedButton variant="primary" onClick={goNext} ariaLabel="Next card">
                {atEnd && (card.type !== "funnel" || funnelDone) ? "continue" : "next"}
              </WrappedButton>
            </div>
          </>
        ) : null}

        {phase === "match" || phase === "group" || phase === "done" ? (
          <div className="hinge-match" aria-live="polite">
            {phase !== "done" ? (
              <>
                <div className="hinge-profile-card">
                  <p className="hinge-profile-name">
                    {data.matchCard.name}, {data.matchCard.age}
                  </p>
                  <ul className="hinge-prompts">
                    {data.matchCard.prompts.map((p) => (
                      <li key={p.label} className="hinge-prompt is-static">
                        <span className="hinge-prompt-label">{p.label}</span>
                        <span className="hinge-prompt-answer">{p.answer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="hinge-match-q">{data.matchCard.question}</p>
                {phase === "match" ? (
                  <div className="wrapped-cta-row">
                    <WrappedButton variant="primary" onClick={() => startMatch(false)}>
                      {data.matchCard.yesLabel}
                    </WrappedButton>
                    <WrappedButton variant="ghost" onClick={() => startMatch(true)}>
                      {data.matchCard.groupChatLabel}
                    </WrappedButton>
                  </div>
                ) : (
                  <ul className="hinge-bubbles">
                    {data.matchCard.groupChatBubbles.slice(0, bubbleStep).map((b) => (
                      <li key={b} className="hinge-bubble">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="hinge-its-a-match">
                <p className="hinge-match-title">{data.matchCard.matchTitle}</p>
                <p className="wrapped-caption">{data.matchCard.closing}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </SectionTransition>
  );
}
