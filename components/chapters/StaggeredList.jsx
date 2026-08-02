"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionTransition from "../SectionTransition";

const STEP_DELAY = 0.5;
const START_DELAY = 0.3;

/**
 * Generic "custom order" build-up: list items appear one at a time, like
 * watching an order get assembled (originally built for the "Most Ordered
 * Personality Trait" chapter) — reused across any chapter that reveals a
 * curated list bit by bit (achievements, starting lineup, top searches).
 */
export default function StaggeredList({ accent = "wrapped-accent-purple", kicker, heading, items, footer }) {
  const reduceMotion = useReducedMotion();

  return (
    <SectionTransition className={`wrapped-card ${accent}`} variant="fade">
      <span className="wrapped-kicker">{kicker}</span>
      <div className="wrapped-body">
        {heading ? <p className="wrapped-order-heading">{heading}</p> : null}
        <ol className="wrapped-order-list">
          {items.map((item, index) => (
            <motion.li
              key={item.label}
              className="wrapped-order-item"
              initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: reduceMotion ? 0.01 : 0.45,
                delay: reduceMotion ? 0 : START_DELAY + index * STEP_DELAY,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="wrapped-order-scoop" aria-hidden="true" />
              <span className="wrapped-order-text">
                <span className="wrapped-order-label">{item.label}</span>
                {item.detail ? <span className="wrapped-order-detail">{item.detail}</span> : null}
              </span>
            </motion.li>
          ))}
        </ol>
        {footer ? (
          <motion.p
            className="wrapped-caption wrapped-order-total"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : START_DELAY + items.length * STEP_DELAY }}
          >
            {footer}
          </motion.p>
        ) : null}
      </div>
    </SectionTransition>
  );
}
