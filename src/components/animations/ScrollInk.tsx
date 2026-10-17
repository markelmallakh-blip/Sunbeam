"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";

type ScrollInkProps = {
  children: ReactNode;
  className?: string;
};

/*
 * Text that inks in word by word as it scrolls up the screen. Wrap each word of the children in
 * an element with `data-ink` (see `inkWords` in lib/ink-words). Reduced motion keeps the text fully inked.
 */
export function ScrollInk({ children, className }: ScrollInkProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(({ reduceMotion }) => {
    if (reduceMotion) return;
    gsap.fromTo(
      "[data-ink]",
      { opacity: 0.22 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 62%", scrub: 0.6 },
      },
    );
  }, ref);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
