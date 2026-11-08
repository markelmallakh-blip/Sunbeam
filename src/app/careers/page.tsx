import type { Metadata } from "next";
import Image from "next/image";
import { careersPage, roles } from "@/content/careers";
import { RoleList } from "@/components/careers/RoleList";
import { Icon } from "@/components/ui/Icon";
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

/*
 * Careers, kept simple: a full-screen photo banner with the eyebrow and headline centred on its
 * lower edge (like the homepage hero) and a gently moving "Scroll to join" cue, then the open roles.
 */
export default function CareersPage() {
  return (
    <>
      <section
        aria-labelledby="careers-title"
        className="relative isolate flex h-svh min-h-[40rem] flex-col items-center justify-end overflow-hidden px-edge pt-[6.25rem] pb-5 text-center sm:pb-6"
      >
        <div className="absolute inset-0 -z-10 bg-ink">
          <Image
            src={withBase(careersPage.hero.src)}
            alt={careersPage.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_45%]"
          />
          <div aria-hidden className="absolute inset-0 bg-black/20" />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent to-50%"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-eyebrow-lg font-medium tracking-[0.5px] text-offwhite uppercase">
            {careersPage.eyebrow}
          </p>
          <h1
            id="careers-title"
            className="text-[clamp(1.375rem,1.06rem+1.29vw,2.125rem)] leading-[1.08] font-semibold text-white"
          >
            {careersPage.title}
          </h1>
        </div>

        <a
          href="#roles"
          className="mt-5 flex flex-col items-center gap-1 text-caption font-medium tracking-[1.5px] text-white/85 uppercase transition-colors duration-300 hover:text-white sm:mt-6"
        >
          {careersPage.scrollCue}
          <span className="motion-safe:animate-scroll-cue">
            <Icon name="arrow-down" size={18} />
          </span>
        </a>
      </section>

      <section
        id="roles"
        aria-labelledby="roles-title"
        className="flex flex-col gap-6 py-block sm:gap-10"
      >
        <h2 id="roles-title" className="px-edge text-center text-heading-3 font-semibold text-ink">
          {careersPage.rolesTitle}
        </h2>
        <RoleList roles={roles} />
      </section>
    </>
  );
}
