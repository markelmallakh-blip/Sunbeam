import { testimonials } from "@/content/home";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { TestimonialSlide } from "./TestimonialSlide";
import { TestimonialsSlider } from "./TestimonialsSlider";

export function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="flex flex-col gap-16 bg-linen py-28 text-ink"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="testimonials-title"
            eyebrow={testimonials.eyebrow}
            title={testimonials.title}
            align="center"
            size="h4"
          />
        </Reveal>
      </Container>
      <TestimonialsSlider>
        {testimonials.items.map((testimonial, index) => (
          <TestimonialSlide key={index} testimonial={testimonial} />
        ))}
      </TestimonialsSlider>
    </section>
  );
}
