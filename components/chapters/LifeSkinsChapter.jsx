"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { lifeSkinsChapter as data } from "../../data/interactiveChapters";

/**
 * Pixel-art “Unlock New Life Skins” roster — tap each locked card to unlock.
 * Art lives in /public/images/life-skins/
 */
export default function LifeSkinsChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const [unlocked, setUnlocked] = useState(() => ({}));
  const [focus, setFocus] = useState(0);
  const [visible, setVisible] = useState(false);

  const allUnlocked = data.skins.every((s) => unlocked[s.id]);

  const unlock = useCallback((id, index) => {
    setFocus(index);
    setUnlocked((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  const unlockFocused = useCallback(() => {
    const skin = data.skins[focus];
    if (!skin) return;
    if (!unlocked[skin.id]) {
      unlock(skin.id, focus);
      return;
    }
    setFocus((i) => (i + 1) % data.skins.length);
  }, [focus, unlocked, unlock]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0.25, 0.4] }
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
        setFocus((i) => (i + 1) % data.skins.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopImmediatePropagation();
        setFocus((i) => (i - 1 + data.skins.length) % data.skins.length);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopImmediatePropagation();
        unlockFocused();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible, unlockFocused]);

  return (
    <SectionTransition
      ref={rootRef}
      className={`wrapped-card wrapped-accent-purple story-no-nav life-skins-chapter${allUnlocked ? " is-complete" : ""}`}
      variant="rise"
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body life-skins-body">
        <header className="life-skins-hud" aria-hidden="true">
          <span className="life-skins-coins">
            <span className="life-skins-coin" />
            {data.coins}
          </span>
          <h2 className="life-skins-title">{data.headline}</h2>
          <span className="life-skins-hearts">
            {Array.from({ length: data.hearts }, (_, i) => (
              <span key={i} className="life-skins-heart" />
            ))}
          </span>
        </header>

        <h2 className="lore-iceberg-headline life-skins-headline-a11y">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>

        <ul className="life-skins-grid" role="list">
          {data.skins.map((skin, index) => {
            const isUnlocked = !!unlocked[skin.id];
            const isFocused = index === focus;
            return (
              <li key={skin.id}>
                <button
                  type="button"
                  className={`life-skin-card${isUnlocked ? " is-unlocked" : " is-locked"}${isFocused ? " is-focused" : ""}${reduceMotion ? " is-reduced" : ""}`}
                  style={{ "--skin-accent": skin.accent, "--skin-title": skin.titleColor }}
                  onClick={() => unlock(skin.id, index)}
                  aria-pressed={isUnlocked}
                  aria-label={`${skin.title}. ${isUnlocked ? data.unlockedLabel : data.unlockLabel}. ${skin.subtitle}`}
                >
                  <span className="life-skin-art">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skin.sprite}
                      alt=""
                      className="life-skin-sprite"
                      draggable={false}
                    />
                    {!isUnlocked ? (
                      <span className="life-skin-lock" aria-hidden="true">
                        <span className="life-skin-lock-shackle" />
                        <span className="life-skin-lock-body" />
                      </span>
                    ) : null}
                  </span>
                  <span className="life-skin-meta">
                    <span className="life-skin-name">{skin.title}</span>
                    <span className="life-skin-sub">{skin.subtitle}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="life-skins-progress" aria-live="polite">
          {Object.keys(unlocked).length} / {data.skins.length} unlocked
        </p>

        {allUnlocked ? (
          <p className="wrapped-caption life-skins-closing">{data.closing}</p>
        ) : null}
      </div>
    </SectionTransition>
  );
}
