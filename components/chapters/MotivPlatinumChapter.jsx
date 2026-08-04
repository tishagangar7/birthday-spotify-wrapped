"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { motivPlatinumChapter as data } from "../../data/interactiveChapters";

export default function MotivPlatinumChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const [verified, setVerified] = useState(false);
  const [tierIndex, setTierIndex] = useState(0);
  const [statStep, setStatStep] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const verify = useCallback(() => {
    if (verified) return;
    setVerified(true);
  }, [verified]);

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
    if (!verified) return undefined;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i >= data.tiers.length) {
        window.clearInterval(id);
        setTierIndex(data.tiers.length - 1);
        return;
      }
      setTierIndex(i);
    }, reduceMotion ? 40 : 220);
    return () => window.clearInterval(id);
  }, [verified, reduceMotion]);

  useEffect(() => {
    if (!verified) return undefined;
    const timers = data.statLines.map((_, i) =>
      window.setTimeout(() => setStatStep(i + 1), reduceMotion ? 0 : 500 + i * 420)
    );
    return () => timers.forEach(clearTimeout);
  }, [verified, reduceMotion]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!verified) {
          e.preventDefault();
          e.stopImmediatePropagation();
          verify();
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, verified, verify]);

  function onPointerMove(e) {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  }

  function onPointerLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const showPerks = verified && tierIndex >= data.tiers.length - 1 && statStep >= data.statLines.length;

  return (
    <SectionTransition
      ref={rootRef}
      className={`wrapped-card wrapped-accent-purple story-no-nav motiv-chapter${verified ? " is-verified" : ""}`}
      variant="rise"
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body motiv-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>

        {!verified ? <p className="motiv-hint">{data.tapHint}</p> : null}

        <button
          type="button"
          ref={cardRef}
          className={`motiv-card${verified ? " is-platinum" : ""}`}
          aria-label={verified ? "Membership verified" : data.tapHint}
          onClick={verify}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          style={
            reduceMotion
              ? undefined
              : { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }
          }
        >
          <div className="motiv-card-sheen" aria-hidden="true" />
          <p className="motiv-card-brand">{data.card.brand}</p>
          <p className="motiv-card-tier">{verified ? data.card.tier : "MEMBER"}</p>
          <p className="motiv-card-name">{data.card.memberName}</p>
          <dl className="motiv-card-meta">
            <div>
              <dt>Member since</dt>
              <dd>{data.card.memberSince}</dd>
            </div>
            <div>
              <dt>Member no.</dt>
              <dd>{data.card.memberNumber}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{data.card.status}</dd>
            </div>
          </dl>
        </button>

        <div className="motiv-tiers" aria-live="polite">
          {data.tiers.map((tier, i) => (
            <span
              key={tier}
              className={`motiv-tier${i <= tierIndex && verified ? " is-active" : ""}${i === data.tiers.length - 1 && verified && tierIndex >= i ? " is-final" : ""}`}
            >
              {tier}
            </span>
          ))}
        </div>

        {verified && tierIndex >= data.tiers.length - 1 ? (
          <p className="motiv-final-tier">{data.finalTier}</p>
        ) : null}

        <AnimatePresence>
          {verified ? (
            <motion.ul
              className="motiv-stats"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {data.statLines.slice(0, statStep).map((line) => (
                <li key={line.key} className="motiv-stat">
                  <strong>{data.stats[line.key]}</strong> {line.suffix}
                </li>
              ))}
              {statStep >= data.statLines.length ? (
                <li className="motiv-stat motiv-stat-quiet">{data.quickVisitLine}</li>
              ) : null}
            </motion.ul>
          ) : null}
        </AnimatePresence>

        {showPerks ? (
          <>
            <p className="motiv-next-reward">
              next reward · {data.nextReward}
            </p>
            <ul className="motiv-perks">
              {data.perks.map((perk) => (
                <li key={perk.id} className="motiv-perk">
                  <span className="motiv-perk-title">{perk.title}</span>
                  <span className="motiv-perk-detail">{perk.detail}</span>
                </li>
              ))}
            </ul>
            <p className="motiv-closing-label">{data.closingLabel}</p>
            <p className="motiv-closing-value">{data.closingValue}</p>
          </>
        ) : null}

        {!verified ? (
          <div className="wrapped-cta-row">
            <WrappedButton variant="primary" onClick={verify} ariaLabel={data.tapHint}>
              verify status
            </WrappedButton>
          </div>
        ) : null}
      </div>
    </SectionTransition>
  );
}
