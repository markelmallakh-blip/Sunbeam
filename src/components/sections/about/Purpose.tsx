"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { purpose } from "@/content/about";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { cn } from "@/lib/cn";

type Statement = (typeof purpose.statements)[number];

type Option = "A" | "B";

const options: Option[] = ["A", "B"];

/*
 * Vision and mission, in two layouts behind a temporary switch so they can be compared. Both
 * keep the section compact.
 * - A: a pinned screen of two masked columns; scrolling carries the vision (photo left) up and
 *   out while the mission (photo right) rises in, and plays back on the way up.
 * - B: no images. A scroll-scrubbed vertical carousel, centred: the current statement large in the
 *   middle, the next small and cropped at the bottom; scrolling carries the first up (shrinking,
 *   cropped at the top) as the second grows into the middle.
 * The founder section (rendered right after, in the same wrapper on the about page) slides up
 * over the pinned layouts; their sticky parts are siblings of it because a sticky element only
 * stays pinned while its parent is on screen.
 */
export function Purpose() {
  const [option, setOption] = useState<Option>("A");

  return (
    <>
      {/* Temporary: compares the layouts. Remove once the client has chosen. */}
      <div className="flex justify-end bg-white px-edge pt-6">
        <div
          role="group"
          aria-label="Vision and mission layout"
          className="flex gap-1 rounded-[4px] bg-mist p-1"
        >
          {options.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={option === key}
              onClick={() => setOption(key)}
              className={cn(
                "rounded-[2px] px-3 py-1.5 text-caption font-medium tracking-[1px] uppercase transition-colors duration-300",
                option === key ? "bg-ink text-white" : "text-slate hover:text-ink",
              )}
            >
              Option {key}
            </button>
          ))}
        </div>
      </div>
      {option === "A" && <Swap />}
      {option === "B" && <SizeSwap />}
    </>
  );
}

/* Progress (0–1) of a tall track whose child is pinned for its length. */
function useTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return { ref, progress: scrollYProgress };
}

/* Phones and reduced motion: the two statements simply one after the other. */
function Plain({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-10 bg-mist px-edge py-block sm:grid-cols-2", className)}>
      {purpose.statements.map((statement) => (
        <article key={statement.label} className="flex flex-col gap-3">
          <h2 className="text-small font-semibold tracking-[1px] text-slate uppercase">
            {statement.label}
          </h2>
          <p className="text-heading-4 leading-[1.35] font-medium text-ink">{statement.text}</p>
        </article>
      ))}
    </div>
  );
}

/*
 * A: one pinned screen split into two masked columns, scrubbed by the scroll. The vision shows its
 * photo on the left and statement on the right. Scrolling carries both up inside their masks while
 * the mission rises in behind them: its statement into the left column, its photo into the right.
 * Scrolling up plays it back. A thin centre rule with a dot stays put between the columns.
 */
function Swap() {
  const { ref, progress } = useTrack();
  const reduceMotion = useReducedMotion();
  const [vision, mission] = purpose.statements;
  // Short holds at each end, so each pair settles fully before and after the change.
  const t = useSpring(useTransform(progress, [0.15, 0.85], [0, 1], { clamp: true }), {
    stiffness: 120,
    damping: 26,
  });
  const y = useTransform(t, [0, 1], ["0%", "-50%"]);
  // The dark half of the divider: the top half on the vision, sliding to the bottom half for the mission.
  const marker = useTransform(t, [0, 1], ["0%", "100%"]);

  if (!vision || !mission) return null;

  const panels = (
    <div className="flex flex-col gap-stack bg-white px-edge py-block">
      {[vision, mission].map((statement) => (
        <SwapPanel key={statement.label} statement={statement} />
      ))}
    </div>
  );
  if (reduceMotion) return panels;

  const photo = (statement: Statement) => (
    <div className="relative h-1/2 overflow-hidden">
      <ResponsiveImage asset={statement.image} sizes="50vw" fill parallax={false} />
    </div>
  );
  const text = (statement: Statement, index: number) => (
    <div className="h-1/2">
      <SwapText statement={statement} id={`purpose-${index}`} />
    </div>
  );

  return (
    <>
      {/* Phones: the two pairs one after another. */}
      <div className="lg:hidden">{panels}</div>
      <div ref={ref} className="hidden h-[220svh] bg-white lg:block">
        <div className="sticky top-0 h-svh px-edge py-[max(var(--spacing-edge),5rem)]">
          <div className="relative grid h-full grid-cols-2 gap-16">
            {/* Left mask: vision photo, then mission statement. */}
            <div className="relative overflow-hidden">
              <motion.div style={{ y }} className="h-[200%] will-change-transform">
                {photo(vision)}
                {text(mission, 1)}
              </motion.div>
            </div>
            {/* Right mask: vision statement, then mission photo. */}
            <div className="relative overflow-hidden">
              <motion.div style={{ y }} className="h-[200%] will-change-transform">
                {text(vision, 0)}
                {photo(mission)}
              </motion.div>
            </div>
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/15"
            >
              <motion.span
                style={{ y: marker }}
                className="absolute inset-x-0 top-0 h-1/2 bg-ink"
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function SwapText({ statement, id }: { statement: Statement; id: string }) {
  return (
    <div className="mx-auto flex h-full max-w-[44rem] flex-col items-center justify-center gap-4 text-center">
      <h2 id={id} className="text-heading-5 font-semibold text-ink">
        {statement.label}
      </h2>
      <p className="text-heading-3 leading-[1.35] font-medium text-ink">{statement.text}</p>
    </div>
  );
}

function SwapPanel({ statement }: { statement: Statement }) {
  return (
    <article className="flex flex-col gap-5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ResponsiveImage asset={statement.image} sizes="100vw" fill parallax={false} />
      </div>
      <h2 className="text-heading-4 font-semibold text-ink">{statement.label}</h2>
      <p className="text-heading-3 leading-[1.3] font-medium text-ink">{statement.text}</p>
    </article>
  );
}

/*
 * B: a vertical scroll carousel of the two statements, scrubbed by the scroll. The current one sits
 * large in the middle while the next waits small and half cropped at the bottom edge; scrolling
 * shrinks the first and carries it up until it is cropped by the top edge, while the second
 * grows into the middle. Every step follows the scroll, so it is smooth both ways.
 */
function SizeSwap() {
  const { ref, progress } = useTrack();
  const reduceMotion = useReducedMotion();
  const t = useSpring(useTransform(progress, [0.12, 0.88], [0, 1], { clamp: true }), {
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
    <>
      <Plain className="lg:hidden" />
      <div ref={ref} className="hidden h-[220svh] bg-mist lg:block">
        <div className="sticky top-0 h-svh overflow-hidden px-edge">
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
                  <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-5 text-center">
                    <h2 className="text-small font-semibold tracking-[1px] text-slate uppercase">
                      {statement.label}
                    </h2>
                    <p className="text-heading-1 leading-[1.2] font-medium text-ink">
                      {statement.text}
                    </p>
                  </div>
                </motion.article>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}
