"use client";

import { createElement, forwardRef } from "react";

/**
 * Shared entrance for story cards.
 * Uses CSS keyframes (not Framer Motion) so content never gets stuck at opacity 0 —
 * a known Framer + React 19 Strict Mode failure mode in Next.js 16.
 */
const SectionTransition = forwardRef(function SectionTransition(
  {
    as = "section",
    variant = "rise",
    delay = 0,
    duration = 0.9,
    className = "",
    children,
    style,
    ...rest
  },
  ref
) {
  const enterClass =
    variant === "fade" ? "section-enter section-enter-fade" : "section-enter section-enter-rise";

  return createElement(
    as,
    {
      ref,
      className: `${enterClass} ${className}`.trim(),
      style: {
        ...style,
        "--section-enter-duration": `${duration}s`,
        "--section-enter-delay": `${delay}s`,
      },
      ...rest,
    },
    children
  );
});

export default SectionTransition;
