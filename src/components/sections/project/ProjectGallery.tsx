"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ProjectDetail } from "@/content/projects";
import { duration, easeSoft } from "@/lib/motion";
import { CursorDisc } from "@/components/ui/CursorDisc";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { SliderProgress } from "@/components/ui/SliderProgress";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

const GAP = 16;

/*
 * Figma "Material Palette" / Design Details (61:862): a left-aligned row of photos that runs off
 * the right edge. Drag (or swipe) it, use the arrows or the arrow keys; the line below fills as
 * the row travels. Steps snap to whole photos.
 */
export function ProjectGallery({ gallery }: { gallery: ProjectDetail["gallery"] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const [limit, setLimit] = useState(0);
  const [step, setStep] = useState(0);
  const reduceMotion = useReducedMotion();
  const progress = useTransform(x, (value) =>
    limit ? 0.18 + 0.82 * Math.min(1, Math.max(0, -value / limit)) : 1,
  );

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!viewport || !track || !first) return;
      const nextLimit = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setLimit(nextLimit);
      setStep(first.offsetWidth + GAP);
      if (-x.get() > nextLimit) x.set(-nextLimit);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [x]);

  const go = useCallback(
    (direction: number) => {
      const target = Math.round(-x.get() / step + direction) * step;
      animate(
        x,
        -Math.min(limit, Math.max(0, target)),
        reduceMotion ? { duration: 0 } : { duration: duration.base, ease: easeSoft },
      );
    },
    [x, step, limit, reduceMotion],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  return (
    <section aria-labelledby="gallery-title" className="overflow-hidden bg-white py-20 text-ink">
      <div className="mx-auto flex max-w-site flex-col gap-[3.75rem] px-gutter">
        <div className="flex flex-col items-center gap-2 text-center">
          <Eyebrow className="text-slate">{gallery.eyebrow}</Eyebrow>
          <h2 id="gallery-title" className="font-display text-h3 leading-[1.3]">
            {gallery.title}
          </h2>
        </div>

        <CursorDisc
          ref={viewportRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={gallery.title}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="touch-pan-y select-none"
          disc={
            <span className="flex items-center gap-1.5">
              <Icon name="arrow-left" size={14} strokeWidth={2} />
              Drag
              <Icon name="arrow-right" size={14} strokeWidth={2} />
            </span>
          }
        >
          <motion.ul
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -limit, right: 0 }}
            dragElastic={0.08}
            dragTransition={{ power: 0.25, timeConstant: 260 }}
            style={{ x, gap: GAP }}
            className="flex w-max"
          >
            {gallery.images.map((image, index) => (
              <li
                key={image.src}
                className="relative aspect-[448/469] w-[72vw] shrink-0 overflow-hidden sm:w-[22rem] lg:w-[28rem]"
              >
                <ResponsiveImage
                  asset={image}
                  sizes="(min-width: 1024px) 448px, (min-width: 640px) 352px, 72vw"
                  parallax={false}
                  fill
                  className="pointer-events-none"
                />
                <span className="sr-only">
                  Photo {index + 1} of {gallery.images.length}
                </span>
              </li>
            ))}
          </motion.ul>
        </CursorDisc>

        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="grid size-8 place-items-center transition-colors hover:text-rust"
          >
            <Icon name="arrow-left" size={20} />
          </button>
          <SliderProgress progress={progress} className="w-36" />
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="grid size-8 place-items-center transition-colors hover:text-rust"
          >
            <Icon name="arrow-right" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
