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
 * - A: one pinned screen: the vision photo left and statement right. Scrolling glides both columns
 *   up together, smoothly eased, so the mission statement rises in under the vision photo and
 *   the mission photo under the vision statement.
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

/* A: two column strips that glide up together, bringing the mission pair in under the vision's. */
function Swap() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [vision, mission] = purpose.statements;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // Each column is a two-screen strip: left the vision photo above the mission statement, right
  // the vision statement above the mission photo. Through the middle of the pinned stretch both
  // strips glide up together (spring-smoothed), so the mission pair rises in under the vision's.
  const glide = useSpring(useTransform(scrollYProgress, [0.25, 0.75], [0, 1], { clamp: true }), {
    stiffness: 90,
    damping: 24,
    restDelta: 0.0005,
  });
  const y = useTransform(glide, (value) => `${value * -50}%`);
  if (!vision || !mission) return null;

  if (reduceMotion) {
    return (
      <div className="flex flex-col gap-stack bg-white px-edge py-block">
        {[vision, mission].map((statement) => (
          <SwapPanel key={statement.label} statement={statement} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Phones: the two pairs one after another. */}
      <div className="flex flex-col gap-stack bg-white px-edge py-block lg:hidden">
        {[vision, mission].map((statement) => (
          <SwapPanel key={statement.label} statement={statement} />
        ))}
      </div>
      <div ref={trackRef} className="hidden h-[220svh] bg-white lg:block">
        <div className="sticky top-0 h-svh px-edge py-[max(var(--spacing-edge),5rem)]">
          <div className="grid h-full grid-cols-2 gap-16">
            <div className="relative overflow-hidden">
              <motion.div
                style={{ y }}
                className="absolute inset-x-0 top-0 h-[200%] will-change-transform"
              >
                {/* Photos stop 4px short of the seam so no sub-pixel sliver peeks in at rest. */}
                <div className="relative h-1/2">
                  <div className="absolute inset-x-0 top-0 bottom-1 overflow-hidden">
                    <ResponsiveImage asset={vision.image} sizes="50vw" fill parallax={false} />
                  </div>
                </div>
                <div className="h-1/2">
                  <SwapText statement={mission} id="purpose-1" />
                </div>
              </motion.div>
            </div>
            <div className="relative overflow-hidden">
              <motion.div
                style={{ y }}
                className="absolute inset-x-0 top-0 h-[200%] will-change-transform"
              >
                <div className="h-1/2">
                  <SwapText statement={vision} id="purpose-0" />
                </div>
                <div className="relative h-1/2">
                  <div className="absolute inset-x-0 top-1 bottom-0 overflow-hidden">
                    <ResponsiveImage asset={mission.image} sizes="50vw" fill parallax={false} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SwapText({ statement, id }: { statement: Statement; id: string }) {
  return (
    <div className="mx-auto flex h-full max-w-[44rem] flex-col items-center justify-center gap-6 text-center">
      <h2 id={id} className="text-heading-4 font-semibold text-ink">
        {statement.label}
      </h2>
      <p className="text-heading-2 leading-[1.3] font-medium text-ink">{statement.text}</p>
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
