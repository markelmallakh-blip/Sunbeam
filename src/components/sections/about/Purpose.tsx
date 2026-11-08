"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { purpose } from "@/content/about";

/*
 * Vision and mission as a scroll-scrubbed vertical carousel, centred, on every screen size: the
 * current statement large in the middle, the next small and cropped at the bottom; scrolling
 * carries the first up (shrinking, cropped at the top) as the second grows into the middle, and
 * scrolling back plays it in reverse. Reduced motion shows the two statements one after the other.
 * The founder section (rendered right after, in the same wrapper on the about page) slides up over
 * the pinned screen; the sticky part is a sibling of it because a sticky element only stays pinned
 * while its parent is on screen.
 */
export function Purpose() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const reduceMotion = useReducedMotion();
  const t = useSpring(useTransform(scrollYProgress, [0.12, 0.88], [0, 1], { clamp: true }), {
    stiffness: 140,
    damping: 26,
  });
  const states = [
    {
      y: useTransform(t, [0, 1], ["0svh", "-47svh"]),
      scale: useTransform(t, [0, 1], [1, 0.42]),
      opacity: useTransform(t, [0, 1], [1, 0.45]),
    },
    {
      y: useTransform(t, [0, 1], ["47svh", "0svh"]),
      scale: useTransform(t, [0, 1], [0.42, 1]),
      opacity: useTransform(t, [0, 1], [0.45, 1]),
    },
  ];

  if (reduceMotion) return <Plain />;

  return (
    <div ref={ref} className="h-[220svh] bg-mist">
      <div className="sticky top-0 h-svh overflow-hidden">
        {purpose.statements.map((statement, index) => {
          const state = states[index];
          return state ? (
            <div
              key={statement.label}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-edge"
            >
              <motion.article
                style={{ y: state.y, scale: state.scale, opacity: state.opacity }}
                className="mx-auto w-full max-w-[90.5rem] origin-center"
              >
                <Statement label={statement.label} text={statement.text} large />
              </motion.article>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

function Statement({ label, text, large }: { label: string; text: string; large?: boolean }) {
  return (
    <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-3 text-center sm:gap-5">
      <h2 className="text-small font-semibold tracking-[1px] text-slate uppercase">{label}</h2>
      <p
        className={
          large
            ? "text-[1.25rem] leading-[1.3] font-medium text-ink sm:text-heading-1 sm:leading-[1.2]"
            : "text-heading-4 leading-[1.35] font-medium text-ink"
        }
      >
        {text}
      </p>
    </div>
  );
}

/* Reduced motion: the two statements one after the other, centred. */
function Plain() {
  return (
    <div className="flex flex-col gap-12 bg-mist px-edge py-block">
      {purpose.statements.map((statement) => (
        <Statement key={statement.label} label={statement.label} text={statement.text} />
      ))}
    </div>
  );
}
