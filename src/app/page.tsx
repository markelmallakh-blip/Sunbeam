import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Clients } from "@/components/sections/Clients";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Consultation } from "@/components/sections/Consultation";
import { PageMotion } from "@/components/animations/PageMotion";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <Services />
      <Projects />
      <Clients />
      <Testimonials />
      <Faq />
      <Consultation />
      <PageMotion />
    </>
  );
}
