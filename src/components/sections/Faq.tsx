import { faqs } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/animations/Reveal";
import { FaqAccordion } from "./FaqAccordion";

export function Faq() {
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="scroll-mt-header bg-white pt-28 pb-28 text-ink"
    >
      <Container className="flex flex-col gap-16">
        <Reveal className="mx-auto flex max-w-[62rem] flex-col items-center gap-6">
          <Eyebrow className="text-ink">{faqs.eyebrow}</Eyebrow>
          <h2
            id="faqs-title"
            className="text-center font-display text-statement text-balance text-slate"
          >
            {faqs.statement}
          </h2>
        </Reveal>
        <div className="grid gap-12 lg:grid-cols-[23.0625rem_1fr] lg:gap-20">
          <Reveal>
            <div className="relative aspect-[369/329] w-full overflow-hidden">
              <ResponsiveImage asset={faqs.image} sizes="(min-width: 1024px) 369px, 100vw" fill />
            </div>
          </Reveal>
          <div className="flex flex-col items-start gap-11">
            <FaqAccordion items={faqs.items} />
            <Button href={faqs.cta.href} variant="outline-dark">
              {faqs.cta.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
