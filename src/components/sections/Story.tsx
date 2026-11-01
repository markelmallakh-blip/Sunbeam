import { story } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma "Categories" (90:1872): a screen-tall section, the studio statement on the left in one
 * ink colour, and the founder's portrait filling the right half top to bottom,
 * 32px from every edge. It slides up over the pinned hero (see app/page.tsx). Below desktop the
 * portrait comes first and the centred statement follows it.
 */
export function Story() {
  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="relative z-10 flex scroll-mt-header flex-col gap-stack bg-white px-edge py-block lg:min-h-svh lg:flex-row lg:items-stretch lg:py-edge"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center sm:gap-8 lg:items-start lg:text-left">
        <h2 id="story-title" className="text-heading-5 font-semibold text-ink">
          {story.title}
        </h2>
        <p className="max-w-[56rem] text-body-xl font-medium tracking-[0.5px] text-ink">
          {story.text}
        </p>
        <Button href={story.cta.href} variant="outline-dark">
          {story.cta.label}
        </Button>
      </div>
      {/* Figma: 704 of 1448px wide (48.6%), the full height of the section. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden max-lg:order-first sm:aspect-[756/928] lg:aspect-auto lg:w-[48.6%]">
        <ResponsiveImage asset={story.image} sizes="(min-width: 1024px) 49vw, 100vw" fill />
      </div>
    </section>
  );
}
