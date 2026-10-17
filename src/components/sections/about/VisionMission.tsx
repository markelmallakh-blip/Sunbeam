import type { visionMission } from "@/content/about";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/animations/Reveal";
import { PaneImage } from "@/components/brand/PaneImage";
import { cn } from "@/lib/cn";

type Band = (typeof visionMission)[number];

/* Resting pane outlines match the Figma shapes (Vectors 26 and 25); `from` is where each morph starts. */
const SHAPES = [
  { pane: 10, from: 18 },
  { pane: 3, from: 8 },
];

/* One band of Figma "Vision & Mission" (67:1342): photos in window-pane shapes beside the copy. */
export function VisionMissionBand({ band, index }: { band: Band; index: number }) {
  const reversed = index % 2 === 1;
  const id = `${band.title.toLowerCase().replace(/\s+/g, "-")}-title`;
  return (
    <section
      aria-labelledby={id}
      className={cn("py-section text-ink", reversed ? "bg-stone" : "bg-white")}
    >
      <Container
        className={cn(
          "flex flex-col gap-12 lg:items-center lg:justify-between lg:gap-10",
          reversed ? "lg:flex-row-reverse" : "lg:flex-row",
        )}
      >
        <div className="flex items-start justify-end gap-4 sm:gap-6">
          {band.images.map((image, imageIndex) => {
            const shape = SHAPES[imageIndex];
            if (!image || !shape) return null;
            return (
              <PaneImage
                key={image.src}
                image={image}
                pane={shape.pane}
                from={shape.from}
                sizes="(min-width: 1024px) 21vw, 55vw"
                className={
                  imageIndex === 0
                    ? "aspect-[327/331] w-[57%] sm:w-[20.4375rem]"
                    : "aspect-[220/223] w-[38%] sm:w-[13.75rem]"
                }
              />
            );
          })}
        </div>
        <Reveal className="flex flex-col gap-6 lg:w-[43.2rem] lg:gap-8">
          <h2 id={id} className="font-display text-h3 leading-[1.3]">
            {band.title}
          </h2>
          <p className="text-subtitle leading-[1.3] lg:max-w-[44.625rem]">{band.text}</p>
        </Reveal>
      </Container>
    </section>
  );
}
