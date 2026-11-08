import type { Service } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { ProjectsCarousel } from "@/components/sections/ProjectsCarousel";
import { InViewFigure } from "./InViewFigure";
import { PageIntro } from "./PageIntro";

/*
 * Single service page sections, in the homepage's minimal style: centred copy, one large photo,
 * the scope as a numbered list on Gray 1, two detail photos and a carousel of related projects.
 */

export function ServiceHero({ service }: { service: Service }) {
  return (
    <section
      aria-labelledby="service-title"
      className="flex flex-col items-center gap-5 px-edge pt-block sm:gap-stack"
    >
      <PageIntro
        id="service-title"
        eyebrow={service.eyebrow}
        title={service.title}
        intro={service.intro}
      >
        <Button href="/contact" variant="outline-dark">
          Start your project
        </Button>
      </PageIntro>
      <div className="relative aspect-square w-full overflow-hidden sm:aspect-[1448/700]">
        <ResponsiveImage
          asset={service.hero}
          sizes="100vw"
          quality={85}
          fill
          priority
          parallax={false}
        />
      </div>
    </section>
  );
}

export function ServiceStatement({ service }: { service: Service }) {
  return (
    <section className="flex justify-center px-edge py-block">
      <p className="max-w-[56rem] text-center text-body-xl font-medium tracking-[0.5px] text-ink">
        {service.statement.lead}
        {service.statement.muted}
      </p>
    </section>
  );
}

/*
 * The scope as a numbered list, after an editorial index: a large light number, a short rule,
 * then the item's title and a line of description. No images, one calm column.
 */
export function ServiceIncluded({ service }: { service: Service }) {
  return (
    <section
      aria-labelledby="included-title"
      className="flex flex-col items-center gap-10 bg-mist px-edge py-block sm:gap-16 sm:py-[clamp(3.5rem,2.5rem+2.6vw,7.5rem)]"
    >
      <h2 id="included-title" className="text-heading-4 font-semibold text-ink">
        {service.included.title}
      </h2>
      <ol className="flex w-full max-w-[52rem] flex-col">
        {service.included.items.map((item, index) => (
          <li
            key={item.title}
            className="grid grid-cols-[2.5rem_1fr] items-start gap-x-4 border-t border-hairline py-5 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[4.5rem_3rem_1fr] sm:gap-x-6 sm:py-7"
          >
            <span className="text-heading-3 leading-none font-light text-silver">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="mt-5 hidden h-px bg-ash sm:block" />
            <div className="flex flex-col gap-1 sm:gap-2">
              <h3 className="text-heading-6 font-semibold text-ink">{item.title}</h3>
              <p className="text-small tracking-[0.5px] text-slate sm:text-body">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/*
 * Photos two to a row, framed by a top gutter equal to the side ones. On wider screens they are
 * 4:3, so a whole row fits in the window rather than one photo running past it. On hover a photo
 * zooms in slightly and the kind of project it comes from shows in a small white tag.
 */
export function ServiceDetails({ service }: { service: Service }) {
  return (
    <section aria-label="Service details" className="grid gap-2 px-edge pt-edge md:grid-cols-2">
      {service.details.map((asset) => (
        <InViewFigure key={asset.src} className="group relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-700 ease-soft group-hover:scale-[1.04]">
            <ResponsiveImage
              asset={asset}
              sizes="(min-width: 768px) 50vw, 100vw"
              fill
              parallax={false}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-700 ease-soft group-hover:bg-black/60 max-md:group-data-inview:bg-black/60"
          />
          <figcaption className="pointer-events-none absolute inset-0 grid place-items-center">
            {/* The white tag opens out from its centre, then the word rises into it. */}
            <span className="overflow-hidden bg-white px-4 py-2 transition-[clip-path] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:inset(0_50%_0_50%)] group-hover:duration-700 group-hover:[clip-path:inset(0_0%_0_0%)] max-md:group-data-inview:duration-700 max-md:group-data-inview:[clip-path:inset(0_0%_0_0%)]">
              <span className="block translate-y-[115%] text-caption font-medium tracking-[1px] text-ink uppercase transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:delay-150 group-hover:duration-700 max-md:group-data-inview:translate-y-0 max-md:group-data-inview:delay-150 max-md:group-data-inview:duration-700 sm:text-small">
                {asset.label}
              </span>
            </span>
          </figcaption>
        </InViewFigure>
      ))}
    </section>
  );
}

/* Related work in the homepage project carousel, with arrows to move through it. */
export function ServiceProjects({ service }: { service: Service }) {
  return (
    <section
      aria-labelledby="related-title"
      className="flex flex-col items-center gap-stack overflow-hidden px-edge py-block"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 id="related-title" className="text-heading-4 font-semibold text-ink">
          Related Projects
        </h2>
        <p className="text-body tracking-[0.5px] text-slate">
          A few spaces where this service shaped the result.
        </p>
      </div>
      <ProjectsCarousel items={service.projects} />
      <Button href="/projects" variant="outline-dark">
        View all projects
      </Button>
    </section>
  );
}
