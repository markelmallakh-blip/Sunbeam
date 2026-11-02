"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ImageAsset } from "@/types/media";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { cn } from "@/lib/cn";

/*
 * A full-bleed photo band with no text over it. The photo sits in a taller layer that drifts
 * against the scroll, so it moves slower than the page (parallax); reduced motion keeps it still.
 */
export function ParallaxBanner({
  asset,
  label,
  priority = false,
  frameClassName = "aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-[min(50rem,82svh)]",
}: {
  asset: ImageAsset;
  /** Names the band for screen readers. */
  label: string;
  priority?: boolean;
  /** The band's shape at each breakpoint. */
  frameClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <section ref={ref} aria-label={label} className="bg-white">
      <div className={cn("relative w-full overflow-hidden", frameClassName)}>
        <motion.div
          style={reduceMotion ? undefined : { y }}
          className="absolute inset-x-0 -top-[12%] h-[124%]"
        >
          <ResponsiveImage asset={asset} sizes="100vw" fill priority={priority} parallax={false} />
        </motion.div>
      </div>
    </section>
  );
}
