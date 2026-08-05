"use client";

import { motion, useReducedMotion } from "framer-motion";
import CharacterSprite from "./CharacterSprite";

const TRANSITION = { duration: 0.58, ease: [0.33, 1, 0.68, 1] };
const REDUCED = { duration: 0.2, ease: "easeOut" };

/**
 * Circular-stage slots. `left` is % of the stage; x:-50% centers the sprite.
 * rel: -2..2 (far left → far right)
 */
function slotStyle(rel, confirming) {
  const clamped = Math.max(-2, Math.min(2, rel));
  if (clamped === 0) {
    return {
      left: "50%",
      x: "-50%",
      y: confirming ? -12 : 0,
      scale: confirming ? 1.12 : 1,
      opacity: 1,
      filter: "brightness(1) blur(0px)",
      zIndex: 4,
    };
  }
  const side = clamped < 0 ? -1 : 1;
  const depth = Math.abs(clamped);
  const left = 50 + side * (depth === 1 ? 34 : 52);
  return {
    left: `${left}%`,
    x: "-50%",
    y: 18 + (depth - 1) * 12,
    scale: depth === 1 ? 0.55 : 0.38,
    opacity: depth === 1 ? 0.34 : 0,
    filter: depth === 1 ? "brightness(0.15) blur(2.5px)" : "brightness(0.08) blur(4px)",
    zIndex: depth === 1 ? 2 : 1,
  };
}

function Particles({ active }) {
  if (!active) return null;
  return (
    <div className="which-ali-particles" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className={`which-ali-particle which-ali-particle--${i}`} />
      ))}
    </div>
  );
}

/**
 * Spotlight + platform + three visible sprites on a circular stage.
 */
export default function CharacterStage({
  archetypes,
  activeIndex,
  confirming = false,
  rotating = false,
}) {
  const reduceMotion = useReducedMotion();
  const total = archetypes.length;
  const transition = reduceMotion ? REDUCED : TRANSITION;

  const visible = [-1, 0, 1].map((rel) => {
    const index = (activeIndex + rel + total) % total;
    return { rel, index, archetype: archetypes[index] };
  });

  const active = archetypes[activeIndex];
  const idle = !reduceMotion && !rotating && !confirming;

  return (
    <div
      className={`which-ali-stage${confirming ? " is-confirming" : ""}${rotating ? " is-rotating" : ""}`}
    >
      <div className="which-ali-spotlight" aria-hidden="true">
        <span className="which-ali-spotlight-cone" />
        <span className="which-ali-spotlight-haze" />
        <Particles active={!reduceMotion} />
      </div>

      <div className="which-ali-stage-figures">
        {visible.map(({ rel, archetype }) => {
          const isCenter = rel === 0;
          const style = slotStyle(rel, confirming && isCenter);
          const enterRel = rel === 0 ? 0 : rel > 0 ? 2 : -2;
          return (
            <motion.div
              key={archetype.id}
              className={`which-ali-figure which-ali-figure--${isCenter ? "center" : rel < 0 ? "left" : "right"}`}
              initial={reduceMotion ? false : slotStyle(enterRel, false)}
              animate={style}
              transition={transition}
            >
              <motion.div
                className={`which-ali-figure-idle${idle && isCenter ? " is-idle" : ""}`}
                animate={
                  idle && isCenter
                    ? { y: [0, -3, 0], scale: [1, 1.015, 1] }
                    : { y: 0, scale: 1 }
                }
                transition={
                  idle && isCenter
                    ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
              >
                <CharacterSprite
                  archetype={archetype}
                  silhouetted={!isCenter}
                  alt={isCenter ? `${archetype.name} character` : ""}
                />
              </motion.div>
              {isCenter ? (
                <span
                  className={`which-ali-contact-shadow${idle ? " is-idle" : ""}`}
                  aria-hidden="true"
                />
              ) : null}
            </motion.div>
          );
        })}
      </div>

      <div className="which-ali-platform" aria-hidden="true">
        <span className="which-ali-platform-glow" />
        <span className="which-ali-platform-rim" />
        <span className="which-ali-platform-floor" />
        <span className="which-ali-platform-reflect" />
      </div>

      {confirming ? <span className="which-ali-select-flash" aria-hidden="true" /> : null}

      <span className="sr-only" aria-live="polite">
        {active?.name}
      </span>
    </div>
  );
}
