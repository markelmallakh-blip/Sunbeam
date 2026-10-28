"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { ImageAsset } from "@/types/media";
import { projectDetailCopy, type GalleryImage } from "@/content/projects";
import { Button } from "@/components/ui/Button";
import { Lightbox } from "@/components/media/Lightbox";
import { Icon } from "@/components/ui/Icon";
import { smoothScroll } from "@/lib/smooth-scroll";
import { cn } from "@/lib/cn";

const SHOWN = 6;
/* Space kept above the gallery when Show less scrolls back to it (the compact header plus air). */
const HEADER_GAP = 96;

type Open = (index: number) => void;

/* Every photo opens the full-screen viewer at its own position. */
function Tile({
  image,
  index,
  total,
  onOpen,
  className,
  more,
}: {
  image: ImageAsset;
  index: number;
  total: number;
  onOpen: Open;
  className?: string;
  /** Photos left beyond this tile: draws the "+N" cover from Figma's second layout. */
  more?: number;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={
        more ? `View all ${total} photos` : `Open photo ${index + 1} of ${total}: ${image.alt}`
      }
      className={cn("group relative block cursor-zoom-in overflow-hidden bg-mist", className)}
    >
      <Image
        src={image.src}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-1000 ease-soft group-hover:scale-[1.03]"
      />
      {more ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-white transition-colors duration-500 group-hover:bg-black/60">
          <span className="text-body-xl font-medium tracking-[0.5px]">+{more}</span>
          <span className="text-small font-medium tracking-[1px] uppercase">
            {more === 1 ? "Photo" : "Photos"}
          </span>
        </span>
      ) : null}
    </button>
  );
}

/*
 * Figma "Row 2" (169:4189): a large photo beside two stacked ones, then three in a row. `offset`
 * is the index of the first photo in the whole gallery, so each tile opens the right one.
 */
function Rows({
  images,
  total,
  onOpen,
  more,
}: {
  images: ImageAsset[];
  total: number;
  onOpen: Open;
  /** Count shown over the last tile instead of a Show more button. */
  more?: number;
}) {
  const blocks: ImageAsset[][] = [];
  for (let i = 0; i < images.length; i += 3) blocks.push(images.slice(i, i + 3));
  const last = images.length - 1;
  const tile = (image: ImageAsset, index: number, className: string) => (
    <Tile
      key={image.src}
      image={image}
      index={index}
      total={total}
      onOpen={onOpen}
      className={className}
      more={index === last ? more : undefined}
    />
  );
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, blockIndex) => {
        const base = blockIndex * 3;
        const [first, second, third] = block;
        if (blockIndex % 2 === 0 && first && second && third) {
          const mirrored = blockIndex % 4 === 2;
          return (
            <div key={blockIndex} className="grid gap-2 md:h-[36.625rem] md:grid-cols-2">
              {tile(first, base, cn("aspect-[720/586] md:aspect-auto", mirrored && "md:order-2"))}
              <div className="grid grid-rows-2 gap-2">
                {tile(second, base + 1, "aspect-[720/289] md:aspect-auto")}
                {tile(third, base + 2, "aspect-[720/289] md:aspect-auto")}
              </div>
            </div>
          );
        }
        return (
          <div key={blockIndex} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {block.map((image, i) => tile(image, base + i, "aspect-[477/289]"))}
          </div>
        );
      })}
    </div>
  );
}

type Layout = "expand" | "count";

const layouts: { key: Layout; label: string }[] = [
  { key: "expand", label: "Show more" },
  { key: "count", label: "Photo count" },
];

/*
 * Figma "Design Details" gallery, in two layouts that a temporary switch flips between so they can
 * be compared with the client:
 * - "Show more": the "Gallery Collapsed / Expanded" frames (174:3050, 174:3262). The first six
 *   photos show with the last row fading out under "Show more (+N)"; expanded, every photo shows
 *   and "Show less" stays pinned to the bottom of the screen while the gallery is in view.
 * - "Photo count": 169:4185. Only the first six photos show, and the last one carries a dark
 *   "+N" cover that opens the viewer there.
 * Either way, every photo opens the full-screen Lightbox (169:4223).
 */
export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const [layout, setLayout] = useState<Layout>("expand");
  const [expanded, setExpanded] = useState(false);
  const [viewing, setViewing] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const listId = useId();
  const extra = images.length - SHOWN;
  const canExpand = extra > 0;
  const showAll = layout === "expand" && (expanded || !canExpand);

  // Lenis drives scrolling, so native scrollIntoView is ignored. Once the extra rows are gone,
  // glide back up to the gallery, leaving room for the header that reappears on the way up.
  const collapse = () => {
    setExpanded(false);
    requestAnimationFrame(() => {
      const section = sectionRef.current;
      if (!section) return;
      smoothScroll.get()?.resize();
      smoothScroll.to(section.getBoundingClientRect().top + window.scrollY - HEADER_GAP);
    });
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="gallery-title"
      className="flex scroll-mt-24 flex-col items-center gap-8 px-edge py-block"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-small font-medium tracking-[1px] text-slate uppercase">
          {projectDetailCopy.galleryEyebrow}
        </p>
        <h2 id="gallery-title" className="text-heading-3 font-semibold text-ink">
          {projectDetailCopy.galleryTitle}
        </h2>
      </div>

      {canExpand && (
        // Temporary: compares the two gallery layouts. Remove once the client has chosen.
        <div
          role="group"
          aria-label="Gallery layout"
          className="-mt-2 flex gap-1 rounded-[4px] bg-mist p-1"
        >
          {layouts.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={layout === key}
              onClick={() => {
                setLayout(key);
                setExpanded(false);
              }}
              className={cn(
                "rounded-[2px] px-3 py-1.5 text-caption font-medium tracking-[1px] uppercase transition-colors duration-300",
                layout === key ? "bg-white text-ink" : "text-slate hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div id={listId} className="relative w-full">
        <Rows
          images={showAll ? images : images.slice(0, SHOWN)}
          total={images.length}
          onOpen={setViewing}
          more={layout === "count" && canExpand ? extra : undefined}
        />

        {layout === "expand" && canExpand && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[15rem] items-end justify-center bg-linear-to-b from-white/0 via-white/70 via-60% to-white pb-8">
            <Button
              variant="dark"
              icon="none"
              aria-expanded={false}
              aria-controls={listId}
              onClick={() => setExpanded(true)}
              className="pointer-events-auto"
            >
              <span className="flex items-center gap-2.5">
                {`${projectDetailCopy.showMore} (+${extra})`}
                <Icon name="plus" size={16} />
              </span>
            </Button>
          </div>
        )}

        {layout === "expand" && canExpand && expanded && (
          <div className="pointer-events-none sticky bottom-6 mt-6 flex justify-center">
            <Button
              variant="dark"
              icon="none"
              aria-expanded
              aria-controls={listId}
              onClick={collapse}
              className="pointer-events-auto shadow-[0_8px_24px_rgb(0_0_0/0.18)]"
            >
              <span className="flex items-center gap-2.5">
                {projectDetailCopy.showLess}
                <Icon name="minus" size={16} />
              </span>
            </Button>
          </div>
        )}
      </div>

      <Lightbox images={images} index={viewing} onIndexChange={setViewing} />
    </section>
  );
}
