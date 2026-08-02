"use client";

import { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Shared entrance treatment for the content inside a story card. Cards mount fresh
// each time the deck brings them on screen, so a simple mount-triggered animate
// (rather than scroll-based whileInView) is all that's needed here — the deck itself
// (see StoryDeck.jsx) handles the card-to-card slide/fade.
const VARIANTS = {
  // Default: gentle rise + scale for normal (non-sticky) card layouts.
  rise: {
    initial: { opacity: 0, y: 28, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  // Opacity-only: for cards containing `position: sticky` descendants — animating
  // transform (y/scale) on an ancestor of a sticky element can make browsers treat
  // that ancestor as the sticky containing block and break the pin.
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
};

const SectionTransition = forwardRef(function SectionTransition(
  { as = "section", variant = "rise", delay = 0, duration = 0.9, className = "", children, ...rest },
  ref
) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.section;
  const { initial, animate } = VARIANTS[variant] ?? VARIANTS.rise;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={reduceMotion ? false : initial}
      animate={animate}
      transition={{ duration: reduceMotion ? 0.01 : duration, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
});

export default SectionTransition;
