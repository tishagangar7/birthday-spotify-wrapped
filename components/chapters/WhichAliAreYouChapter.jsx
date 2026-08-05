"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { whichAliChapter as data } from "../../data/interactiveChapters";
import CharacterCarousel from "../which-ali/CharacterCarousel";
import CharacterStats from "../which-ali/CharacterStats";
import CharacterSprite from "../which-ali/CharacterSprite";

const CONFIRM_MS = 480;

export default function WhichAliAreYouChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const confirmTimer = useRef(null);
  const [phase, setPhase] = useState("select"); // select | profile
  const [cursor, setCursor] = useState(0);
  const [visible, setVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [locked, setLocked] = useState(false);

  const roster = data.archetypes;
  const selected = roster[Math.min(cursor, roster.length - 1)];

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
    };
  }, []);

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

  const showProfile = useCallback(() => {
    setConfirming(false);
    setPhase("profile");
  }, []);

  const selectFighter = useCallback(() => {
    if (confirming || phase !== "select" || !selected) return;
    setConfirming(true);
    if (confirmTimer.current) clearTimeout(confirmTimer.current);
    confirmTimer.current = setTimeout(
      showProfile,
      reduceMotion ? 120 : CONFIRM_MS
    );
  }, [confirming, phase, selected, reduceMotion, showProfile]);

  const chooseAgain = useCallback(() => {
    setPhase("select");
    setLocked(false);
    setConfirming(false);
  }, []);

  const lockIn = useCallback(() => {
    setLocked(true);
  }, []);

  useEffect(() => {
    if (!visible || phase !== "profile" || locked) return undefined;
    const onKey = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopImmediatePropagation();
        lockIn();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, phase, locked, lockIn]);

  return (
    <SectionTransition
      ref={rootRef}
      className={`wrapped-card wrapped-accent-limegreen story-no-nav which-ali-chapter${locked ? " is-locked" : ""}${confirming ? " is-confirming" : ""}`}
      variant="rise"
      data-selected={phase === "profile" ? selected?.id : undefined}
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body which-ali-body">
        <header className="which-ali-header">
          <h2 className="lore-iceberg-headline which-ali-headline">{data.headline}</h2>
          <p className="wrapped-caption which-ali-sub">{data.subheading}</p>
        </header>

        <AnimatePresence mode="wait">
          {phase === "select" ? (
            <motion.div
              key="select"
              className="which-ali-select-phase"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.28 }}
            >
              <div className="which-ali-layout">
                <CharacterStats key={selected?.id} archetype={selected} />
                <CharacterCarousel
                  archetypes={roster}
                  index={cursor}
                  onIndexChange={setCursor}
                  onSelect={selectFighter}
                  locked={confirming}
                  confirming={confirming}
                  keyboardActive={visible && phase === "select"}
                />
              </div>

              <WrappedButton
                variant="primary"
                className="which-ali-select-btn"
                onClick={selectFighter}
                disabled={confirming}
                ariaLabel={data.selectLabel}
              >
                {data.selectLabel}
              </WrappedButton>
            </motion.div>
          ) : null}

          {phase === "profile" && selected ? (
            <motion.div
              key={`profile-${selected.id}`}
              className="which-ali-profile"
              initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >
              <div
                className="which-ali-profile-card"
                style={{ "--arch-accent": selected.accent }}
              >
                <div className="which-ali-profile-sprite">
                  <CharacterSprite
                    archetype={selected}
                    alt={`${selected.name} character`}
                  />
                </div>
                <p className="which-ali-you-got">{selected.name}</p>
                {selected.tagline ? (
                  <p className="which-ali-preview-tag">{selected.tagline}</p>
                ) : null}
                <ul className="which-ali-stats">
                  {Object.entries(selected.stats).map(([label, value]) => (
                    <li key={label} className="which-ali-stat">
                      <span className="which-ali-stat-label">{label}</span>
                      <span className="which-ali-stat-track" aria-hidden="true">
                        <span
                          className="which-ali-stat-fill"
                          style={{
                            width: `${Math.min(100, Number(value) || 0)}%`,
                            background: selected.accent,
                          }}
                        />
                      </span>
                      <span className="which-ali-stat-value">{value}</span>
                    </li>
                  ))}
                </ul>
                {selected.specialMove ? (
                  <p className="which-ali-move">special · {selected.specialMove}</p>
                ) : null}
                {selected.weakness ? (
                  <p className="which-ali-weak">weakness · {selected.weakness}</p>
                ) : null}
              </div>

              <div className="wrapped-cta-row which-ali-profile-ctas">
                <WrappedButton variant="ghost" onClick={chooseAgain} disabled={locked}>
                  {data.chooseAgainLabel}
                </WrappedButton>
                <WrappedButton
                  variant="primary"
                  onClick={lockIn}
                  disabled={locked}
                  ariaLabel={locked ? "locked in" : data.lockInLabel}
                >
                  {locked ? "locked in" : data.lockInLabel}
                </WrappedButton>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SectionTransition>
  );
}
