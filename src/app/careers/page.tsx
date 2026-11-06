import type { Metadata } from "next";
import Image from "next/image";
import { careersPage, roles } from "@/content/careers";
import { RoleList } from "@/components/careers/RoleList";
import { InlineStatement } from "@/components/careers/InlineStatement";
import { StudioBadge } from "@/components/careers/StudioBadge";
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
 * Careers: a hanging studio badge visitors can drag and flip with the centred intro beneath it, a
 * large statement with small studio photos set into its lines and the roles button, why the studio is a good place to work, then the open roles.
 */
export default function CareersPage() {
  const { why } = careersPage;

  return (
    <>
      {/*
       * Figma 209:2360: a full-screen photo with a centred card — the badge hanging in a grey
       * square over a white title. The badge's canvas spans the whole hero from the top of the
       * square, so the card can be dragged out over the photo without being cropped.
       */}
      <section
        aria-labelledby="careers-title"
        className="relative h-svh min-h-[40rem] overflow-hidden bg-ink"
      >
        <Image
          src={withBase(careersPage.hero.src)}
          alt={careersPage.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_58%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0)_20%),linear-gradient(180deg,rgba(0,0,0,0)_70%,rgba(0,0,0,0.9)_100%)]"
        />
        <div className="relative flex h-full items-center justify-center px-edge pt-10">
          <div className="relative flex w-full max-w-[20.6875rem] flex-col">
            <StudioBadge
              front={withBase(careersPage.badge.front)}
              back={withBase(careersPage.badge.back)}
              strap={withBase(careersPage.badge.strap)}
              spacerClassName="aspect-square w-full bg-[#d9d9d9]"
              layerClassName="absolute top-0 left-1/2 z-10 h-svh w-screen -translate-x-1/2"
              size={0.62}
              strapLength={0.62}
            />
            <div className="flex flex-col items-center gap-4 bg-white p-5 text-center">
              <p className="text-eyebrow-lg font-medium tracking-[2px] text-slate uppercase">
                {careersPage.eyebrow}
              </p>
              <h1 id="careers-title" className="text-heading-2 font-semibold text-ink">
                {careersPage.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Life at Sunbeam" className="bg-white px-edge py-block">
        <InlineStatement />
      </section>

      {/* Laid out like the About values: an illustration over each title and description. */}
      <section
        aria-labelledby="why-title"
        className="flex flex-col items-center gap-stack bg-mist px-edge py-block"
      >
        <div className="flex flex-col items-center gap-2 text-center text-ink">
          <p className="text-small font-medium tracking-[1px] uppercase">{why.eyebrow}</p>
          <h2 id="why-title" className="text-heading-3 font-semibold">
            {why.title}
          </h2>
          <p className="max-w-[34rem] text-body tracking-[0.5px] text-slate">{why.intro}</p>
        </div>

        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-10 sm:gap-y-12 lg:grid-cols-4">
          {why.reasons.map((reason) => (
            <li
              key={reason.title}
              className="flex flex-col items-center gap-3 text-center sm:gap-5 sm:px-4 lg:border-l lg:border-[#c4c5c7] lg:first:border-l-0"
            >
              <div
                className={`relative size-20 shrink-0 overflow-hidden rounded-lg sm:h-[8.625rem] sm:w-[8.6875rem] ${reason.icon ? "" : "bg-white/70"}`}
              >
                {reason.icon ? (
                  <Image
                    src={withBase(reason.icon)}
                    alt=""
                    fill
                    sizes="139px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-col items-center gap-1.5 tracking-[0.5px] sm:gap-3">
                <h3 className="text-heading-6 font-bold text-ink">{reason.title}</h3>
                <p className="max-w-[20rem] text-small text-slate sm:text-body">
                  {reason.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="roles"
        aria-labelledby="roles-title"
        className="flex scroll-mt-header flex-col gap-6 py-block sm:gap-10"
      >
        <h2 id="roles-title" className="px-edge text-center text-heading-3 font-semibold text-ink">
          {careersPage.rolesTitle}
        </h2>
        <RoleList roles={roles} />
      </section>
    </>
  );
}
