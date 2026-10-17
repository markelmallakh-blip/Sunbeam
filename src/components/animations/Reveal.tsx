"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { duration, easeSoft } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  /** Vertical travel in px. */
  offset?: number;
  className?: string;
};

/*
 * Fade-up entrance each time the element scrolls into view (Framer Motion); it resets once it
 * has left the screen, so returning visitors see it again.
 * The initial state is identical on server and client (no hydration mismatch); with reduced
 * motion the content appears instantly and MotionConfig drops the vertical travel.
 */
export function Reveal({ children, delay = 0, offset = 24, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "0px 0px -10% 0px" }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: duration.slow, ease: easeSoft, delay }
      }
    >
      {children}
    </motion.div>
  );
}
