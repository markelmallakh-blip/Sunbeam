"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { purpose } from "@/content/about";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { cn } from "@/lib/cn";
import { smoothScroll } from "@/lib/smooth-scroll";

type Statement = (typeof purpose.statements)[number];

type Option = "A" | "B";

const options: Option[] = ["A", "B"];

/*
 * Vision and mission, in two layouts behind a temporary switch so they can be compared. Both
 * keep the section compact.
 * - A: one screen that switches its content in place: once it reaches the top of the window, the
 *   next scroll changes the vision (photo left) to the mission (photo right) instead of moving
 *   the page; the scroll after that carries on.
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
 * A: one screen whose content switches in place. When the section reaches the top of the window,
 * the page stops scrolling: the next wheel or trackpad scroll changes the slide instead (one eased
 * glide inside the frame) from the vision, photo left and statement right, to the mission,
 * statement left and photo right. One more scroll in the same direction carries on down the page;
 * scrolling up switches back first. A thin centre rule with a dot marks each statement.
 */
function Swap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [vision, mission] = purpose.statements;
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduceMotion) return;
    const GLIDE = 1000; // the slide change, matching the CSS transition
    const QUIET = 350; // trackpad momentum counts as one gesture until it pauses this long
    let blockedUntil = 0;

    const go = (next: number) => {
      stepRef.current = next;
      setStep(next);
    };
    // Bring the section exactly to the top of the window (a locked glide ignores extra input).
    const align = () => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const lenis = smoothScroll.get();
      if (lenis) lenis.scrollTo(top, { duration: 0.8, lock: true, force: true });
      else window.scrollTo({ top, behavior: "smooth" });
    };

    const onWheel = (event: WheelEvent) => {
      if (!window.matchMedia("(min-width: 1024px)").matches || event.deltaY === 0) return;
      const now = performance.now();
      const take = () => {
        event.preventDefault();
        event.stopImmediatePropagation();
        // Keep absorbing the same gesture's momentum until it pauses.
        blockedUntil = Math.max(blockedUntil, now + QUIET);
      };
      const top = section.getBoundingClientRect().top;
      const near = Math.abs(top) < window.innerHeight * 0.5;
      if (now < blockedUntil && near) return take();

      const down = event.deltaY > 0;
      const aligned = Math.abs(top) < 4;
      if (aligned) {
        if (down && stepRef.current === 0) {
          go(1);
          take();
          blockedUntil = now + GLIDE + QUIET;
        } else if (!down && stepRef.current === 1) {
          go(0);
          take();
          blockedUntil = now + GLIDE + QUIET;
        }
        return; // otherwise let the page scroll on, out of the section
      }
      // Arriving: from above it opens on the vision, from below on the mission.
      if (down && top > 0 && top < window.innerHeight * 0.5) {
        go(0);
        align();
        take();
        blockedUntil = now + 800 + QUIET;
      } else if (!down && top < 0 && top > -window.innerHeight * 0.5) {
        go(1);
        align();
        take();
        blockedUntil = now + 800 + QUIET;
      }
    };

    // Capture on the window so this runs before the smooth-scroll library sees the wheel.
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, [reduceMotion]);

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
      <div
        ref={sectionRef}
        className="hidden h-svh bg-white px-edge py-[max(var(--spacing-edge),5rem)] lg:block"
      >
        <div className="relative h-full overflow-hidden">
          <div
            // The strip is one screen tall with the second slide 6rem below it, so the move is
            // one full slide plus that gap.
            style={{ transform: step ? "translateY(calc(-100% - 6rem))" : "translateY(0)" }}
            className="flex h-full flex-col gap-24 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
          >
            {[vision, mission].map((statement, index) => (
              <div
                key={statement.label}
                aria-hidden={step !== index}
                className="relative grid h-full shrink-0 grid-cols-2 gap-16"
              >
                {/* The vision has its photo on the left; the mission on the right. */}
                <div className={cn("relative overflow-hidden", index === 1 && "order-2")}>
                  <ResponsiveImage asset={statement.image} sizes="50vw" fill parallax={false} />
                </div>
                <SwapText statement={statement} id={`purpose-${index}`} />
                {/* Centre rule with a dot, between the photo and the statement. */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/15"
                >
                  <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
                </span>
              </div>
            ))}
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
