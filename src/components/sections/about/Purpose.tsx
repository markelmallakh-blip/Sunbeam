"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef, useState } from "react";
import { purpose } from "@/content/about";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { cn } from "@/lib/cn";
import { easeSoft } from "@/lib/motion";

type Statement = (typeof purpose.statements)[number];

type Option = "A" | "B" | "C" | "D" | "E";

const options: Option[] = ["A", "B", "C", "D", "E"];

/*
 * Vision and mission, in five layouts behind a temporary switch so they can be compared. All
 * keep the section compact; the pinned ones fill their screen with colour or photo rather than
 * white space.
 * - A: one pinned screen, photo left and statement right; scrolling wipes the mission's photo up
 *   over the vision's while the texts swap in opposite directions.
 * - B: no images. A scroll-scrubbed vertical carousel: the current statement large in the middle,
 *   the next small and cropped at the bottom; scrolling carries the first up (shrinking, cropped
 *   at the top) as the second grows into the middle.
 * - C: a horizontal track of two panels that slides sideways as you scroll down: a full-height
 *   photo (left, then right) frosted toward its inner edge like glass, the statement beside it;
 *   the photos stretch a little with the scroll speed and settle back (elastic).
 * - D: no images. A dark band with the two labels on the left, each with a loader that fills as
 *   you scroll, and the active statement on the right sliding in as the other leaves.
 * - E: no images. Two compact rows, a large pale "Vision" / "Mission" word beside each statement,
 *   whose words rise into place when the row comes into view.
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
      {option === "C" && <Horizontal />}
      {option === "D" && <DarkTabs />}
      {option === "E" && <WordRows />}
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

/* A: the pinned photo-and-statement swap. */
function Swap() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [vision, mission] = purpose.statements;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // The swap runs through the middle of the pinned stretch, so each holds still for a moment.
  const swap = useTransform(scrollYProgress, [0.3, 0.7], [0, 1], { clamp: true });
  const wipe = useTransform(swap, (value) => `inset(${(1 - value) * 100}% 0 0 0)`);
  const outY = useTransform(swap, [0, 1], ["0%", "60%"]);
  const outOpacity = useTransform(swap, [0, 0.45], [1, 0]);
  const inY = useTransform(swap, [0, 1], ["-60%", "0%"]);
  const inOpacity = useTransform(swap, [0.55, 1], [0, 1]);
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
        <div className="sticky top-0 grid h-svh grid-cols-2 gap-16 px-edge py-[max(var(--spacing-edge),5rem)]">
          <div className="relative overflow-hidden">
            <ResponsiveImage asset={vision.image} sizes="50vw" fill parallax={false} />
            <motion.div style={{ clipPath: wipe }} className="absolute inset-0">
              <ResponsiveImage asset={mission.image} sizes="50vw" fill parallax={false} />
            </motion.div>
          </div>
          <div className="relative overflow-hidden">
            <motion.div style={{ y: outY, opacity: outOpacity }} className="absolute inset-0">
              <SwapText statement={vision} id="purpose-0" />
            </motion.div>
            <motion.div style={{ y: inY, opacity: inOpacity }} className="absolute inset-0">
              <SwapText statement={mission} id="purpose-1" />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

function SwapText({ statement, id }: { statement: Statement; id: string }) {
  return (
    <div className="flex h-full max-w-[52rem] flex-col justify-center gap-6">
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
                  className="mx-auto w-full max-w-[90.5rem] origin-left"
                >
                  <div className="flex max-w-[64rem] flex-col gap-5">
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

/* C: two panels on a horizontal track; photos stretch with scroll speed and settle back. */
function Horizontal() {
  const { ref, progress } = useTrack();
  const reduceMotion = useReducedMotion();
  const x = useTransform(progress, [0.1, 0.9], ["0%", "-50%"], { clamp: true });
  const { scrollY } = useScroll();
  const speed = useSpring(useVelocity(scrollY), { stiffness: 260, damping: 30 });
  const stretch = useTransform(speed, [-2500, 0, 2500], [1.08, 1, 1.08]);
  const skew = useTransform(speed, [-2500, 0, 2500], [3, 0, -3]);
  if (reduceMotion) return <Plain />;

  return (
    <>
      <Plain className="lg:hidden" />
      <div ref={ref} className="hidden h-[220svh] bg-white lg:block">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <motion.div style={{ x }} className="flex w-[200vw]">
            {purpose.statements.map((statement, index) => {
              // The first panel has its photo on the left and text on the right; the second flips.
              const flipped = index % 2 === 1;
              return (
                <article
                  key={statement.label}
                  className="grid h-svh w-screen grid-cols-2 items-center"
                >
                  <div className={cn("relative h-full overflow-hidden", flipped && "order-2")}>
                    <motion.div
                      style={{ scaleX: stretch, skewX: skew }}
                      // Wider than its frame so the skew never shows an empty corner.
                      className="absolute inset-y-0 -right-[6%] -left-[6%] origin-center"
                    >
                      <ResponsiveImage asset={statement.image} sizes="50vw" fill parallax={false} />
                    </motion.div>
                    <GlassEdge side={flipped ? "left" : "right"} />
                  </div>
                  <div className="flex max-w-[44rem] flex-col gap-5 px-16">
                    <h2 className="flex items-center gap-3 text-small font-semibold tracking-[1px] text-slate uppercase">
                      <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                      <span aria-hidden className="h-px w-8 bg-ink/30" />
                      {statement.label}
                    </h2>
                    <p className="text-heading-2 leading-[1.3] font-medium text-ink">
                      {statement.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </>
  );
}

/*
 * Frosted glass along one side of a photo (after Lambert & Lambert): stacked backdrop blurs, each
 * stronger and masked closer to the edge, so the blur builds up smoothly toward the text.
 */
const GLASS = [2, 5, 10, 18, 28];

function GlassEdge({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 w-[28%]",
        side === "right" ? "right-0" : "left-0",
      )}
    >
      {GLASS.map((blur, i) => {
        const start = (i / GLASS.length) * 100;
        const end = ((i + 1) / GLASS.length) * 100;
        const direction = side === "right" ? "to right" : "to left";
        const mask = `linear-gradient(${direction}, transparent ${start}%, black ${end}%)`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
      <div
        className={cn(
          "absolute inset-0 from-transparent to-white/25",
          side === "right" ? "bg-linear-to-r" : "bg-linear-to-l",
        )}
      />
    </div>
  );
}

/* D: dark band, labels with scroll loaders on the left, the active statement on the right. */
function DarkTabs() {
  const { ref, progress } = useTrack();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (value) => setActive(value < 0.5 ? 0 : 1));
  const first = useTransform(progress, [0, 0.5], [0, 1], { clamp: true });
  const second = useTransform(progress, [0.5, 1], [0, 1], { clamp: true });
  const statement = purpose.statements[active];
  if (reduceMotion) return <Plain />;

  return (
    <>
      <Plain className="lg:hidden" />
      <div ref={ref} className="hidden h-[200svh] bg-ink lg:block">
        <div className="sticky top-0 flex h-svh items-center px-edge text-white">
          <div className="mx-auto grid w-full max-w-[90.5rem] grid-cols-12 gap-8">
            <ul className="col-span-4 flex flex-col gap-6 self-center">
              {purpose.statements.map((item, index) => (
                <li key={item.label} className="flex flex-col gap-3">
                  <span
                    className={cn(
                      "text-heading-4 font-semibold transition-colors duration-500",
                      active === index ? "text-white" : "text-white/35",
                    )}
                  >
                    {item.label}
                  </span>
                  <span aria-hidden className="h-px w-full max-w-[16rem] bg-white/15">
                    <motion.span
                      style={{ scaleX: index === 0 ? first : second }}
                      className="block h-full origin-left bg-white"
                    />
                  </span>
                </li>
              ))}
            </ul>
            <div className="relative col-span-7 col-start-6 min-h-[16rem] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {statement && (
                  <motion.p
                    key={statement.label}
                    initial={{ y: "40%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-40%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: easeSoft }}
                    className="text-heading-2 leading-[1.3] font-medium"
                  >
                    {statement.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* E: compact rows, a large pale label word beside each statement, words rising into view. */
function WordRows() {
  const reduceMotion = useReducedMotion();
  return (
    <section aria-label="Our vision and mission" className="bg-white px-edge">
      {purpose.statements.map((statement) => {
        const words = statement.text.split(" ");
        return (
          <article
            key={statement.label}
            className="mx-auto grid w-full max-w-[90.5rem] items-start gap-4 border-t border-hairline py-12 last:border-b lg:grid-cols-12 lg:gap-8 lg:py-16"
          >
            <h2 className="text-[clamp(2.5rem,1.6rem+3.7vw,5.5rem)] leading-none font-semibold tracking-[-0.02em] text-ink/12 lg:col-span-5">
              {statement.label.replace("Our ", "")}
            </h2>
            <motion.p
              initial={reduceMotion ? false : "hidden"}
              whileInView="shown"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ staggerChildren: 0.025 }}
              className="text-heading-4 leading-[1.45] font-medium text-ink lg:col-span-7"
            >
              <span className="sr-only">{statement.text}</span>
              <span aria-hidden>
                {words.map((word, i) => (
                  <span key={i} className="[display:inline-block] overflow-hidden align-bottom">
                    <motion.span
                      variants={{ hidden: { y: "100%" }, shown: { y: "0%" } }}
                      transition={{ duration: 0.6, ease: easeSoft }}
                      className="[display:inline-block]"
                    >
                      {word}
                      {i < words.length - 1 && "\u00a0"}
                    </motion.span>
                  </span>
                ))}
              </span>
            </motion.p>
          </article>
        );
      })}
    </section>
  );
}
