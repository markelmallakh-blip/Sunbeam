"use client";

import { useId, useRef } from "react";
import type { ImageAsset } from "@/types/media";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { WINDOW_COLUMNS, WINDOW_ROWS, WINDOW_VIEWBOX, windowCells } from "@/lib/window-shape";

type WindowMosaicProps = {
  /** Should be pre-sized close to the rendered size (it is drawn inside SVG, not by next/image). */
  image: ImageAsset;
  className?: string;
};

/*
 * A photo seen through every pane of the window shape (Figma "Union", 67:1205). When it scrolls
 * into view the panes open one after another in a diagonal sweep from the top-left corner.
 * Reduced motion shows the finished mosaic.
 */
export function WindowMosaic({ image, className }: WindowMosaicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const maskId = `window-mosaic-${useId().replace(/:/g, "")}`;

  useGsap(({ reduceMotion }) => {
    if (reduceMotion || !ref.current) return;
    const panes = ref.current.querySelectorAll("[data-pane]");
    const photo = ref.current.querySelector("[data-photo]");
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          end: "bottom top",
          toggleActions: "play reset play reset",
        },
      })
      .from(panes, {
        scale: 0,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: { grid: [WINDOW_ROWS, WINDOW_COLUMNS], from: "start", amount: 0.9 },
      })
      .from(photo, { scale: 1.15, duration: 2, ease: "expo.out" }, 0);
  }, ref);

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox={`0 0 ${WINDOW_VIEWBOX.width} ${WINDOW_VIEWBOX.height}`}
        role="img"
        aria-label={image.alt}
        className="block h-auto w-full overflow-visible"
      >
        <defs>
          <mask id={maskId}>
            {windowCells.map((cell, index) => (
              <path
                key={index}
                d={cell.d}
                data-pane={index}
                fill="white"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <image
            data-photo
            href={image.src}
            width={WINDOW_VIEWBOX.width}
            height={WINDOW_VIEWBOX.height}
            preserveAspectRatio="xMidYMid slice"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        </g>
      </svg>
    </div>
  );
}
