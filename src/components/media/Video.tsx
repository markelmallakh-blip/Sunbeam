"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { VideoAsset } from "@/types/media";
import { cn } from "@/lib/cn";

export type VideoProps = {
  asset: VideoAsset;
  /** Background/ambient playback: muted, looped, inline, no controls. Disabled for reduced motion. */
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  /** Start loading immediately (above-the-fold). Otherwise the source attaches near the viewport. */
  priority?: boolean;
  fill?: boolean;
  className?: string;
};

export function Video({
  asset,
  autoPlay = false,
  loop = autoPlay,
  controls = !autoPlay,
  priority = false,
  fill = false,
  className,
}: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(priority);
  const reduceMotion = useReducedMotion();
  const shouldAutoPlay = autoPlay && !reduceMotion;

  useEffect(() => {
    const element = ref.current;
    if (inView || !element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !inView) return;
    if (shouldAutoPlay) {
      element.play().catch(() => {
        /* Autoplay can be blocked by the browser; the poster stays visible. */
      });
    } else {
      element.pause();
    }
  }, [inView, shouldAutoPlay]);

  return (
    <video
      ref={ref}
      aria-label={asset.label}
      poster={asset.poster}
      width={fill ? undefined : asset.width}
      height={fill ? undefined : asset.height}
      muted={autoPlay}
      loop={loop}
      controls={controls}
      playsInline
      preload={inView ? "metadata" : "none"}
      className={cn(fill ? "absolute inset-0 size-full object-cover" : "h-auto w-full", className)}
    >
      {inView && <source src={asset.src} type={asset.mimeType ?? "video/mp4"} />}
    </video>
  );
}
