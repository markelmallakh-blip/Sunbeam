"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { easeSoft } from "@/lib/motion";

/*
 * A stat such as "20+" that counts up from zero the first time it scrolls into view. The final
 * value is what renders on the server and without JavaScript, and reduced motion keeps it as is.
 */
export function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : null;
  const suffix = match?.[2] ?? "";
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || reduceMotion || target === null) return;
    const controls = animate(0, target, {
      duration,
      ease: easeSoft,
      onUpdate: (latest) => setShown(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {target === null || shown === null ? value : `${shown}${suffix}`}
    </span>
  );
}
