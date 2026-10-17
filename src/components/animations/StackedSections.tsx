"use client";

import { Children, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

const HEADER = 71; // compact sticky header height, px

/*
 * Sections that stack like cards: each one sticks once its bottom reaches the bottom of the
 * screen (or just below the header when it is shorter than the screen), and the next section
 * slides up over it. While it is being covered, the section behind eases back — scaling down a
 * little, blurring and dimming — scrubbed to the scroll. Reduced motion keeps the plain stacking.
 */
export function StackedSections({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const panels = Children.toArray(children);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(":scope > [data-stack]"));

    // Stick when the panel's bottom meets the bottom of the screen, never above the header.
    const place = () => {
      items.forEach((item) => {
        item.style.top = `${Math.min(HEADER, window.innerHeight - item.offsetHeight)}px`;
      });
    };
    place();
    const observer = new ResizeObserver(place);
    items.forEach((item) => observer.observe(item));
    window.addEventListener("resize", place);

    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      items.slice(0, -1).forEach((item, index) => {
        const next = items[index + 1];
        const inner = item.firstElementChild;
        if (!next || !inner) return;
        gsap.fromTo(
          inner,
          { scale: 1, filter: "blur(0px) brightness(1)" },
          {
            scale: 0.92,
            filter: "blur(5px) brightness(0.9)",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: `top top+=${HEADER}`,
              scrub: true,
            },
          },
        );
      });
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
      mm.revert();
    };
  }, [panels.length]);

  return (
    <div ref={ref}>
      {panels.map((panel, index) => (
        <div key={index} data-stack className="sticky" style={{ zIndex: index + 1, top: HEADER }}>
          <div
            className={
              index ? "origin-top shadow-[0_-24px_48px_-28px_rgb(44_41_41/0.35)]" : "origin-top"
            }
          >
            {panel}
          </div>
        </div>
      ))}
    </div>
  );
}
