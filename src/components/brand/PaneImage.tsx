"use client";

import { useRef } from "react";
import type { ImageAsset } from "@/types/media";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { windowPanePolygon } from "@/lib/window-shape";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { cn } from "@/lib/cn";

type PaneImageProps = {
  image: ImageAsset;
  /** Window pane whose outline the image rests in. */
  pane: number;
  /** Pane outline it morphs from while scrolling into view. */
  from: number;
  sizes: string;
  className?: string;
};

/*
 * A photo cropped to one window-pane outline. As it scrolls up into view the crop eases from
 * another pane's outline into its own (scrubbed). Reduced motion shows the resting outline.
 */
export function PaneImage({ image, pane, from, sizes, className }: PaneImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rest = windowPanePolygon(pane);

  useGsap(
    ({ reduceMotion }) => {
      if (reduceMotion) return;
      gsap.fromTo(
        ref.current,
        { clipPath: windowPanePolygon(from) },
        {
          clipPath: rest,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "center 55%",
            scrub: 0.8,
          },
        },
      );
    },
    ref,
    [from, rest],
  );

  return (
    <div ref={ref} className={cn("relative", className)} style={{ clipPath: rest }}>
      <ResponsiveImage asset={image} sizes={sizes} fill />
    </div>
  );
}
