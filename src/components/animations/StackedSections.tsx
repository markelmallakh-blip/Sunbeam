"use client";

import { Children, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

const HEADER = 71; // compact sticky header height, px
const HOLD = "40svh"; // scroll spent resting on a panel before the next one slides in

/*
 * Sections that stack like cards: each one sticks once its bottom reaches the bottom of the
 * screen (or just below the header when it is shorter than the screen), holds there for a while
 * (HOLD of scrolling) so it can be read in full, and then the next section slides up over it.
 * While it is being covered, the section behind eases back — its content scales down a little
 * inside a white backing (so nothing shows through around it) while the whole panel blurs and
 * dims — scrubbed to the scroll. Reduced motion keeps the plain stacking.
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
        const scrollTrigger = {
          trigger: next,
          start: "top bottom",
          end: `top top+=${HEADER}`,
          scrub: true,
        };
        gsap.fromTo(inner, { scale: 1 }, { scale: 0.92, ease: "none", scrollTrigger });
        gsap.fromTo(
          item,
          { filter: "blur(0px) brightness(1)" },
          { filter: "blur(5px) brightness(0.9)", ease: "none", scrollTrigger },
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
        <div
          key={index}
          data-stack
          className="sticky bg-white"
          style={{ zIndex: index + 1, top: HEADER, marginTop: index ? HOLD : undefined }}
        >
          <div className="origin-top">{panel}</div>
        </div>
      ))}
    </div>
  );
}
