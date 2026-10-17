"use client";

import { useRef } from "react";
import { ourStory } from "@/content/about";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { Video } from "@/components/media/Video";
import { CursorDisc } from "@/components/ui/CursorDisc";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StoryVideoDialog } from "@/components/sections/StoryVideoDialog";

const HEADER = 71; // compact sticky header height, px

/*
 * Figma "Our Story" (67:1282, variants Default ↔ Variant2). On desktop the section pins below the
 * header and scrolling opens the inset film out to full bleed while the divider grows to full
 * width. Phones and reduced motion show the inset frame above the copy. A click opens the film.
 */
export function StoryFilm() {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ reduceMotion }) => {
    if (reduceMotion) return;
    const mm = gsap.matchMedia(ref.current ?? undefined);
    mm.add("(min-width: 1024px)", () => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ref.current,
            start: `top top+=${HEADER}`,
            end: "+=110%",
            pin: true,
            scrub: 0.8,
          },
        })
        .to("[data-frame]", { clipPath: "inset(0% 0%)", ease: "power2.inOut" }, 0)
        .to("[data-shade]", { opacity: 1 }, 0)
        .to("[data-rule]", { width: "100%", ease: "power2.inOut" }, 0);
    });
    return () => mm.revert();
  }, ref);

  return (
    <section
      ref={ref}
      aria-labelledby="our-story-title"
      className="relative overflow-hidden bg-ink py-section-sm text-white lg:flex lg:h-[calc(100svh-4.4375rem)] lg:min-h-[38rem] lg:flex-col lg:py-0"
    >
      <div className="relative z-[1] mx-auto w-full max-w-site px-gutter lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-[3.75rem]">
        <Eyebrow className="text-stone">{ourStory.eyebrow}</Eyebrow>
      </div>

      {/* Hover area: the frame on phones, the whole section on desktop (Figma makes it one button). */}
      <CursorDisc
        className="mx-gutter mt-8 aspect-[1072/696] lg:absolute lg:inset-0 lg:m-0 lg:aspect-auto"
        disc={
          <span className="flex items-center gap-1.5">
            <Icon name="play" size={16} />
            Play
          </span>
        }
      >
        <div
          data-frame
          className="absolute inset-0 overflow-hidden lg:[clip-path:inset(14.56%_14.55%)]"
        >
          <Video asset={ourStory.loop} autoPlay fill />
          <div data-shade aria-hidden className="absolute inset-0 bg-ink/35 opacity-0" />
        </div>
        <StoryVideoDialog
          video={ourStory.film}
          label={ourStory.filmLabel}
          triggerClassName="absolute inset-0 grid size-full place-items-center"
        >
          {/* Touch screens get no cursor disc, so they see a static one. */}
          <span className="grid size-16 place-items-center rounded-full bg-ink/70 text-white backdrop-blur-sm [@media(pointer:fine)]:hidden">
            <Icon name="play" size={22} />
          </span>
        </StoryVideoDialog>
      </CursorDisc>

      <div className="relative mx-auto flex w-full max-w-site flex-col px-gutter pt-10 lg:pointer-events-none lg:h-full lg:justify-end lg:pt-0 lg:pb-[30svh]">
        <div className="flex flex-col gap-10 lg:items-center lg:gap-[4.5rem]">
          <span data-rule aria-hidden className="hidden h-px w-[3.75rem] bg-white/60 lg:block" />
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2
              id="our-story-title"
              className="font-display text-h3 leading-[1.3] lg:max-w-[41.9rem]"
            >
              {ourStory.title}
            </h2>
            <p className="text-subtitle leading-[1.3] lg:max-w-[28.625rem]">{ourStory.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
