import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Clients } from "@/components/sections/Clients";
import { Faq } from "@/components/sections/Faq";
import { Blog } from "@/components/sections/Blog";
import { Consultation } from "@/components/sections/Consultation";

/*
 * Figma "Homepage" (90:1848), 2026-10 redesign. No scroll-triggered entrances: every section is
 * fully drawn as it arrives; Lenis smooth scrolling and quiet hover states carry the motion.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <Services />
      <Projects />
      <Clients />
      <Faq />
      <Blog />
      <Consultation />
    </>
  );
}
