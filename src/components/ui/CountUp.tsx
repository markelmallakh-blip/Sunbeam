"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";

type CountUpProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  /** Minimum digits, zero-padded (2 → "06"). */
  pad?: number;
  /** Seconds the count takes. */
  duration?: number;
  className?: string;
};

/*
 * Number that counts up from zero each time it scrolls into view. The server renders the
 * final value (no-JS, crawlers, reduced motion), and the client resets it to zero before paint.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  pad = 0,
  duration = 1.6,
  className,
}: CountUpProps) {
  const format = (n: number) => `${prefix}${String(Math.round(n)).padStart(pad, "0")}${suffix}`;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (ref.current && !reduceMotion) ref.current.textContent = format(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- format only depends on the props listed.
  }, [reduceMotion, suffix, prefix, pad]);

  useEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion) return;
    // Back to zero once off screen, so the count plays again on every visit.
    if (!inView) {
      element.textContent = format(0);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        element.textContent = format(latest);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- format only depends on the props listed.
  }, [inView, reduceMotion, value, suffix, prefix, pad, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
