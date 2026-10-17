"use client";

import { useMotionValue } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { FocusSlider } from "@/components/ui/FocusSlider";
import { SliderProgress } from "@/components/ui/SliderProgress";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { smoothScroll } from "@/lib/smooth-scroll";

/* Share of the pinned scroll spent resting on the first and last project before moving on. */
const HOLD = 0.08;
const BREATHING_ROOM = 32; // px kept below the progress line while pinned

/*
 * "Selected work" slider. On desktop the section pins and vertical scroll moves the slider
 * continuously from the first project to the last (Lenis keeps it smooth); a short hold at each
 * end lets the section settle before the next one scrolls in. Clicking a neighbour or the arrow
 * keys scroll the page to that project. Phones and reduced motion get the swipe slider.
 */
export function ProjectsSlider({
  children,
  count,
  startIndex = 0,
}: {
  children: ReactNode;
  count: number;
  /** Slide shown first (1 lets a neighbour show on the left too); travel runs from here to the end. */
  startIndex?: number;
}) {
  const span = Math.max(1, count - 1 - startIndex);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const position = useMotionValue(startIndex);
  const [scrollDriven, setScrollDriven] = useState(false);

  useLayoutEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      setScrollDriven(true);
      const slider = ref.current;
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        // Pin as soon as the carousel and its progress line are fully on screen: at the section
        // top when everything fits, otherwise only as far down as the line needs.
        start: () => {
          if (!slider) return "top top";
          const offset = slider.getBoundingClientRect().top - section.getBoundingClientRect().top;
          const sliderBottom = offset + slider.offsetHeight + BREATHING_ROOM;
          return `top+=${Math.max(0, sliderBottom - window.innerHeight)} top`;
        },
        invalidateOnRefresh: true,
        end: `+=${span * 55}%`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const travel = gsap.utils.clamp(0, 1, (self.progress - HOLD) / (1 - HOLD * 2));
          position.set(startIndex + travel * span);
        },
      });
      return () => {
        triggerRef.current = null;
        setScrollDriven(false);
      };
    });
    return () => mm.revert();
  }, [count, position, startIndex, span]);

  // The active project lines up with the section heading's left edge (inside the container).
  const alignToHeading = useCallback((viewport: HTMLElement) => {
    const container = viewport.closest("section")?.querySelector<HTMLElement>(".max-w-site");
    if (!container) return 0;
    const padding = parseFloat(getComputedStyle(container).paddingLeft) || 0;
    return container.getBoundingClientRect().left + padding - viewport.getBoundingClientRect().left;
  }, []);

  const onRequestIndex = useCallback(
    (next: number) => {
      const trigger = triggerRef.current;
      if (!trigger || count < 2) return;
      const step = gsap.utils.clamp(0, 1, (next - startIndex) / span);
      const progress = HOLD + step * (1 - HOLD * 2);
      smoothScroll.to(trigger.start + progress * (trigger.end - trigger.start));
    },
    [count, startIndex, span],
  );

  return (
    <div ref={ref}>
      <FocusSlider
        label="Selected projects"
        position={scrollDriven ? position : undefined}
        onRequestIndex={onRequestIndex}
        alignTo={alignToHeading}
        initialIndex={startIndex}
        slideClassName="w-[85vw] sm:w-[34rem] lg:w-[min(64.125rem,calc((100svh-12.5rem)*2.1))]"
        controls={({ progress }) => (
          <SliderProgress progress={progress} className="mx-auto w-full max-w-[31.75rem]" />
        )}
      >
        {children}
      </FocusSlider>
    </div>
  );
}
