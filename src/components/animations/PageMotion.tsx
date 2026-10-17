"use client";

import { useEffect } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger } from "@/lib/gsap";

gsap.registerPlugin(SplitText);

/*
 * Text that must keep its own markup or motion: sliders, dialogs, forms, the inked letter, and
 * anything inside a GSAP-pinned section (`.pin-spacer`), whose own timeline choreographs it.
 */
const SKIP = '[data-split="off"], [role="region"], dialog, form, .sr-only, .pin-spacer';

/*
 * Page-wide scroll motion. Render it once at the end of each page: being part of the page, it
 * runs only after that page has hydrated, so GSAP never touches markup React is still matching.
 * - Photos with `data-parallax` (filled ResponsiveImage frames) drift inside their frames.
 * - Elements with `data-speed` drift against the scroll (0.9 = slightly slower, 1.1 = faster).
 * - Headings rise line by line out of a mask as they enter; longer paragraphs follow softly.
 *   Entrances replay on every visit: they reset once fully off screen and play again on return.
 * Opt a block out with `data-split="off"`. Everything is skipped for reduced motion.
 */
export function PageMotion() {
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("img[data-parallax]", main).forEach((image) => {
        gsap.fromTo(
          image,
          { yPercent: -6, scale: 1.14 },
          {
            yPercent: 6,
            scale: 1.14,
            ease: "none",
            scrollTrigger: {
              trigger: image.parentElement ?? image,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-speed]", main).forEach((element) => {
        const speed = Number(element.dataset.speed) || 1;
        gsap.fromTo(
          element,
          { y: () => (speed - 1) * window.innerHeight * 0.5 },
          {
            y: () => (1 - speed) * window.innerHeight * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      const headings = gsap.utils
        .toArray<HTMLElement>("h1, h2, [data-split]", main)
        .filter((element) => element.dataset.split !== "off" && !element.closest(SKIP));
      headings.forEach((heading) => {
        splits.push(
          SplitText.create(heading, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.09,
                scrollTrigger: {
                  trigger: heading,
                  start: "top 88%",
                  end: "bottom top",
                  toggleActions: "play reset play reset",
                },
              }),
          }),
        );
      });

      const paragraphs = gsap.utils
        .toArray<HTMLElement>("section p", main)
        .filter(
          (paragraph) =>
            (paragraph.textContent?.trim().length ?? 0) > 60 &&
            !paragraph.closest(SKIP) &&
            !paragraph.closest("h1, h2"),
        );
      paragraphs.forEach((paragraph) => {
        splits.push(
          SplitText.create(paragraph, {
            type: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                y: 18,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.06,
                scrollTrigger: {
                  trigger: paragraph,
                  start: "top 90%",
                  end: "bottom top",
                  toggleActions: "play reset play reset",
                },
              }),
          }),
        );
      });
    });

    // Fonts and late images shift the layout; measure again once they have settled.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      window.clearTimeout(refresh);
      splits.forEach((split) => split.revert());
      mm.revert();
    };
  }, []);

  return null;
}
