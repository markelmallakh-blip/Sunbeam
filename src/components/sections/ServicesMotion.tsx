"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Services scroll choreography (GSAP), after the iCAUR "Technology" section:
 * - `[data-services-head]` sits sticky behind the rows and recedes (scale down + blur) as the
 *   first row sweeps over it.
 * - Every `[data-tilt]` image starts tilted by its `data-tilt` degrees and eases to straight
 *   as it reaches the middle of the screen.
 * Reduced motion keeps the resting tilt and a sharp, static headline.
 */
export function ServicesMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const mm = gsap.matchMedia(element);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to("[data-services-head]", {
        scale: 0.82,
        filter: "blur(8px)",
        opacity: 0.55,
        ease: "power1.out",
        scrollTrigger: { trigger: element, start: "top top", end: "+=100%", scrub: 0.6 },
      });

      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((image) => {
        gsap.fromTo(
          image,
          { rotate: Number(image.dataset.tilt) || 0, scale: 0.9, y: 60 },
          {
            rotate: 0,
            scale: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: { trigger: image, start: "top bottom", end: "center center", scrub: 1 },
          },
        );
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
