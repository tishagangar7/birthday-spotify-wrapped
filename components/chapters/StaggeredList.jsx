"use client";

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
  return (
    <SectionTransition className={`wrapped-card ${accent}`} variant="fade">
      <span className="wrapped-kicker">{kicker}</span>
      <div className="wrapped-body">
        {heading ? <p className="wrapped-order-heading">{heading}</p> : null}
        <ol className="wrapped-order-list">
          {items.map((item, index) => (
            <li
              key={item.label}
              className="wrapped-order-item stagger-in-scale"
              style={{
                "--stagger-index": index,
                "--stagger-delay": `${START_DELAY}s`,
                "--stagger-step": `${STEP_DELAY}s`,
              }}
            >
              <span className="wrapped-order-scoop" aria-hidden="true" />
              <span className="wrapped-order-text">
                <span className="wrapped-order-label">{item.label}</span>
                {item.detail ? <span className="wrapped-order-detail">{item.detail}</span> : null}
              </span>
            </li>
          ))}
        </ol>
        {footer ? (
          <p
            className="wrapped-caption wrapped-order-total stagger-in"
            style={{
              "--stagger-index": items.length,
              "--stagger-delay": `${START_DELAY}s`,
              "--stagger-step": `${STEP_DELAY}s`,
              "--stagger-duration": "0.5s",
            }}
          >
            {footer}
          </p>
        ) : null}
      </div>
    </SectionTransition>
  );
}
