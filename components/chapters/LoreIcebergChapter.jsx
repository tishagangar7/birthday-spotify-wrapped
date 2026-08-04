"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import WrappedButton from "../WrappedButton";
import { loreIcebergChapter as data } from "../../data/interactiveChapters";

/**
 * Contained vertical iceberg dive — wheel / keys / button deepen levels
 * without leaving the ScrollDeck chapter until unlockNavAtIndex.
 */
export default function LoreIcebergChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const depthRef = useRef(0);
  const [depth, setDepth] = useState(0);
  const [visible, setVisible] = useState(false);
  const levels = data.levels;
  const max = levels.length - 1;
  const unlocked = depth >= data.unlockNavAtIndex;
  const level = levels[depth];

  const setDepthSafe = useCallback((next) => {
    const clamped = Math.max(0, Math.min(max, next));
    depthRef.current = clamped;
    setDepth(clamped);
  }, [max]);

  const deepen = useCallback(() => {
    setDepthSafe(depthRef.current + 1);
  }, [setDepthSafe]);

  const returnToSurface = useCallback(() => {
    setDepthSafe(0);
  }, [setDepthSafe]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.4);
      },
      { threshold: [0.25, 0.4, 0.6] }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return undefined;

    const onWheel = (event) => {
      if (!rootRef.current?.contains(event.target) && event.target !== document.body) {
        /* still trap when chapter is the snapped view */
      }
      const atTop = depthRef.current === 0;
      const atBottom = depthRef.current >= max;
      const goingDown = event.deltaY > 8;
      const goingUp = event.deltaY < -8;

      if (goingDown && !atBottom) {
        event.preventDefault();
        deepen();
        return;
      }
      if (goingUp && !atTop) {
        event.preventDefault();
        setDepthSafe(depthRef.current - 1);
        return;
      }
      if (!unlocked && goingDown && atBottom) {
        event.preventDefault();
      }
      if (!unlocked && goingUp && atTop) {
        event.preventDefault();
      }
    };

    const onKey = (event) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        if (depthRef.current < max) {
          event.preventDefault();
          event.stopImmediatePropagation();
          deepen();
        } else if (!unlocked) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        if (depthRef.current > 0) {
          event.preventDefault();
          event.stopImmediatePropagation();
          setDepthSafe(depthRef.current - 1);
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        event.stopImmediatePropagation();
        returnToSurface();
      } else if (event.key === "End" && unlocked) {
        /* allow leave via scroll deck */
      }
    };

    let touchY = null;
    const onTouchStart = (e) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e) => {
      if (touchY == null) return;
      const y = e.touches[0]?.clientY;
      if (y == null) return;
      const dy = touchY - y;
      if (Math.abs(dy) < 36) return;
      const goingDown = dy > 0;
      const atTop = depthRef.current === 0;
      const atBottom = depthRef.current >= max;

      if (goingDown && !atBottom) {
        e.preventDefault();
        touchY = y;
        deepen();
      } else if (!goingDown && !atTop) {
        e.preventDefault();
        touchY = y;
        setDepthSafe(depthRef.current - 1);
      } else if (!unlocked) {
        e.preventDefault();
      }
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey, true);
    const root = rootRef.current;
    root?.addEventListener("touchstart", onTouchStart, { passive: true });
    root?.addEventListener("touchmove", onTouchMove, { passive: false });
    root?.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey, true);
      root?.removeEventListener("touchstart", onTouchStart);
      root?.removeEventListener("touchmove", onTouchMove);
      root?.removeEventListener("touchend", onTouchEnd);
    };
  }, [visible, deepen, setDepthSafe, returnToSurface, max, unlocked]);

  const icebergOffset = reduceMotion ? 0 : depth * 14;
  const deepness = depth / max;

  return (
    <SectionTransition
      ref={rootRef}
      className={`wrapped-card wrapped-accent-teal story-no-nav lore-iceberg-chapter depth-${depth}${unlocked ? " is-unlocked" : ""}`}
      variant="fade"
      style={{
        "--ice-deepness": deepness,
        "--ice-offset": `${icebergOffset}%`,
      }}
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body lore-iceberg-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption lore-iceberg-sub">{data.subheading}</p>

        <div className="lore-iceberg-meter" aria-live="polite">
          <span className="lore-iceberg-meter-label">{level.label}</span>
          <span className="lore-iceberg-meter-depth">{level.depth}</span>
          <span className="lore-iceberg-meter-step">
            {depth + 1} / {levels.length}
          </span>
        </div>

        <div className="lore-iceberg-scene" aria-hidden={false}>
          <div className="lore-iceberg-bubbles" aria-hidden="true">
            {Array.from({ length: 6 + depth * 2 }, (_, i) => (
              <span
                key={i}
                className="lore-iceberg-bubble"
                style={{
                  "--b-x": `${8 + ((i * 17) % 84)}%`,
                  "--b-delay": `${(i % 5) * 0.4}s`,
                  "--b-size": `${4 + (i % 4) * 3}px`,
                  opacity: 0.15 + deepness * 0.35,
                }}
              />
            ))}
          </div>

          <div
            className={`lore-iceberg-stack${reduceMotion ? " is-reduced" : ""}`}
            style={{ transform: reduceMotion ? undefined : `translateY(${-icebergOffset}%)` }}
          >
            {levels.map((lvl, i) => {
              const revealed = i <= depth;
              const past = i < depth;
              return (
                <section
                  key={lvl.id}
                  className={`lore-iceberg-level lore-iceberg-level--${lvl.id}${revealed ? " is-revealed" : ""}${past ? " is-past" : ""}${i === depth ? " is-current" : ""}`}
                  aria-hidden={!revealed}
                >
                  <div className="lore-iceberg-shape" aria-hidden="true" />
                  <h3 className="lore-iceberg-level-label">{lvl.label}</h3>
                  {revealed ? (
                    <ul className="lore-iceberg-items">
                      {lvl.items.map((item) => (
                        <li key={item} className="lore-iceberg-item">
                          <span className="lore-iceberg-item-dot" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}
          </div>
        </div>

        {depth >= max ? (
          <div className="lore-iceberg-abyss-end">
            <p className="wrapped-caption">{data.abyssLine}</p>
            <WrappedButton variant="ghost" onClick={returnToSurface} ariaLabel={data.returnLabel}>
              {data.returnLabel}
            </WrappedButton>
          </div>
        ) : (
          <div className="wrapped-cta-row lore-iceberg-cta">
            <WrappedButton variant="primary" onClick={deepen} ariaLabel={data.deepenLabel}>
              {data.deepenLabel}
            </WrappedButton>
          </div>
        )}

        {!unlocked ? (
          <p className="lore-iceberg-lock-hint">clearance required to leave · keep descending</p>
        ) : null}
      </div>
    </SectionTransition>
  );
}
