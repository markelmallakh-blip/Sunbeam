"use client";

import { useRef } from "react";
import type { ProjectDetail } from "@/content/projects";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { Icon } from "@/components/ui/Icon";

const HEADER = 71; // compact sticky header height, px

/*
 * Figma "Feedback" (78:2279 ↔ 78:2281): a full-bleed photo with a small white "Client Feedback"
 * card. On desktop the section pins and scrolling opens the card into the full testimonial —
 * the card grows to fit its content (quote and client always fit), then the quote and the
 * client fade up into it. Phones and reduced motion show
 * the open card.
 */
export function ProjectFeedback({ feedback }: { feedback: ProjectDetail["feedback"] }) {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ reduceMotion }) => {
    if (reduceMotion) return;
    const mm = gsap.matchMedia(ref.current ?? undefined);
    mm.add("(min-width: 1024px)", () => {
      const card = ref.current?.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      // Closed size = the title block alone (Figma Variant2, 240px tall).
      const head = card.querySelector<HTMLElement>("[data-head]");
      const closedWidth = () => (head?.offsetWidth ?? 170) + 160;
      gsap
        .timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ref.current,
            start: `top top+=${HEADER}`,
            end: "+=90%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .from(card, { width: closedWidth, height: 240, duration: 1 })
        .from("[data-body]", { opacity: 0, y: 24, duration: 0.45, ease: "power2.out" }, 0.6);
    });
    return () => mm.revert();
  }, ref);

  return (
    <section
      ref={ref}
      aria-label="Client feedback"
      className="relative flex items-center justify-center overflow-hidden px-gutter py-16 lg:min-h-[calc(100svh-4.4375rem)] lg:py-12"
    >
      <ResponsiveImage asset={feedback.image} sizes="100vw" parallax={false} fill />
      <figure
        data-card
        className="relative flex w-full max-w-[64rem] flex-col items-center gap-10 overflow-hidden bg-white px-6 pt-12 pb-12 text-center text-ink sm:px-20 sm:pt-20 sm:pb-16"
      >
        <div data-head className="flex w-max shrink-0 flex-col items-center gap-8">
          <Icon name="quote" size={38} className="text-rust" />
          <figcaption className="font-display text-quote">Client Feedback</figcaption>
        </div>
        <div
          data-body
          className="flex w-full max-w-[50.25rem] shrink-0 flex-col items-center gap-10 lg:w-[50.25rem] lg:max-w-none"
        >
          <blockquote className="font-display text-h4">{feedback.quote}</blockquote>
          <p className="flex flex-col gap-1">
            <span className="text-small">{feedback.name}</span>
            <span className="text-caption text-slate">{feedback.project}</span>
          </p>
        </div>
      </figure>
    </section>
  );
}
