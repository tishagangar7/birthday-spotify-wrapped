"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { whichAliChapter as data } from "../../data/interactiveChapters";

function SpritePlaceholder({ archetype }) {
  return (
    <div
      className="which-ali-sprite-fallback"
      style={{ "--arch-accent": archetype.accent }}
      aria-hidden="true"
    >
      <span className="which-ali-sprite-block" />
      <span className="which-ali-sprite-block which-ali-sprite-block--mid" />
      <span className="which-ali-sprite-initials">{archetype.initials}</span>
    </div>
  );
}

function Sprite({ archetype }) {
  const [failed, setFailed] = useState(false);
  if (failed || !archetype.sprite) {
    return <SpritePlaceholder archetype={archetype} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="which-ali-sprite-img"
      src={archetype.sprite}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

export default function WhichAliAreYouChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const seqRef = useRef([]);
  const [phase, setPhase] = useState("intro"); // intro | select | profile
  const [cursor, setCursor] = useState(0);
  const [locked, setLocked] = useState(false);
  const [hiddenUnlocked, setHiddenUnlocked] = useState(false);
  const [visible, setVisible] = useState(false);
  const touchX = useRef(null);

  const roster = useMemo(() => {
    const list = [...data.archetypes];
    if (hiddenUnlocked) list.push(data.hiddenArchetype);
    return list;
  }, [hiddenUnlocked]);

  const selected = roster[Math.min(cursor, roster.length - 1)];

  const start = useCallback(() => setPhase("select"), []);

  const confirm = useCallback(() => {
    setPhase("profile");
  }, []);

  const chooseAgain = useCallback(() => {
    setPhase("select");
    setLocked(false);
  }, []);

  const lockIn = useCallback(() => {
    setLocked(true);
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

  useEffect(() => {
    if (!visible) return undefined;

    const onKey = (e) => {
      const key = e.key.toLowerCase();

      if (phase === "intro" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        start();
        return;
      }

      if (phase === "select") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          e.stopImmediatePropagation();
          setCursor((c) => (c + 1) % roster.length);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          e.stopImmediatePropagation();
          setCursor((c) => (c - 1 + roster.length) % roster.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          e.stopImmediatePropagation();
          confirm();
        }

        if (key.length === 1 && /[a-z]/.test(key)) {
          const next = [...seqRef.current, key].slice(-data.konamiSequence.length);
          seqRef.current = next;
          if (next.join("") === data.konamiSequence.join("")) {
            setHiddenUnlocked(true);
            setCursor(data.archetypes.length);
          }
        }
      }

      if (phase === "profile" && e.key === "Enter" && !locked) {
        e.preventDefault();
        e.stopImmediatePropagation();
        lockIn();
      }
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, phase, roster.length, start, confirm, lockIn, locked]);

  function onTouchStart(e) {
    touchX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e) {
    if (touchX.current == null || phase !== "select") return;
    const x = e.changedTouches[0]?.clientX;
    if (x == null) return;
    const dx = x - touchX.current;
    if (dx < -40) setCursor((c) => (c + 1) % roster.length);
    else if (dx > 40) setCursor((c) => (c - 1 + roster.length) % roster.length);
    touchX.current = null;
  }

  return (
    <SectionTransition
      ref={rootRef}
      className={`wrapped-card wrapped-accent-limegreen story-no-nav which-ali-chapter${locked ? " is-locked" : ""}`}
      variant="rise"
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body which-ali-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>

        <AnimatePresence mode="wait">
          {phase === "intro" ? (
            <motion.div
              key="intro"
              className="which-ali-intro"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button type="button" className="which-ali-press-start" onClick={start}>
                {data.pressStart}
              </button>
            </motion.div>
          ) : null}

          {phase === "select" ? (
            <motion.div
              key="select"
              className="which-ali-select"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="which-ali-roster"
                role="listbox"
                aria-label="Ali archetypes"
                aria-activedescendant={`ali-arch-${selected.id}`}
              >
                {roster.map((arch, i) => (
                  <button
                    key={arch.id}
                    id={`ali-arch-${arch.id}`}
                    type="button"
                    role="option"
                    aria-selected={i === cursor}
                    className={`which-ali-slot${i === cursor ? " is-selected" : ""}`}
                    onClick={() => setCursor(i)}
                    onDoubleClick={confirm}
                  >
                    <span className="which-ali-sprite-wrap">
                      <Sprite archetype={arch} />
                    </span>
                    <span className="which-ali-slot-name">{arch.name}</span>
                  </button>
                ))}
              </div>

              <div className="which-ali-preview" aria-live="polite">
                <p className="which-ali-preview-name">{selected.name}</p>
                <p className="which-ali-preview-tag">{selected.tagline}</p>
              </div>

              <WrappedButton variant="primary" onClick={confirm} ariaLabel={data.chooseLabel}>
                {data.chooseLabel}
              </WrappedButton>
            </motion.div>
          ) : null}

          {phase === "profile" ? (
            <motion.div
              key="profile"
              className="which-ali-profile"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="which-ali-profile-sprite">
                <Sprite archetype={selected} />
              </div>
              <p className="which-ali-you-got">you got: {selected.name}</p>
              <p className="which-ali-preview-tag">{selected.tagline}</p>
              <ul className="which-ali-stats">
                {Object.entries(selected.stats).map(([label, value]) => (
                  <li key={label} className="which-ali-stat">
                    <span className="which-ali-stat-label">{label}</span>
                    <span className="which-ali-stat-track" aria-hidden="true">
                      <span
                        className="which-ali-stat-fill"
                        style={{ width: `${Math.min(100, value)}%` }}
                      />
                    </span>
                    <span className="which-ali-stat-value">{value}</span>
                  </li>
                ))}
              </ul>
              <p className="which-ali-move">
                special · {selected.specialMove}
              </p>
              <p className="which-ali-weak">weakness · {selected.weakness}</p>
              <p className="wrapped-caption">{selected.resultLine}</p>
              <div className="wrapped-cta-row">
                <WrappedButton variant="ghost" onClick={chooseAgain}>
                  {data.chooseAgainLabel}
                </WrappedButton>
                <WrappedButton variant="primary" onClick={lockIn} disabled={locked}>
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
