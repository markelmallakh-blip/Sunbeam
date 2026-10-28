import type { Metadata } from "next";
import { aboutHero } from "@/content/about";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { CompanyOverview } from "@/components/sections/about/CompanyOverview";
import { Values } from "@/components/sections/about/Values";
import { Purpose } from "@/components/sections/about/Purpose";
import { Founder } from "@/components/sections/about/Founder";
import { Clients } from "@/components/sections/Clients";
import { Consultation } from "@/components/sections/Consultation";
import { withBase } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "About Us",
  description: aboutHero.intro,
  alternates: { canonical: withBase("/about") },
  openGraph: {
    url: withBase("/about"),
    title: "About Sunbeam Spaces",
    description: aboutHero.intro,
  },
};

/*
 * Figma "About Us" (90:2460), 2026-10 redesign. Like the homepage there are no scroll-triggered
 * entrances: every section is fully drawn as it arrives.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyOverview />
      <Values />
      <Purpose />
      <Founder />
      <Clients />
      <Consultation />
    </>
  );
}
