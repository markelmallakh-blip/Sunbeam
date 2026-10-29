"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import type { ImageAsset } from "@/types/media";
import { Icon } from "@/components/ui/Icon";
import { smoothScroll } from "@/lib/smooth-scroll";
import { duration, easeSoft } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* `wide` is an alternative landscape crop shown here in place of the grid's file (GalleryImage). */
type LightboxImage = ImageAsset & { wide?: ImageAsset };

type LightboxProps = {
  images: LightboxImage[];
  /** Index of the photo on show; null keeps the lightbox closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

/* A horizontal swipe longer than this (px) moves to the next or previous photo. */
const SWIPE = 48;

/*
 * Photos slide across the stage in the direction of travel: the next one comes in from the right
 * as the current one leaves to the left, both on the soft ease, with a slight fade at the edges.
 * Reduced motion crossfades instead.
 */
const SLIDE = { duration: 0.8, ease: easeSoft };
const slide: Variants = {
  enter: ({ direction, still }: Travel) =>
    still ? { opacity: 0 } : { x: `${direction * 100}%`, opacity: 0.4 },
  centre: { x: "0%", opacity: 1 },
  exit: ({ direction, still }: Travel) =>
    still ? { opacity: 0 } : { x: `${direction * -100}%`, opacity: 0.4 },
};
type Travel = { direction: 1 | -1; still: boolean };

/*
 * Figma "Full preview" (169:4223): a black full-screen viewer with the photo fitted above a strip
 * of 156 × 127 thumbnails (the current one outlined in white), white 38px arrow buttons on either
 * side and a close button top right. Arrow keys and swipes step through; Escape closes. Page
 * scrolling pauses while it is open.
 */
export function Lightbox({ images, index, onIndexChange }: LightboxProps) {
  const open = index !== null;
  const count = images.length;
  const stripRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const travel: Travel = { direction, still: Boolean(useReducedMotion()) };

  const go = useCallback(
    (next: number, towards: 1 | -1) => {
      setDirection(towards);
      onIndexChange(next);
    },
    [onIndexChange],
  );
  const step = useCallback(
    (delta: 1 | -1) => {
      if (index === null) return;
      go((index + delta + count) % count, delta);
    },
    [index, count, go],
  );
  const close = useCallback(() => onIndexChange(null), [onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const lenis = smoothScroll.get();
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close, step]);

  // Keep the current thumbnail in view as the photos change.
  useEffect(() => {
    if (index === null) return;
    stripRef.current
      ?.querySelector<HTMLElement>(`[data-thumb="${index}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);

  const onTouchStart = (event: TouchEvent) => {
    touchX.current = event.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchX.current;
    const end = event.changedTouches[0]?.clientX;
    touchX.current = null;
    if (start === null || end === undefined || Math.abs(end - start) < SWIPE) return;
    step(end < start ? 1 : -1);
  };

  if (typeof document === "undefined") return null;
  const picked = index === null ? null : images[index];
  // Fixed stage height; each photo's own shape sets its width, so wide crops show landscape.
  const current = picked ? (picked.wide ?? picked) : null;

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${count}`}
          data-lenis-prevent
          className="fixed inset-0 z-[60] flex flex-col gap-6 bg-black p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easeSoft }}
        >
          <div
            className="relative min-h-0 flex-1 overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence initial={false} custom={travel}>
              <motion.div
                key={current.src}
                className="absolute inset-0"
                custom={travel}
                variants={slide}
                initial="enter"
                animate="centre"
                exit="exit"
                transition={SLIDE}
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  quality={85}
                  priority
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
            {/* Load the neighbours ahead of time so a photo never slides in blank. */}
            <div aria-hidden className="invisible absolute inset-0">
              {[index - 1, index + 1].map((near) => {
                const neighbour = images[(near + count) % count];
                const image = neighbour?.wide ?? neighbour;
                return image && image.src !== current.src ? (
                  <Image
                    key={near}
                    src={image.src}
                    alt=""
                    fill
                    sizes="100vw"
                    quality={85}
                    loading="eager"
                    className="object-contain"
                  />
                ) : null;
              })}
            </div>
          </div>

          {count > 1 && (
            <div
              ref={stripRef}
              className="flex h-20 shrink-0 [scrollbar-width:none] gap-3 overflow-x-auto sm:h-[7.9375rem] [&::-webkit-scrollbar]:hidden"
            >
              {images.map((image, thumb) => (
                <button
                  key={image.src}
                  type="button"
                  data-thumb={thumb}
                  aria-label={`Show photo ${thumb + 1}`}
                  aria-current={thumb === index || undefined}
                  onClick={() =>
                    index !== null && thumb !== index && go(thumb, thumb > index ? 1 : -1)
                  }
                  className={cn(
                    "relative h-full w-24 shrink-0 overflow-hidden rounded-[2px] transition-opacity duration-300 sm:w-[9.75rem]",
                    thumb === index
                      ? "border-[1.5px] border-white"
                      : "opacity-60 hover:opacity-100",
                  )}
                >
                  <Image src={image.src} alt="" fill sizes="156px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

          <button
            ref={closeRef}
            type="button"
            aria-label="Close gallery"
            onClick={close}
            className="absolute top-8 right-8 flex size-[2.375rem] items-center justify-center rounded-[2px] bg-white text-ink transition-colors duration-300 hover:bg-mist sm:top-12 sm:right-12"
          >
            <Icon name="close" size={16} />
          </button>

          {count > 1 && (
            <div className="pointer-events-none absolute inset-x-4 top-[calc(50%-2.5rem)] hidden -translate-y-1/2 justify-between sm:flex">
              {(
                [
                  ["arrow-left", -1, "Previous photo"],
                  ["arrow-right", 1, "Next photo"],
                ] as const
              ).map(([icon, delta, label]) => (
                <button
                  key={icon}
                  type="button"
                  aria-label={label}
                  onClick={() => step(delta)}
                  className="pointer-events-auto flex size-[2.375rem] items-center justify-center rounded-[2px] bg-white text-ink transition-colors duration-300 hover:bg-mist"
                >
                  <Icon name={icon} size={22} />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
