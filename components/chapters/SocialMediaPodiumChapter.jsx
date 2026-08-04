"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";
import { socialMediaPodiumChapter as data } from "../../data/interactiveChapters";

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/** Podium order for display: 2nd · 1st · 3rd (classic center-winner layout). */
const PODIUM_ORDER = [2, 1, 3];

function placeByRank(rank) {
  return data.places.find((p) => p.place === rank);
}

function morphDisplay(digits, letters, step, fromEnd = false) {
  return digits
    .map((digit, i) => {
      const order = fromEnd ? digits.length - 1 - i : i;
      return step > order ? letters[i] ?? digit : digit;
    })
    .join("");
}

export default function SocialMediaPodiumChapter() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const rafRefs = useRef([]);
  const timersRef = useRef([]);
  const startedRef = useRef(false);
  const settledRef = useRef(false);

  const [counts, setCounts] = useState(() =>
    Object.fromEntries(data.places.map((p) => [p.id, 0]))
  );
  const [twitterMorphStep, setTwitterMorphStep] = useState(0);
  const [activePlace, setActivePlace] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    function clearAll() {
      rafRefs.current.forEach((id) => cancelAnimationFrame(id));
      rafRefs.current = [];
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    }

    function animateCount(place, onDone) {
      const target = place.countTo;
      const duration = place.durationMs ?? 1800;

      if (reduceMotion) {
        setCounts((prev) => ({ ...prev, [place.id]: target }));
        onDone?.();
        return;
      }

      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const next = Math.round(easeOutCubic(t) * target);
        setCounts((prev) => ({ ...prev, [place.id]: next }));
        if (t < 1) {
          const id = requestAnimationFrame(tick);
          rafRefs.current.push(id);
        } else {
          setCounts((prev) => ({ ...prev, [place.id]: target }));
          onDone?.();
        }
      }
      const id = requestAnimationFrame(tick);
      rafRefs.current.push(id);
    }

    function runTwitterMorph(place) {
      const letters = place.punchlineMorph;
      if (!letters?.length) {
        settledRef.current = true;
        return;
      }

      if (reduceMotion) {
        setTwitterMorphStep(letters.length);
        settledRef.current = true;
        return;
      }

      const startDelay = place.punchlineDelayMs ?? 80;
      const stepMs = place.punchlineStepMs ?? 90;

      letters.forEach((_, i) => {
        const id = window.setTimeout(() => {
          setTwitterMorphStep(i + 1);
          if (i === letters.length - 1) settledRef.current = true;
        }, startDelay + i * stepMs);
        timersRef.current.push(id);
      });
    }

    function runSequence() {
      clearAll();
      startedRef.current = true;
      settledRef.current = false;
      setTwitterMorphStep(0);
      setActivePlace(0);
      setCounts(Object.fromEntries(data.places.map((p) => [p.id, 0])));

      // Animate 3 → 2 → 1, then Twitter punchline morph.
      const sequence = [3, 2, 1];
      let delay = reduceMotion ? 0 : 280;

      sequence.forEach((rank) => {
        const place = placeByRank(rank);
        if (!place) return;

        const startId = window.setTimeout(() => {
          setActivePlace(rank);
          animateCount(place, () => {
            if (place.punchlineMorph) runTwitterMorph(place);
          });
        }, delay);
        timersRef.current.push(startId);

        delay += (reduceMotion ? 40 : place.durationMs ?? 1800) + (reduceMotion ? 40 : 380);
      });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
        if (visible && !startedRef.current) {
          runSequence();
          return;
        }
        if (!visible && entry.intersectionRatio < 0.15 && settledRef.current) {
          startedRef.current = false;
        }
      },
      { threshold: [0, 0.15, 0.4, 0.6] }
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      clearAll();
    };
  }, [reduceMotion]);

  return (
    <SectionTransition
      ref={rootRef}
      className="wrapped-card wrapped-accent-teal social-podium-chapter"
      variant="rise"
    >
      <span className="wrapped-kicker">{data.kicker}</span>
      <div className="wrapped-body social-podium-body">
        <h2 className="lore-iceberg-headline">{data.headline}</h2>
        <p className="wrapped-caption">{data.subheading}</p>

        <ol className="social-podium" aria-live="polite">
          {PODIUM_ORDER.map((rank) => {
            const place = placeByRank(rank);
            if (!place) return null;

            let value = counts[place.id].toLocaleString("en-US");
            if (place.punchlineMorph && twitterMorphStep > 0) {
              const digits = String(place.countTo).split("");
              value = morphDisplay(
                digits,
                place.punchlineMorph,
                twitterMorphStep,
                place.punchlineFromEnd
              );
            }

            const isActive = activePlace === rank;
            const isMorphing = place.punchlineMorph && twitterMorphStep > 0;

            return (
              <li
                key={place.id}
                className={`social-podium-slot social-podium-slot--${rank}${isActive ? " is-active" : ""}${isMorphing ? " is-punchline" : ""}`}
              >
                <div className="social-podium-card">
                  <span className="social-podium-rank">{rank}</span>
                  <p className="social-podium-value">{value}</p>
                  <p className="social-podium-platform">{place.platform}</p>
                  <p className="social-podium-metric">{place.metric}</p>
                </div>
                <div className="social-podium-block" aria-hidden="true" />
              </li>
            );
          })}
        </ol>
      </div>
    </SectionTransition>
  );
}
