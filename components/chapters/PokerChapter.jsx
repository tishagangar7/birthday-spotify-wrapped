"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { pokerChapter } from "../../data/wrappedChapters";

const SETUP_HOLD_MS = 4000;
/** ~1.5× prior 2.6s — ease-out 0→720 reads slower / more satisfying. */
const COUNT_DURATION_MS = 4000;
/** Hold a painted 0 before the first count frame (avoids 720 → mid jump). */
const ZERO_HOLD_MS = 320;

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export default function PokerChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const wasVisibleRef = useRef(false);
  const phaseRef = useRef("idle");
  const rafRef = useRef(0);
  const timersRef = useRef([]);

  // "setup" = 720 + all-in line; "count" = bluff line for the whole 0→720 + settled 720
  const [phase, setPhase] = useState("idle");
  const [count, setCount] = useState(pokerChapter.countTo);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    function clearTimers() {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    }

    function setPhaseSafe(next) {
      phaseRef.current = next;
      setPhase(next);
    }

    function runCountUp() {
      // Guarantee display is 0 when animation clock starts.
      setCount(0);
      const target = pokerChapter.countTo;
      const start = performance.now();

      function tick(now) {
        // Stay on bluff caption for the entire count — never leave "count".
        if (phaseRef.current !== "count") return;

        const t = Math.min(1, (now - start) / COUNT_DURATION_MS);
        const next = t <= 0 ? 0 : Math.round(easeOutCubic(t) * target);
        setCount(next);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCount(target);
          rafRef.current = 0;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    function runSequence() {
      clearTimers();

      if (reduceMotion) {
        setPhaseSafe("count");
        setCount(pokerChapter.countTo);
        return;
      }

      setPhaseSafe("setup");
      setCount(pokerChapter.countTo);

      const holdId = window.setTimeout(() => {
        // Switch caption + hard-reset to 0; hold so 0 is visible before ease-out.
        setPhaseSafe("count");
        setCount(0);
        const startId = window.setTimeout(() => {
          runCountUp();
        }, ZERO_HOLD_MS);
        timersRef.current.push(startId);
      }, SETUP_HOLD_MS);

      timersRef.current.push(holdId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;

        if (visible) {
          // Don't restart mid-sequence (avoids flipping back to the all-in line).
          if (!wasVisibleRef.current && phaseRef.current === "idle") {
            runSequence();
          } else if (!wasVisibleRef.current && phaseRef.current === "count") {
            // Re-entry after a full leave: replay from the top.
            runSequence();
          }
          wasVisibleRef.current = true;
          return;
        }

        // Only treat as left once mostly off-screen — ignore brief ratio flaps.
        if (entry.intersectionRatio < 0.15) {
          wasVisibleRef.current = false;
          // Keep settled bluff + 720 on screen; allow replay on next full re-entry.
          if (phaseRef.current === "count" && rafRef.current === 0) {
            // settled — leave phase as "count"
          } else if (phaseRef.current === "setup") {
            // Interrupted before punchline: reset so re-entry can restart cleanly.
            clearTimers();
            setPhaseSafe("idle");
          }
        }
      },
      { threshold: [0, 0.15, 0.35, 0.45, 0.6, 0.8] }
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [reduceMotion]);

  // Bluff caption for the entire count phase and settled end state — never all-in after switch.
  const label =
    phase === "setup" ? pokerChapter.setupLine : pokerChapter.punchline;
  const showStat = phase !== "idle";

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-orange poker-chapter"
      variant="rise"
    >
      <span className="wrapped-kicker">{pokerChapter.kicker}</span>
      <div className="wrapped-body">
        <div className="poker-reveal" aria-live="polite">
          <div className="poker-photo-card" aria-hidden="true">
            <img
              className="poker-photo-card-img"
              src="/photos/poker/home-game.png"
              alt=""
            />
            <div className="poker-photo-card-scrim" />
          </div>
          {showStat ? (
            <div className="poker-reveal-copy">
              <p className="wrapped-number poker-reveal-number">
                {count.toLocaleString("en-US")}
              </p>
              <p className="poker-reveal-label wrapped-caption">{label}</p>
            </div>
          ) : null}
        </div>
      </div>
    </SectionTransition>
  );
}
