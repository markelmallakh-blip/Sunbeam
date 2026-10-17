"use client";

import { useRef } from "react";
import { values } from "@/content/about";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/*
 * Figma "Why Choose Sunbeam" (73:1457): a four-line heading with a tilted value tag on each line.
 * Words rise out of their line mask, then each tag drops in and settles at its tilt; while the
 * section crosses the screen the tags drift sideways a little. Reduced motion shows it at rest.
 */
export function Values() {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ reduceMotion }) => {
    if (reduceMotion) return;
    const tags = gsap.utils.toArray<HTMLElement>("[data-tag]");
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "[data-lines]",
          start: "top 80%",
          end: "bottom top",
          toggleActions: "play reset play reset",
        },
      })
      .from("[data-word]", { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.12 })
      .from(
        tags,
        {
          y: -24,
          scale: 0.7,
          opacity: 0,
          // Extra swing on top of the CSS tilt (`rotate` property), settling back to it.
          rotate: (index: number) => (index % 2 ? 14 : -14),
          duration: 0.9,
          ease: "back.out(2)",
          stagger: 0.12,
        },
        0.35,
      );
    tags.forEach((tag, index) => {
      gsap.fromTo(
        tag,
        { x: index % 2 ? -18 : 18 },
        {
          x: index % 2 ? 18 : -18,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  }, ref);

  return (
    <section
      ref={ref}
      aria-labelledby="values-title"
      className="overflow-hidden bg-stone py-20 text-ink"
    >
      <div className="mx-auto flex max-w-site flex-col items-center gap-[3.75rem] px-gutter">
        <p className="text-body font-semibold tracking-[0.0625rem] uppercase">{values.eyebrow}</p>
        <div data-lines className="flex flex-col items-center gap-0.5">
          <h2 id="values-title" className="sr-only">
            {values.lines.map((line) => line.word).join(" ")}
          </h2>
          {values.lines.map((line, index) => {
            const tilt = index % 2 ? "rotate-3" : "-rotate-3";
            return (
              <div
                key={line.word}
                aria-hidden
                className={cn(
                  "flex items-center gap-2 sm:gap-3",
                  line.side === "start" && "flex-row-reverse",
                )}
              >
                <span className="overflow-hidden pb-[0.06em] font-display text-mega">
                  <span data-word className="block">
                    {line.word}
                  </span>
                </span>
                <span
                  data-tag
                  className={cn(
                    "rounded-[2px] bg-white p-1.5 text-caption font-semibold whitespace-nowrap text-slate sm:p-2 sm:text-body",
                    tilt,
                  )}
                >
                  {line.tag}
                </span>
              </div>
            );
          })}
          <ul className="sr-only">
            {values.lines.map((line, index) => (
              <li key={index}>{line.tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
