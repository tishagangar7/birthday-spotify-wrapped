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
    }, reduceMotion ? 40 : 160);
    return () => window.clearInterval(id);
  }, [verified, reduceMotion]);

  useEffect(() => {
    if (!verified) return undefined;
    const timers = data.statLines.map((_, i) =>
      window.setTimeout(() => setStatStep(i + 1), reduceMotion ? 0 : 360 + i * 260)
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
    if (reduceMotion || !cardRef.current || verified) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  }

  function onPointerLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const tiersDone = verified && tierIndex >= data.tiers.length - 1;
  const showDetails = tiersDone && statStep >= data.statLines.length;

  return (
    <SectionTransition
      ref={rootRef}
      className={`wrapped-card wrapped-accent-purple story-no-nav motiv-chapter${verified ? " is-verified" : ""}`}
      variant="rise"
    >
      {!verified ? <span className="wrapped-kicker">{data.kicker}</span> : null}

      <div className="wrapped-body motiv-body">
        {!verified ? (
          <>
            <header className="motiv-header">
              <h2 className="lore-iceberg-headline motiv-headline">{data.headline}</h2>
              <p className="wrapped-caption">{data.subheading}</p>
              <p className="motiv-hint">{data.tapHint}</p>
            </header>

            <button
              type="button"
              ref={cardRef}
              className="motiv-card"
              aria-label={data.tapHint}
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
              <div className="motiv-card-top">
                <p className="motiv-card-brand">{data.card.brand}</p>
                <p className="motiv-card-tier">MEMBER</p>
              </div>
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

            <div className="wrapped-cta-row">
              <WrappedButton variant="primary" onClick={verify} ariaLabel={data.tapHint}>
                verify status
              </WrappedButton>
            </div>
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="verified"
              className="motiv-verified"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="motiv-verified-badge">{data.card.tier}</p>
              <p className="motiv-verified-name">{data.card.memberName}</p>
              <p className="motiv-verified-meta">
                since {data.card.memberSince} · #{data.card.memberNumber}
              </p>

              {!showDetails ? (
                <div className="motiv-tiers" aria-live="polite">
                  {data.tiers.map((tier, i) => (
                    <span
                      key={tier}
                      className={`motiv-tier${i <= tierIndex ? " is-active" : ""}${
                        i === data.tiers.length - 1 && tierIndex >= i ? " is-final" : ""
                      }`}
                    >
                      {tier}
                    </span>
                  ))}
                </div>
              ) : null}

              {tiersDone ? (
                <ul className={`motiv-stats${showDetails ? " is-final" : ""}`}>
                  {data.statLines.slice(0, statStep).map((line) => (
                    <li key={line.key} className="motiv-stat">
                      <strong>{data.stats[line.key]}</strong>
                      <span>{line.suffix}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {showDetails ? (
                <div className="motiv-details">
                  <ul className="motiv-perks">
                    {data.perks.map((perk) => (
                      <li key={perk.id} className="motiv-perk">
                        <span className="motiv-perk-title">{perk.title}</span>
                        <span className="motiv-perk-detail">{perk.detail}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="motiv-closing">
                    <span className="motiv-closing-label">{data.closingLabel}</span>
                    <span className="motiv-closing-value">{data.closingValue}</span>
                  </p>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </SectionTransition>
  );
}
