"use client";

import Link from "next/link";

/**
 * Shared CTA for Wrapped pages — primary (solid) or ghost (outline).
 * Sharp corners, lowercase labels, product-site feel (not pill SaaS).
 */
export default function WrappedButton({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  external = false,
  ariaLabel,
}) {
  const classes = `wrapped-btn wrapped-btn-${variant} ${className}`.trim();

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noreferrer"
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
