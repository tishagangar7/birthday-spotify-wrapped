"use client";

import { motion, useReducedMotion } from "framer-motion";
import WrappedButton from "./WrappedButton";

export default function Intro({ onEnter }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="intro"
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 1.15, ease: "easeInOut" }}
    >
      <motion.div
        className="intro-copy"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.25 }}
      >
        <p>actual life</p>
        <p className="intro-name">ali</p>
        <p>2005 — 2026</p>
        <p className="intro-credit">
          21 years recorded by
          <br />
          the people who were there
        </p>
      </motion.div>
      <WrappedButton variant="ghost" className="enter-button" onClick={onEnter}>
        [ enter ]
      </WrappedButton>
    </motion.div>
  );
}
