import type { CSSProperties } from "react";
import { story } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { Video } from "@/components/media/Video";
import { Container } from "@/components/layout/Container";
import { windowPanePolygon } from "@/lib/window-shape";
import { StoryScroll } from "./StoryScroll";
import { StoryVideoDialog } from "./StoryVideoDialog";

/* Window-pane outlines each image eases through while the section is pinned (first = resting shape). */
const TEAM_SHAPES = [2, 15, 23, 19].map(windowPanePolygon);
const LIGHTING_SHAPES = [14, 6, 26, 28].map(windowPanePolygon);

const maskProps = (shapes: string[]) => ({
  "data-shapes": JSON.stringify(shapes),
  style: { clipPath: shapes[0] } satisfies CSSProperties,
});

export function Story() {
  const [teamImage, lightingImage] = story.images;
  const { teaser } = story;
  const words = story.lead.split(" ");

  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="scroll-mt-header bg-white text-ink"
    >
      <Container className="pt-section-sm pb-24 lg:pb-36">
        <StoryScroll className="grid gap-12 lg:grid-cols-[36.25rem_1fr] lg:gap-x-3">
          {/* Copy at the top, video teaser at the bottom; the gap between them is the sticky travel. */}
          <div className="flex flex-col items-start justify-between gap-12 lg:min-h-[150svh]">
            <div className="flex flex-col items-start gap-8 lg:pt-20">
              <h2 id="story-title" className="font-display text-title">
                {story.title}
              </h2>
              <p className="max-w-[36rem] text-lead">
                {words.map((word, index) => (
                  <span key={`${word}-${index}`} data-word>
                    {word}
                    {index < words.length - 1 && " "}
                  </span>
                ))}
              </p>
              <Button href={story.cta.href} variant="light">
                {story.cta.label}
              </Button>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative aspect-[480/310] w-40 shrink-0 overflow-hidden bg-stone sm:w-[12.4375rem]">
                <Video asset={teaser.loop} autoPlay fill />
              </div>
              <div className="flex flex-col items-start gap-3">
                <p className="max-w-[11.5rem] text-small text-slate">{teaser.text}</p>
                <StoryVideoDialog video={teaser.film} label={teaser.label} />
              </div>
            </div>
          </div>

          {/* Sticky image pair: rides down the section and stops level with the video teaser. */}
          <div className="order-first lg:order-none">
            <div
              data-sticky
              className="flex items-start gap-4 lg:sticky lg:top-[calc(4.4375rem+2.5rem)] lg:gap-6"
            >
              {teamImage && (
                <div
                  className="relative mt-6 aspect-[360/291] w-[44%] shrink-0"
                  {...maskProps(TEAM_SHAPES)}
                >
                  <ResponsiveImage asset={teamImage} sizes="(min-width: 1024px) 24vw, 44vw" fill />
                </div>
              )}
              {lightingImage && (
                <div className="relative aspect-[419/424] flex-1" {...maskProps(LIGHTING_SHAPES)}>
                  <ResponsiveImage
                    asset={lightingImage}
                    sizes="(min-width: 1024px) 28vw, 52vw"
                    fill
                  />
                </div>
              )}
            </div>
          </div>
        </StoryScroll>
      </Container>
    </section>
  );
}
