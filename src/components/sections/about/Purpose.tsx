"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useRef, type CSSProperties, type RefObject } from "react";
import { purpose } from "@/content/about";
import { cn } from "@/lib/cn";

type Statement = (typeof purpose.statements)[number];

/*
 * Vision and mission as minimal rows (after Lama Lama's services list): a hairline, the title in
 * the founder heading's style on the left and the statement large on the right. Each row pins as
 * it reaches the top and the next pins one strip lower, so the covered row stays visible as a
 * tab: just its title, with equal space above and below it. To get that, a pinned row rises by
 * part of its top padding (`--lift`) and its statement fades out as the next row arrives. The
 * founder section (rendered right after, in the same wrapper on the about page) then slides up
 * over both. The rows are siblings of the founder section because a sticky element only stays
 * pinned while its parent is on screen. With reduced motion they simply sit one after another.
 */
export function Purpose() {
  const reduceMotion = useReducedMotion();
  const nextRef = useRef<HTMLElement>(null);
  const count = purpose.statements.length;

  return (
    <>
      {purpose.statements.map((statement, index) => (
        <Row
          key={statement.label}
          ref={index === 1 ? nextRef : undefined}
          next={index === 0 ? nextRef : null}
          statement={statement}
          index={index}
          count={count}
          pinned={!reduceMotion}
        />
      ))}
    </>
  );
}

function Row({
  ref,
  next,
  statement,
  index,
  count,
  pinned,
}: {
  ref?: RefObject<HTMLElement | null>;
  /** The row that slides over this one; null for the last row. */
  next: RefObject<HTMLElement | null> | null;
  statement: Statement;
  index: number;
  count: number;
  pinned: boolean;
}) {
  // The next row's place on screen drives the fade: fully shown until it is about a third of a
  // screen from its pin, gone as it pins. (A scroll-progress range would track its resting
  // position, which a sticky element leaves behind.)
  const fade = useMotionValue(1);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    const below = next?.current;
    if (!below) return;
    const { top } = below.getBoundingClientRect();
    const pin = parseFloat(getComputedStyle(below).top) || 0;
    fade.set(Math.min(1, Math.max(0, (top - pin) / (window.innerHeight * 0.35))));
  });

  return (
    <article
      ref={ref}
      aria-labelledby={`purpose-${index}`}
      style={
        {
          // Pinned under the compact header (64px) while it shows, at the very top while it is
          // hidden, and lifted so the tab's spacing is even.
          "--row-top": `calc(var(--bar) - var(--lift) + ${index} * (var(--lift) + var(--strip)))`,
          // A pinned row stops where the wrapper ends, so without this the rows would line up
          // there; the shrinking margin keeps each earlier row's tab in view.
          "--row-after": `calc(${count - 1 - index} * (var(--lift) + var(--strip)))`,
        } as CSSProperties
      }
      className={cn(
        // Tab = space + title line + the same space: 1.25rem + ~1.875rem + 1.25rem on phones,
        // 1.75rem + 2.275rem + 1.75rem on desktop. `--lift` is the top padding minus that space.
        "grid min-h-[22rem] gap-y-5 border-t border-hairline bg-white px-edge py-12 [--bar:4rem] [--lift:1.75rem] [--strip:4.375rem] lg:min-h-[min(36rem,64svh)] lg:grid-cols-12 lg:gap-x-8 lg:py-24 lg:[--lift:4.25rem] lg:[--strip:5.775rem] [html[data-header-hidden]_&]:[--bar:0rem]",
        pinned && "sticky top-(--row-top) mb-(--row-after) transition-[top] duration-700 ease-soft",
      )}
    >
      <h2 id={`purpose-${index}`} className="text-heading-4 font-semibold text-ink lg:col-span-5">
        {statement.label}
      </h2>
      <motion.p
        style={pinned && next ? { opacity: fade } : undefined}
        className="max-w-[56rem] text-[clamp(1.375rem,0.9rem+1.95vw,2.5rem)] leading-[1.3] font-medium text-ink lg:col-span-6 lg:col-start-7"
      >
        {statement.text}
      </motion.p>
    </article>
  );
}
