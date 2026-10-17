"use client";

import { useRef, type ReactNode } from "react";
import { SplitText } from "gsap/SplitText";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";

gsap.registerPlugin(SplitText);

/*
 * Entrance for the "Our Art in Detail" bento. As it scrolls in, each `[data-tile]` wipes up into
 * view in turn while its product settles from a slight zoom, the palette bands rise one by one,
 * and the `[data-write]` heading writes itself in, letter by letter. Reduced motion shows it all.
 */
export function DetailBento({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(({ reduceMotion }) => {
    if (reduceMotion || !ref.current) return;
    const root = ref.current;
    const title = root.querySelector<HTMLElement>("[data-write]");
    const split = title ? SplitText.create(title, { type: "words,chars" }) : null;

    const timeline = gsap.timeline({
      defaults: { ease: "expo.out" },
      scrollTrigger: {
        trigger: root,
        start: "top 75%",
        end: "bottom top",
        toggleActions: "play reset play reset",
      },
    });
    timeline
      .from("[data-tile]", {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.1,
        stagger: 0.12,
      })
      .from("[data-tile] img", { scale: 1.18, yPercent: 8, duration: 1.4, stagger: 0.12 }, 0)
      .from(
        "[data-swatch]",
        { scaleY: 0, transformOrigin: "50% 100%", duration: 0.9, stagger: 0.08 },
        0.25,
      );
    if (split) {
      timeline.from(
        split.chars,
        {
          opacity: 0,
          yPercent: 30,
          rotate: -6,
          filter: "blur(6px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.045,
        },
        0.35,
      );
    }
    return () => split?.revert();
  }, ref);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
