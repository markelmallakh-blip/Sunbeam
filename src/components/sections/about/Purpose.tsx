"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion";
import { Fragment, useRef, useState } from "react";
import { purpose } from "@/content/about";
import { easeSoft } from "@/lib/motion";

/*
 * Figma "Vision & Mission" (90:2524), one statement at a time. The section pins while it is
 * scrolled through; past the midpoint the vision gives way to the mission (and back when
 * scrolling up). The leaving statement fades and softens away at once while the arriving one
 * builds word by word — each word rising into focus in a quick ripple — starting as the old one
 * leaves, so the screen is never empty. The vision is on screen from the start; with reduced
 * motion the two are simply shown stacked.
 */
type Statement = (typeof purpose.statements)[number];

const statementVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.03 } },
  gone: {
    opacity: 0,
    y: -12,
    filter: "blur(6px)",
    // Ease in, so the old words hold while the new ones start arriving, then slip away.
    transition: { duration: 0.6, ease: [0.4, 0, 1, 1] },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(8px)" },
  shown: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easeSoft },
  },
};

export function Purpose() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(progress < 0.5 ? 0 : 1);
  });

  if (reduceMotion) {
    return (
      <section aria-label="Our vision and mission" className="bg-white px-edge py-block">
        <div className="mx-auto flex max-w-[60rem] flex-col gap-20 text-center text-[#262626]">
          {purpose.statements.map((statement) => (
            <StatementBlock key={statement.label} statement={statement} />
          ))}
        </div>
      </section>
    );
  }

  const statement = purpose.statements[active];

  return (
    <section
      ref={sectionRef}
      aria-label="Our vision and mission"
      className="relative h-[180svh] bg-white"
    >
      <div className="sticky top-0 grid h-svh place-items-center px-edge text-center text-[#262626]">
        <AnimatePresence initial={false}>
          {statement && (
            <motion.div
              key={statement.label}
              variants={statementVariants}
              initial="hidden"
              animate="shown"
              exit="gone"
              className="col-start-1 row-start-1 max-w-[60rem]"
            >
              <StatementBlock statement={statement} animated />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function StatementBlock({ statement, animated }: { statement: Statement; animated?: boolean }) {
  const words = statement.text.split(" ");
  return (
    <div className="flex flex-col items-center gap-6">
      {animated ? (
        <motion.h2
          variants={wordVariants}
          className="text-small font-semibold tracking-[1px] text-slate uppercase"
        >
          {statement.label}
        </motion.h2>
      ) : (
        <h2 className="text-small font-semibold tracking-[1px] text-slate uppercase">
          {statement.label}
        </h2>
      )}
      <p className="text-heading-3 leading-[1.3] font-medium">
        {animated ? (
          <>
            {/* The whole sentence for screen readers; the words below are visual only. */}
            <span className="sr-only">{statement.text}</span>
            <span aria-hidden>
              {words.map((word, index) => (
                <Fragment key={index}>
                  {/*
                   * Not the `inline-block` utility: with the theme's `--spacing-block` token,
                   * Tailwind also reads it as `inline-size: var(--spacing-block)` (~79px).
                   */}
                  <motion.span variants={wordVariants} className="[display:inline-block]">
                    {word}
                  </motion.span>
                  {/* The space sits between words: inline-block would swallow a trailing one. */}
                  {index < words.length - 1 && " "}
                </Fragment>
              ))}
            </span>
          </>
        ) : (
          statement.text
        )}
      </p>
    </div>
  );
}
