import { story } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma "Categories" (90:1872): the studio statement on the left — its second half in Gray 6 —
 * beside the founder's portrait (756:928), 32px from every edge.
 */
export function Story() {
  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="flex scroll-mt-header flex-col gap-stack bg-white px-edge py-block lg:flex-row lg:items-stretch"
    >
      <div className="flex flex-1 flex-col items-start justify-center gap-8">
        <h2 id="story-title" className="text-heading-5 font-semibold text-ink">
          {story.title}
        </h2>
        <p className="max-w-[41.5rem] text-body-xl font-medium tracking-[0.5px] text-ink">
          {story.lead}
          <span className="text-ash">{story.leadMuted}</span>
        </p>
        <Button href={story.cta.href} variant="light">
          {story.cta.label}
        </Button>
      </div>
      <div className="relative aspect-[756/928] w-full overflow-hidden lg:w-[46.5%] lg:max-w-[44rem]">
        <ResponsiveImage asset={story.image} sizes="(min-width: 1024px) 46vw, 100vw" fill />
      </div>
    </section>
  );
}
