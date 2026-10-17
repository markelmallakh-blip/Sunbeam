import { services } from "@/content/home";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ServiceFeature } from "./ServiceFeature";
import { ServicesMotion } from "./ServicesMotion";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="scroll-mt-header bg-stone pb-section text-ink lg:pb-40"
    >
      <ServicesMotion className="relative">
        {/* Sticky headline: the service rows scroll over it while it recedes. */}
        <div className="sticky top-0 grid h-[70svh] place-items-center overflow-hidden lg:h-svh">
          <div data-services-head className="px-gutter will-change-transform">
            <SectionHeading
              id="services-title"
              eyebrow={services.eyebrow}
              title={services.title}
              description={services.description}
              align="center"
            />
          </div>
        </div>
        <Container className="relative z-10 flex flex-col gap-28 lg:-mt-[20svh] lg:gap-[13rem]">
          {services.items.map((service, index) => (
            <ServiceFeature key={service.id} service={service} reversed={index % 2 === 1} />
          ))}
        </Container>
      </ServicesMotion>
    </section>
  );
}
