"use client";

import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, type CSSProperties } from "react";
import { services } from "@/content/homepage";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Option = "A" | "B" | "C";

const options: { key: Option; label: string }[] = [
  { key: "A", label: "Option A" },
  { key: "B", label: "Option B" },
  { key: "C", label: "Option C" },
];

/*
 * "Our Services", set apart from the project cards that follow. Three layouts sit behind a
 * temporary switch so they can be compared with the client:
 * - A: wide, tall photo bands one under another, title and description centred at the bottom.
 * - B: an accordion of three photos side by side, one open and two collapsed; hovering a
 *   collapsed one opens it. Phones get A's stacked bands.
 * - C: a numbered list beside one tall photo; the section pins and scrolling steps through the
 *   services, each with a vertical loader, before the page moves on.
 */
export function Services() {
  const [option, setOption] = useState<Option>("A");

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative flex scroll-mt-header flex-col items-center gap-stack bg-mist px-edge py-block"
    >
      {/* Temporary: compares the three layouts. Remove once the client has chosen. */}
      <div
        role="group"
        aria-label="Services layout"
        className="flex gap-1 self-end rounded-[4px] bg-white p-1 lg:absolute lg:top-8 lg:right-(--spacing-edge)"
      >
        {options.map(({ key, label }) => (
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
            {label}
          </button>
        ))}
      </div>

      {option !== "C" && <Intro />}
      {option === "A" && <Bands />}
      {option === "B" && (
        <>
          <div className="w-full lg:hidden">
            <Bands />
          </div>
          <Accordion />
        </>
      )}
      {option === "C" && <ListAndPhoto />}
    </section>
  );
}

/* The section heading and line: centred over A and B, left-aligned over C's list. */
function Intro({ align = "center" }: { align?: "center" | "left" }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" ? "items-center text-center" : "items-start text-left",
      )}
    >
      <h2 id="services-title" className="text-heading-2 font-semibold text-ink">
        {services.title}
      </h2>
      <p
        className={cn(
          "text-body tracking-[0.5px] text-slate",
          align === "center" ? "max-w-[43.625rem]" : "max-w-[34rem]",
        )}
      >
        {services.description}
      </p>
    </div>
  );
}

/* A: wide photo bands, one under another. */
function Bands() {
  return (
    <ul className="flex w-full flex-col gap-3 sm:gap-5">
      {services.items.map((item) => (
        <li key={item.title}>
          <Link
            href={item.href}
            className="group relative isolate flex aspect-[4/5] flex-col items-center justify-end gap-2 overflow-hidden p-5 text-center text-white sm:aspect-[16/10] sm:gap-3 sm:p-8 lg:aspect-auto lg:h-[min(46rem,82svh)] lg:p-12"
          >
            <div className="absolute inset-0 -z-10 transition-transform duration-1000 ease-soft group-hover:scale-[1.03]">
              <ResponsiveImage asset={item.image} sizes="100vw" quality={85} fill />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-linear-to-t from-black/65 via-black/15 via-45% to-transparent"
            />
            <h3 className="text-heading-3 font-semibold">{item.title}</h3>
            <p className="max-w-[34rem] text-small tracking-[0.5px] text-white/85 sm:text-body">
              {item.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* B: one wide panel and two narrow ones; the hovered (or focused) panel opens. */
function Accordion() {
  const [open, setOpen] = useState(0);

  return (
    <ul className="hidden h-[min(40rem,72svh)] w-full gap-2 lg:flex">
      {services.items.map((item, index) => {
        const on = open === index;
        return (
          <li
            key={item.title}
            className={cn(
              "min-w-0 transition-[flex-grow] duration-700 ease-soft",
              on ? "grow-[4]" : "grow",
            )}
            style={{ flexBasis: 0 }}
          >
            <Link
              href={item.href}
              onMouseEnter={() => setOpen(index)}
              onFocus={() => setOpen(index)}
              className="group relative isolate flex h-full flex-col justify-end overflow-hidden p-8 text-white"
            >
              <div className="absolute inset-0 -z-10">
                <ResponsiveImage
                  asset={item.image}
                  sizes="(min-width: 1024px) 66vw, 1px"
                  quality={85}
                  fill
                  parallax={false}
                />
              </div>
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 -z-10 bg-linear-to-t to-transparent transition-colors duration-700",
                  on ? "from-black/65 via-black/15 via-45%" : "from-black/70 via-black/40",
                )}
              />
              <div className="flex items-end justify-between gap-6">
                <div className="flex min-w-0 flex-col">
                  <h3 className="text-heading-3 font-semibold whitespace-nowrap">{item.title}</h3>
                  {/* Collapsed panels fold the description away, so every title sits on one line. */}
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-soft",
                      on ? "grid-rows-[1fr] opacity-100 delay-150" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <p className="max-w-[30rem] overflow-hidden pt-3 text-body tracking-[0.5px] text-white/85">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-[4px] border border-white transition-[opacity,background-color,color] duration-500",
                    on ? "opacity-100 group-hover:bg-white group-hover:text-ink" : "opacity-0",
                  )}
                >
                  <Icon name="arrow-right" size={20} />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/*
 * C: a numbered list beside one tall photo. On desktop the section pins while it is scrolled
 * through, one screen per service: a thin vertical loader beside each row fills as you scroll,
 * and when it is full the next service takes over (title, description and photo), so every
 * service is seen before the page moves on. Phones and reduced motion show the plain list.
 */
function ListAndPhoto() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const count = services.items.length;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(Math.min(count - 1, Math.floor(progress * count)));
  });

  return (
    <div
      ref={trackRef}
      className={cn("w-full", !reduceMotion && "lg:h-[calc(var(--rows)*100svh)]")}
      style={{ "--rows": count } as CSSProperties}
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-[90.5rem] gap-stack lg:grid-cols-12 lg:gap-16",
          !reduceMotion && "lg:sticky lg:top-0 lg:h-svh lg:content-center",
        )}
      >
        <div className="flex flex-col gap-8 lg:col-span-6 lg:self-center">
          <Intro align="left" />
          <ul className="border-t border-ink/15">
            {services.items.map((item, index) => {
              const on = active === index;
              return (
                <li key={item.title} className="relative border-b border-ink/15">
                  {/* This row's share of the scroll: full once it has been passed. */}
                  <Loader progress={scrollYProgress} index={index} count={count} />
                  <Link
                    href={item.href}
                    // Without the pinned scroll (reduced motion), pointing at a row picks it.
                    onMouseEnter={reduceMotion ? () => setActive(index) : undefined}
                    onFocus={() => setActive(index)}
                    className="group flex flex-col gap-4 py-6 sm:py-7 lg:pl-6"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden lg:hidden">
                      <ResponsiveImage asset={item.image} sizes="100vw" fill parallax={false} />
                    </span>
                    <span className="flex items-start gap-5 sm:gap-8">
                      <span className="pt-1 text-small font-medium tracking-[1px] text-slate tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex flex-1 flex-col gap-2">
                        <span
                          className={cn(
                            "text-heading-3 font-semibold transition-colors duration-500 ease-soft",
                            on ? "text-ink" : "text-ink lg:text-ink/35",
                          )}
                        >
                          {item.title}
                        </span>
                        <span
                          className={cn(
                            "grid transition-[grid-template-rows,opacity] duration-500 ease-soft",
                            on
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0",
                          )}
                        >
                          <span className="overflow-hidden">
                            <span className="block max-w-[30rem] text-small tracking-[0.5px] text-slate sm:text-body">
                              {item.description}
                            </span>
                          </span>
                        </span>
                      </span>
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center self-center rounded-[4px] border transition-colors duration-300",
                          on
                            ? "border-ink bg-ink text-white"
                            : "border-ink/20 text-ink group-hover:border-ink",
                        )}
                      >
                        <Icon name="arrow-right" size={18} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative hidden overflow-hidden lg:col-span-6 lg:block lg:h-[min(44rem,80svh)]">
          {services.items.map((item, index) => (
            <div
              key={item.title}
              aria-hidden={active !== index}
              className={cn(
                "absolute inset-0 transition-[opacity,scale] duration-700 ease-soft",
                active === index ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
              )}
            >
              <ResponsiveImage
                asset={item.image}
                sizes="(min-width: 1024px) 45vw, 1px"
                quality={85}
                fill
                parallax={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* A 2px vertical track on the row's left edge that fills top to bottom with its part of the scroll. */
function Loader({
  progress,
  index,
  count,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
}) {
  const fill = useTransform(progress, (value) => Math.min(1, Math.max(0, value * count - index)));
  return (
    <span aria-hidden className="absolute top-0 bottom-0 left-0 hidden w-[2px] bg-ink/10 lg:block">
      <motion.span style={{ scaleY: fill }} className="block size-full origin-top bg-ink" />
    </span>
  );
}
