import type { Metadata } from "next";
import { aboutHero, visionMission } from "@/content/about";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { CompanyOverview } from "@/components/sections/about/CompanyOverview";
import { StoryFilm } from "@/components/sections/about/StoryFilm";
import { Values } from "@/components/sections/about/Values";
import { FounderMessage } from "@/components/sections/about/FounderMessage";
import { VisionMissionBand } from "@/components/sections/about/VisionMission";
import { StackedSections } from "@/components/animations/StackedSections";
import { Clients } from "@/components/sections/Clients";
import { Consultation } from "@/components/sections/Consultation";
import { PageMotion } from "@/components/animations/PageMotion";
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

/* Figma "About Us" (54:687). */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyOverview />
      <StoryFilm />
      <Values />
      {/* Vision slides over the founder's letter, then Mission over Vision. */}
      <StackedSections>
        <FounderMessage />
        {visionMission.map((band, index) => (
          <VisionMissionBand key={band.title} band={band} index={index} />
        ))}
      </StackedSections>
      <Clients />
      <Consultation />
      <PageMotion />
    </>
  );
}
