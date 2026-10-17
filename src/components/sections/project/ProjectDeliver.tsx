import type { ProjectDetail } from "@/content/projects";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/animations/Reveal";
import { PaneImage } from "@/components/brand/PaneImage";
import { cn } from "@/lib/cn";

/*
 * Figma "Gallery" / What We Deliver (61:848): service rows alternating copy and photo. On
 * desktop the copy stays pinned beside its photo while it scrolls past, and each photo opens
 * out of a window-pane outline.
 */
export function ProjectDeliver({ deliver }: { deliver: ProjectDetail["deliver"] }) {
  return (
    <section aria-labelledby="deliver-title" className="bg-linen py-section text-ink">
      <Container className="flex flex-col gap-[3.75rem]">
        <Reveal>
          <h2 id="deliver-title" className="text-center font-display text-h3 leading-[1.3]">
            {deliver.title}
          </h2>
        </Reveal>
        <div className="flex flex-col gap-12 lg:gap-6">
          {deliver.items.map((item, index) => (
            <article
              key={item.title}
              className={cn(
                "flex flex-col gap-6 lg:items-start lg:gap-8",
                index % 2 ? "lg:flex-row-reverse" : "lg:flex-row",
              )}
            >
              <Reveal className="flex flex-col gap-2 lg:sticky lg:top-[4.4375rem] lg:w-[37rem] lg:shrink-0 lg:py-[3.75rem]">
                <h3
                  className={cn("font-display leading-[1.3]", index ? "text-quote" : "text-title")}
                >
                  {item.title}
                </h3>
                <p className="text-subtitle leading-[1.3]">{item.text}</p>
              </Reveal>
              {/* Eases from a slanted window pane into the full frame (pane 0) as it scrolls in. */}
              <PaneImage
                image={item.image}
                pane={0}
                from={index % 2 ? 18 : 13}
                sizes="(min-width: 1024px) 51vw, 100vw"
                className="aspect-[767/652] overflow-hidden lg:flex-1"
              />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
