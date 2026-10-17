"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { hero } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RollText } from "@/components/ui/RollText";
import { Video } from "@/components/media/Video";
import { Container } from "@/components/layout/Container";
import { useGsap } from "@/hooks/useGsap";
import { gsap, SplitText } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { duration, easeSoft, gsapEaseSoft } from "@/lib/motion";

/*
 * Full-bleed video hero. Each tab owns a slide: its white line fills over `slideDuration`
 * seconds, then the next slide's film crossfades in. Clicking a tab switches straight away and
 * restarts its timer. Reduced motion keeps the poster frames and switches only on click.
 */
export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const slide = hero.slides[active] ?? hero.slides[0];
  const next = () => setActive((value) => (value + 1) % hero.slides.length);

  /*
   * Intro sequence (GSAP timeline), straight after hydration: eyebrow, then the headline line by
   * line out of a mask (first line first), then CTA and tabs. The headline opts out of the
   * page-wide reveal (data-split="off") so only this animation runs on it.
   */
  useGsap(({ reduceMotion: reduce }) => {
    if (reduce) return;
    const title = scope.current?.querySelector<HTMLElement>("[data-hero-title]");
    const split = title
      ? SplitText.create(title, { type: "lines", mask: "lines", linesClass: "split-line" })
      : null;
    gsap
      .timeline({ defaults: { ease: gsapEaseSoft, duration: duration.slow } })
      .from("[data-hero-media]", { scale: 1.08, duration: 2.2, ease: "power2.out" }, 0)
      .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 16 }, 0.05)
      .from(split?.lines ?? [], { yPercent: 110, stagger: 0.12 }, 0.15)
      .from("[data-hero-fade]", { autoAlpha: 0, y: 16, stagger: 0.1 }, 0.5);
    return () => split?.revert();
  }, scope);

  return (
    <section
      ref={scope}
      aria-labelledby="hero-title"
      className="relative isolate flex h-[calc(100svh-1.5rem)] max-h-[60rem] min-h-[40rem] items-end overflow-hidden bg-ink text-white"
    >
      <div data-hero-media className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.slow, ease: easeSoft }}
          >
            {slide && <Video asset={slide.media} autoPlay priority fill />}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-black/30" />
      </div>

      <Container className="flex flex-col gap-10 pb-12 lg:flex-row lg:items-end lg:justify-between lg:pb-14">
        <div className="flex flex-col items-start gap-4">
          <div data-hero-eyebrow>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </div>
          <h1 id="hero-title" data-split="off" className="pb-[0.08em] font-display text-display">
            <span data-hero-title className="block max-w-[9.2em] text-balance">
              {hero.title}
            </span>
          </h1>
          <div data-hero-fade className="mt-4">
            <Button href={hero.cta.href} variant="light">
              {hero.cta.label}
            </Button>
          </div>
        </div>

        <div
          data-hero-fade
          role="tablist"
          aria-label="Project type"
          className="flex gap-4 lg:w-[23.25rem]"
        >
          {hero.slides.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(index)}
                className={cn(
                  "group/roll flex flex-1 flex-col items-start gap-4 text-left text-subtitle transition-opacity duration-300",
                  selected ? "opacity-100" : "opacity-70 hover:opacity-100",
                )}
              >
                <span
                  aria-hidden
                  className="relative block h-px w-full overflow-hidden bg-white/35"
                >
                  {selected && (
                    <motion.span
                      key={`${active}-${item.label}`}
                      className="absolute inset-0 origin-left bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: reduceMotion ? 0 : hero.slideDuration,
                        ease: "linear",
                      }}
                      onAnimationComplete={() => {
                        if (!reduceMotion) next();
                      }}
                    />
                  )}
                </span>
                <RollText>{item.label}</RollText>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
