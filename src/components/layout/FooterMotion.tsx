"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";

/*
 * Footer entrance. As the footer scrolls in, its blocks (`[data-footer-item]`) rise into place
 * one after another; as the wordmark (`[data-footer-logo]`) reaches the screen its letters rise
 * out of the bottom edge from left to right. Both reverse when you scroll back up and play again
 * on the way down. The footer lives in the layout, so both reset on every navigation.
 */
export function FooterMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const timelines = useRef<gsap.core.Timeline[]>([]);
  const pathname = usePathname();

  useGsap(({ reduceMotion }) => {
    const footer = ref.current;
    if (reduceMotion || !footer) return;

    const items = gsap.timeline({
      scrollTrigger: { trigger: footer, start: "top 85%", toggleActions: "play none none reverse" },
    });
    items.from("[data-footer-item]", {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08,
    });

    const logo = footer.querySelector<SVGSVGElement>("[data-footer-logo] svg");
    const letters = logo
      ? Array.from(logo.querySelectorAll<SVGPathElement>("path")).sort(
          (a, b) => a.getBBox().x - b.getBBox().x,
        )
      : [];
    const height = logo?.viewBox.baseVal.height ?? 60;
    const wordmark = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-footer-logo]",
        start: "top 98%",
        toggleActions: "play none none reverse",
      },
    });
    wordmark.from(letters, {
      y: height * 1.05, // SVG user units: one full logo height, below the clipped edge
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.05,
    });

    timelines.current = [items, wordmark];
    return () => {
      timelines.current = [];
    };
  }, ref);

  // A new page starts above the footer: rewind so the entrance plays again on arrival.
  useEffect(() => {
    timelines.current.forEach((timeline) => timeline.pause(0));
  }, [pathname]);

  return (
    <footer ref={ref} id="footer" className={className}>
      {children}
    </footer>
  );
}
