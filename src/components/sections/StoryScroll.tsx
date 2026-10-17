"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Scroll-scrubbed Story animation (desktop): while the sticky image pair travels down the
 * section, the lead text inks in word by word and every `[data-shapes]` image eases through
 * its sequence of window-pane outlines (JSON array of `clip-path` polygons). The sequence ends
 * as the images settle beside the video teaser at the bottom of the section.
 * Phones and reduced motion keep the first shape with fully inked text.
 */
export function StoryScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const mm = gsap.matchMedia(element);

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const masks = gsap.utils.toArray<HTMLElement>("[data-shapes]");
      const sticky = element.querySelector<HTMLElement>("[data-sticky]");
      const steps = Math.max(...masks.map((mask) => parseShapes(mask).length - 1), 1);
      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: element,
          start: "top top+=71", // below the compact sticky header
          // Finish exactly when the sticky images come to rest beside the video teaser.
          end: () => {
            const top = sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0;
            return `bottom top+=${top + (sticky?.offsetHeight ?? 0)}`;
          },
          invalidateOnRefresh: true,
          scrub: 0.8,
        },
      });

      timeline.fromTo(
        "[data-word]",
        { opacity: 0.45 },
        { opacity: 1, ease: "none", stagger: 0.04, duration: steps * 0.5 },
        0,
      );
      masks.forEach((mask) => {
        parseShapes(mask)
          .slice(1)
          .forEach((shape, step) => timeline.to(mask, { clipPath: shape, duration: 1 }, step));
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function parseShapes(element: HTMLElement): string[] {
  try {
    const shapes: unknown = JSON.parse(element.dataset.shapes ?? "[]");
    return Array.isArray(shapes) ? shapes.filter((shape) => typeof shape === "string") : [];
  } catch {
    return [];
  }
}
