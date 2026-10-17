import { companyOverview } from "@/content/about";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/animations/Reveal";
import { WindowMosaic } from "@/components/brand/WindowMosaic";

/* Figma "Content" (67:908): the studio photo cut into the window shape beside the overview copy. */
export function CompanyOverview() {
  return (
    <section aria-labelledby="overview-title" className="bg-white py-section-sm text-ink">
      <Container className="grid gap-10 md:grid-cols-[minmax(0,28.75rem)_1fr] md:items-start md:gap-12 lg:gap-20">
        <WindowMosaic image={companyOverview.image} className="mx-auto w-full max-w-[28.75rem]" />
        <Reveal className="flex flex-col gap-6">
          <h2 id="overview-title" className="font-display text-title leading-[1.3] text-slate">
            {companyOverview.title}
          </h2>
          <div className="flex flex-col gap-[1.3em] text-subtitle leading-[1.3]">
            {companyOverview.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
