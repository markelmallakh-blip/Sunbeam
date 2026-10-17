"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/content/home";
import type { ProjectDetail } from "@/content/projects";
import { primaryCta } from "@/config/navigation";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/animations/Reveal";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { ProjectTags } from "./ProjectTags";

const HEADER = 71; // compact sticky header height, px
const EXPANDED = { width: 1262, share: 0.835 }; // Figma expanded card: 1262px of a 1512px frame

/*
 * Figma project "Header" (70:4022, variants hero → expanded), after 2authenticators.co. The photo
 * sits across the top of a pinned Grey 1 panel — the same grey as the sections that follow — and
 * stays put behind the whole hero while the white project card scrolls up over it. The card
 * starts with its first block (down to "Get in touch") just in view; on desktop
 * the card opens out from the compact size to the expanded one as it rises (width and padding
 * scrubbed to the scroll), revealing the brief, two photos and the key numbers. The photo settles
 * from a slight zoom and dims a touch behind the card. Phones show the open card under the photo.
 */
export function ProjectHero({ project, detail }: { project: Project; detail: ProjectDetail }) {
  const ref = useRef<HTMLElement>(null);
  const { brief } = detail;

  useGsap(({ reduceMotion }) => {
    const mm = gsap.matchMedia(ref.current ?? undefined);
    mm.add("(min-width: 1024px)", () => {
      const card = ref.current?.querySelector<HTMLElement>("[data-card]");
      const head = card?.querySelector<HTMLElement>("[data-head]");
      const lift = card?.parentElement;
      if (!card || !head || !lift) return;
      // Start the card low enough that its first block (logo → "Get in touch") ends exactly at
      // the bottom of the screen, whatever the window height.
      const place = () => {
        // Measured in page coordinates, so anything above the hero (the announcement bar) counts.
        const current = parseFloat(getComputedStyle(lift).paddingTop);
        const padding = parseFloat(getComputedStyle(card).paddingBottom);
        const bottom = head.getBoundingClientRect().bottom + window.scrollY;
        const next = current + (window.innerHeight - padding) - bottom;
        lift.style.paddingTop = `${Math.max(HEADER + 120, next)}px`;
      };
      place();
      window.addEventListener("resize", place);
      const openWidth = () => Math.min(EXPANDED.width, window.innerWidth * EXPANDED.share);
      if (reduceMotion) {
        gsap.set(card, { width: openWidth(), padding: 60 });
        return () => window.removeEventListener("resize", place);
      }
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            endTrigger: card,
            end: `top top+=${HEADER + 40}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .to(card, { width: openWidth, padding: 60, ease: "power2.inOut" }, 0)
        .fromTo("[data-photo]", { scale: 1.08 }, { scale: 1 }, 0)
        .fromTo("[data-dim]", { opacity: 0 }, { opacity: 1 }, 0);
      return () => {
        window.removeEventListener("resize", place);
        lift.style.paddingTop = "";
      };
    });
    return () => mm.revert();
  }, ref);

  return (
    <section ref={ref} aria-labelledby="project-title" className="relative bg-stone">
      {/* Pinned on desktop: a Grey 1 panel with the photo across its top (Figma 1440:810). Its
          track spans the whole hero, so the panel stops exactly where the hero ends (overflow:
          clip, unlike hidden, keeps sticky working). */}
      <div className="lg:absolute lg:inset-0 lg:overflow-clip">
        <div className="lg:sticky lg:top-0 lg:h-svh lg:bg-stone">
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[1440/810]">
            <div data-photo className="absolute inset-0">
              <ResponsiveImage asset={detail.hero} sizes="100vw" priority parallax={false} fill />
            </div>
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-ink/45 to-transparent"
            />
            <div data-dim aria-hidden className="absolute inset-0 bg-ink/25 opacity-0" />
          </div>
        </div>
      </div>

      <div className="relative px-gutter lg:px-0 lg:pt-[52svh]">
        <article
          data-card
          className="relative z-[1] -mt-16 flex flex-col items-center gap-10 bg-white px-6 py-8 sm:px-10 sm:py-10 lg:mt-0 lg:ml-auto lg:w-[43.625rem] lg:gap-[3.75rem] lg:p-8 lg:pr-[3.75rem]"
        >
          <div data-head className="flex w-full flex-col items-start gap-6">
            <Image
              src={detail.logo.src}
              alt={detail.logo.alt}
              width={detail.logo.width}
              height={detail.logo.height}
              sizes="120px"
              priority
              className="h-[5.75rem] w-auto object-contain object-bottom"
            />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 id="project-title" className="font-display text-h3 leading-[1.3]">
                  {project.title}
                </h1>
                <ProjectTags tags={detail.tags} />
              </div>
              <p className="max-w-[61.25rem] text-body leading-[1.3] text-slate">
                {detail.summary}
              </p>
            </div>
            <Button href={primaryCta.href} variant="light">
              Get in touch
            </Button>
          </div>

          <hr className="w-full border-rule" />

          <Reveal className="flex w-full flex-col gap-4">
            <h2 className="font-display text-quote leading-[1.3]">{brief.title}</h2>
            <p className="max-w-[61.25rem] text-subtitle leading-[1.3] text-slate">{brief.text}</p>
          </Reveal>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-[1.98fr_1fr]">
            {brief.images.map((image, index) => (
              <Reveal
                key={image.src}
                delay={index * 0.1}
                className="relative aspect-[761/345] overflow-hidden sm:aspect-auto sm:h-[21.5625rem]"
              >
                <ResponsiveImage
                  asset={image}
                  sizes={
                    index ? "(min-width: 1024px) 24vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"
                  }
                  fill
                />
              </Reveal>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-6 sm:flex sm:justify-end sm:gap-[6.25rem]">
            {brief.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-2">
                <dt className="text-small text-slate">{stat.label}</dt>
                <dd className="font-display text-h2 leading-[1.2] text-rust">
                  <CountUp
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    pad={stat.pad}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  );
}
