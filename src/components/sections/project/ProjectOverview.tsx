import Image from "next/image";
import type { ImageAsset } from "@/types/media";
import type { ProjectDetail } from "@/content/projects";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/animations/Reveal";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { cn } from "@/lib/cn";
import { DetailBento } from "./DetailBento";

/* Figma "Project Overview" (61:822): two photos and a statement, then the detail bento. */
export function ProjectOverview({ overview }: { overview: ProjectDetail["overview"] }) {
  const [interior, exterior] = overview.images;
  const { pieces } = overview;

  return (
    <section aria-labelledby="overview-statement" className="bg-stone py-20 text-ink">
      <Container className="flex flex-col gap-[3.75rem]">
        <div className="grid gap-6 lg:grid-cols-[1fr_36.7rem]">
          <Reveal className="relative aspect-[768/779] overflow-hidden lg:aspect-auto lg:h-[min(48.7rem,calc(100svh-4.4375rem-4rem))]">
            <ResponsiveImage asset={interior} sizes="(min-width: 1024px) 52vw, 100vw" fill />
          </Reveal>
          <div className="flex flex-col gap-10 lg:gap-[3.75rem]">
            <Reveal delay={0.1} className="relative aspect-[587/527] overflow-hidden">
              <ResponsiveImage asset={exterior} sizes="(min-width: 1024px) 39vw, 100vw" fill />
            </Reveal>
            <Reveal delay={0.2}>
              <p id="overview-statement" className="max-w-[37.5rem] font-display text-h4">
                {overview.statement}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Fits the screen below the header on desktop; rows keep the Figma proportions. */}
        <DetailBento className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:h-[min(50rem,calc(100svh-4.4375rem-3rem))]">
          <div className="grid grid-cols-1 gap-4 lg:grid-rows-[1.76fr_1fr]">
            <Piece image={pieces.oak} className="aspect-[448/500] lg:aspect-auto" fit="h-[87.6%]" />
            <Palette colors={overview.palette} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-rows-[1.42fr_1fr_1.42fr]">
            <Piece
              image={pieces.planter}
              className="aspect-[448/284] lg:aspect-auto"
              fit="h-[82%]"
            />
            <div className="grid place-items-center py-6 lg:py-0">
              <h2
                data-write
                data-split="off"
                className="max-w-[25.5rem] text-center font-display text-display"
              >
                {overview.detailTitle}
              </h2>
            </div>
            <Piece
              image={pieces.pendant}
              className="aspect-[448/284] lg:aspect-auto"
              fit="h-[95%]"
              blend
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-rows-[1.76fr_1fr]">
            <Piece
              image={pieces.table}
              className="aspect-[448/500] lg:aspect-auto"
              fit="h-[97%]"
              blend
            />
            <Piece
              image={pieces.sage}
              className="aspect-[448/284] lg:aspect-auto"
              fit="h-[84.7%]"
            />
          </div>
        </DetailBento>
      </Container>
    </section>
  );
}

/* A product cut-out on a tinted tile (DetailBento animates it in). */
function Piece({
  image,
  className,
  fit,
  blend = false,
}: {
  image: ImageAsset;
  className?: string;
  /** Height of the product inside its tile, as in Figma. */
  fit: string;
  /** White-background shot: multiply it so the white takes the tile colour. */
  blend?: boolean;
}) {
  return (
    <div data-tile className={cn("relative overflow-hidden bg-[#d6d5d3]", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 768px) 30vw, 90vw"
        className={cn(
          "absolute inset-0 m-auto w-auto max-w-[92%] object-contain",
          fit,
          blend && "mix-blend-multiply",
        )}
      />
    </div>
  );
}

/* Material palette: plain colour bands (names are for screen readers only). */
function Palette({ colors }: { colors: ProjectDetail["overview"]["palette"] }) {
  return (
    <ul aria-label="Material palette" className="flex h-[17.75rem] lg:h-auto">
      {colors.map((color) => (
        <li key={color.hex} data-swatch style={{ backgroundColor: color.hex }} className="flex-1">
          <span className="sr-only">{color.name}</span>
        </li>
      ))}
    </ul>
  );
}
