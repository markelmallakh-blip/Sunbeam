import type { Metadata } from "next";
import { careersPage, roles } from "@/content/careers";
import { team } from "@/content/about";
import { PageIntro } from "@/components/services/PageIntro";
import { ParallaxBanner } from "@/components/media/ParallaxBanner";
import { RoleList } from "@/components/careers/RoleList";
import { withBase } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Careers",
  description: careersPage.intro,
  alternates: { canonical: withBase("/careers") },
  openGraph: {
    url: withBase("/careers"),
    title: "Careers — Sunbeam Spaces",
    description: careersPage.intro,
  },
};

/* Careers: centred intro, a full-bleed photo of the team, then the open roles. */
export default function CareersPage() {
  return (
    <>
      <section aria-labelledby="careers-title" className="px-edge pt-block pb-stack">
        <PageIntro
          id="careers-title"
          eyebrow={careersPage.eyebrow}
          title={careersPage.title}
          intro={careersPage.intro}
        />
      </section>

      <ParallaxBanner
        asset={team.image}
        label="The Sunbeam team"
        priority
        frameClassName="aspect-[4/3] sm:aspect-[16/8] lg:aspect-auto lg:h-[min(38rem,58svh)]"
      />

      <section aria-labelledby="roles-title" className="flex flex-col gap-6 py-block sm:gap-10">
        <h2 id="roles-title" className="px-edge text-center text-heading-3 font-semibold text-ink">
          {careersPage.rolesTitle}
        </h2>
        <RoleList roles={roles} />
      </section>
    </>
  );
}
