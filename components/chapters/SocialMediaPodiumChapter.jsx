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
  const [twitterPunch, setTwitterPunch] = useState(false);
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

    function runSequence() {
      clearAll();
      startedRef.current = true;
      settledRef.current = false;
      setTwitterPunch(false);
      setActivePlace(0);
      setCounts(Object.fromEntries(data.places.map((p) => [p.id, 0])));

      // Animate 3 → 2 → 1, then Twitter punchline.
      const sequence = [3, 2, 1];
      let delay = reduceMotion ? 0 : 280;

      sequence.forEach((rank) => {
        const place = placeByRank(rank);
        if (!place) return;

        const startId = window.setTimeout(() => {
          setActivePlace(rank);
          animateCount(place, () => {
            if (place.punchline) {
              const punchId = window.setTimeout(() => {
                setTwitterPunch(true);
                settledRef.current = true;
              }, reduceMotion ? 0 : place.punchlineDelayMs ?? 600);
              timersRef.current.push(punchId);
            }
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
            const showPunch = place.punchline && twitterPunch;
            const value = showPunch
              ? place.punchline
              : counts[place.id].toLocaleString("en-US");
            const isActive = activePlace === rank;

            return (
              <li
                key={place.id}
                className={`social-podium-slot social-podium-slot--${rank}${isActive ? " is-active" : ""}${showPunch ? " is-punchline" : ""}`}
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
