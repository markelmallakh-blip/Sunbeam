"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { ProjectCard } from "@/content/homepage";
import { Icon } from "@/components/ui/Icon";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { cn } from "@/lib/cn";

/*
 * Figma "our work carousel" (101:1839): 477px cards 8px apart, bleeding off the right edge, with
 * white 42px arrow buttons over the photos on desktop. The previous arrow only appears once there
 * is something to go back to (it is hidden in the Figma default state). Phones and tablets drop
 * the arrows: cards are 80% wide so the next one peeks in, and the row is swiped.
 */
export function ProjectsCarousel({ items }: { items: ProjectCard[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      start: track.scrollLeft <= 4,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.offsetWidth + 8), behavior: "smooth" });
  };

  return (
    // Whole cards only, edge to edge within the page margins: two on phones and tablets, three on
    // desktop. No card is cut off; the rest scroll in.
    <div className="relative w-full">
      <ul
        ref={trackRef}
        onScroll={update}
        data-lenis-prevent-horizontal
        className="flex snap-x snap-mandatory [scrollbar-width:none] gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li
            key={item.title}
            className="w-[calc((100%-0.5rem)/2)] shrink-0 snap-start lg:w-[calc((100%-1rem)/3)]"
          >
            <Link href={item.href} className="group flex flex-col gap-2.5 sm:gap-4">
              <div className="relative aspect-[477/620] overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-1000 ease-soft group-hover:scale-[1.04]">
                  <ResponsiveImage
                    asset={item.image}
                    sizes="(min-width: 1024px) 32vw, 50vw"
                    fill
                    parallax={false}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <p className="flex flex-wrap items-center gap-2 text-[0.625rem] font-medium tracking-[0.5px] text-slate sm:text-caption">
                  {/* Two cards share a phone's width, so there only the first tag shows. */}
                  {item.tags.map((tag, index) => (
                    <Fragment key={tag}>
                      {index > 0 && (
                        <span
                          aria-hidden
                          className="size-[3px] rounded-full bg-slate max-sm:hidden"
                        />
                      )}
                      <span className={cn(index > 0 && "max-sm:hidden")}>{tag}</span>
                    </Fragment>
                  ))}
                </p>
                <h3 className="text-[0.9375rem] leading-tight font-semibold text-ink sm:text-heading-4">
                  {item.title}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Same height as a card photo, so the arrows sit on its vertical centre. */}
      {/* Desktop only: touch screens swipe. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block lg:h-[calc((100vw-2*var(--spacing-edge)-1rem)/3*620/477)]">
        {(["prev", "next"] as const).map((direction) => {
          const hidden = direction === "prev" ? edges.start : edges.end;
          return (
            <button
              key={direction}
              type="button"
              aria-label={direction === "prev" ? "Previous projects" : "Next projects"}
              onClick={() => step(direction === "prev" ? -1 : 1)}
              tabIndex={hidden ? -1 : 0}
              className={cn(
                "pointer-events-auto absolute top-1/2 grid size-[2.625rem] -translate-y-1/2 place-items-center rounded-[4px] bg-white text-ink transition-opacity duration-300 hover:bg-mist",
                direction === "prev" ? "left-3" : "right-3",
                hidden && "pointer-events-none opacity-0",
              )}
            >
              <Icon name={direction === "prev" ? "arrow-left" : "arrow-right"} size={28} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
