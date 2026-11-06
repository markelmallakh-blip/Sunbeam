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
}: {
  image: ImageAsset;
  index: number;
  total: number;
  onOpen: Open;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1} of ${total}: ${image.alt}`}
      className={cn("group relative block cursor-zoom-in overflow-hidden bg-mist", className)}
    >
      <Image
        src={image.src}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-1000 ease-soft group-hover:scale-[1.03]"
      />
    </button>
  );
}

/*
 * Figma "Row 2" (169:4189): a large photo beside two stacked ones, then three in a row. `offset`
 * is the index of the first photo in the whole gallery, so each tile opens the right one.
 */
function Rows({ images, total, onOpen }: { images: ImageAsset[]; total: number; onOpen: Open }) {
  const blocks: ImageAsset[][] = [];
  for (let i = 0; i < images.length; i += 3) blocks.push(images.slice(i, i + 3));
  const tile = (image: ImageAsset, index: number, className: string) => (
    <Tile
      key={image.src}
      image={image}
      index={index}
      total={total}
      onOpen={onOpen}
      className={className}
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
              {/* Phones set the pair side by side, so the gallery stays short. */}
              <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:grid-rows-2">
                {tile(second, base + 1, "aspect-square sm:aspect-[720/289] md:aspect-auto")}
                {tile(third, base + 2, "aspect-square sm:aspect-[720/289] md:aspect-auto")}
              </div>
            </div>
          );
        }
        return (
          <div key={blockIndex} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {block.map((image, i) =>
              tile(
                image,
                base + i,
                block.length % 2 === 1 && i === 0
                  ? "col-span-2 aspect-[477/289] sm:col-span-1"
                  : "aspect-square sm:aspect-[477/289]",
              ),
            )}
          </div>
        );
      })}
    </div>
  );
}

/*
 * Figma "Design Details" gallery, "Show more" layout (the "Gallery Collapsed / Expanded" frames,
 * 174:3050 and 174:3262). The first six photos show with the last row fading into black under a
 * white "Show more (+N)"; expanded, every photo shows and "Show less" stays pinned to the bottom
 * of the screen while the gallery is in view. Every photo opens the full-screen Lightbox
 * (169:4223).
 */
export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const [expanded, setExpanded] = useState(false);
  const [viewing, setViewing] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const listId = useId();
  const extra = images.length - SHOWN;
  const canExpand = extra > 0;
  const showAll = expanded || !canExpand;

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
      className="flex scroll-mt-24 flex-col items-center gap-8 bg-mist px-edge py-block"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-small font-medium tracking-[1px] text-slate uppercase">
          {projectDetailCopy.galleryEyebrow}
        </p>
        <h2 id="gallery-title" className="text-heading-3 font-semibold text-ink">
          {projectDetailCopy.galleryTitle}
        </h2>
      </div>

      <div id={listId} className="relative w-full">
        <Rows
          images={showAll ? images : images.slice(0, SHOWN)}
          total={images.length}
          onOpen={setViewing}
        />

        {canExpand && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[15rem] items-end justify-center bg-linear-to-b from-black/0 via-black/60 via-55% to-black/90 pb-8">
            <Button
              variant="white"
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

        {canExpand && expanded && (
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
