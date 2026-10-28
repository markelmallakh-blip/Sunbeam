import type { Service } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { ProjectsCarousel } from "@/components/sections/ProjectsCarousel";
import { PageIntro } from "./PageIntro";

/*
 * Single service page sections, in the homepage's minimal style: centred copy, one large photo,
 * the scope as a numbered list on Gray 1, two detail photos and a carousel of related projects.
 */

export function ServiceHero({ service }: { service: Service }) {
  return (
    <section
      aria-labelledby="service-title"
      className="flex flex-col items-center gap-stack px-edge pt-block"
    >
      <PageIntro
        id="service-title"
        eyebrow={service.eyebrow}
        title={service.title}
        intro={service.intro}
      >
        <Button href="/contact" variant="light">
          Start your project
        </Button>
      </PageIntro>
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[1448/700]">
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
      className="flex flex-col items-center gap-16 bg-mist px-edge py-[clamp(5rem,4rem+2.6vw,7.5rem)]"
    >
      <h2 id="included-title" className="text-heading-4 font-semibold text-ink">
        {service.included.title}
      </h2>
      <ol className="flex w-full max-w-[52rem] flex-col">
        {service.included.items.map((item, index) => (
          <li
            key={item.title}
            className="grid grid-cols-[3.5rem_1fr] items-start gap-x-5 border-t border-hairline py-7 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[4.5rem_3rem_1fr] sm:gap-x-6"
          >
            <span className="text-heading-3 leading-none font-light text-silver">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="mt-5 hidden h-px bg-ash sm:block" />
            <div className="flex flex-col gap-2">
              <h3 className="text-heading-6 font-semibold text-ink">{item.title}</h3>
              <p className="text-body tracking-[0.5px] text-slate">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/*
 * Photos two to a row, framed by a top gutter equal to the side ones. On wider screens they are
 * 4:3, so a whole row fits in the window rather than one photo running past it.
 */
export function ServiceDetails({ service }: { service: Service }) {
  return (
    <section aria-label="Service details" className="grid gap-2 px-edge pt-edge md:grid-cols-2">
      {service.details.map((asset) => (
        <div key={asset.src} className="relative aspect-[4/5] overflow-hidden md:aspect-[4/3]">
          <ResponsiveImage
            asset={asset}
            sizes="(min-width: 768px) 50vw, 100vw"
            fill
            parallax={false}
          />
        </div>
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
      <Button href="/projects" variant="light">
        View all projects
      </Button>
    </section>
  );
}
