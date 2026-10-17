import { consultation } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { BookingWidget } from "./BookingWidget";

export function Consultation() {
  return (
    <section
      id="consultation"
      aria-labelledby="consultation-title"
      className="scroll-mt-header bg-linen py-section text-ink"
    >
      <Container className="grid gap-12 lg:grid-cols-[1fr_55.625rem] lg:items-start lg:gap-10">
        <Reveal className="flex flex-col items-start gap-8 lg:pt-4">
          <SectionHeading
            id="consultation-title"
            eyebrow={consultation.eyebrow}
            title={consultation.title}
            description={consultation.description}
            size="h4"
          />
          <Button href={consultation.cta.href} variant="outline-dark">
            {consultation.cta.label}
          </Button>
        </Reveal>
        <Reveal delay={0.1}>
          <BookingWidget />
        </Reveal>
      </Container>
    </section>
  );
}
