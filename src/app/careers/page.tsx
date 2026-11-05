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
      {/* The badge hangs from the top centre, the heading centred beneath it. */}
      <section
        aria-labelledby="careers-title"
        className="relative flex flex-col items-center px-edge pb-block"
      >
        <StudioBadge
          front={withBase(careersPage.badge.front)}
          back={withBase(careersPage.badge.back)}
          strap={withBase(careersPage.badge.strap)}
          spacerClassName="h-[24rem] w-full sm:h-[28rem] lg:h-[min(32rem,52svh)]"
        />
        <div className="pointer-events-none relative -mt-2 flex flex-col items-center gap-4 text-center sm:-mt-4">
          <p className="text-eyebrow-lg font-medium tracking-[0.5px] text-slate uppercase">
            {careersPage.eyebrow}
          </p>
          <h1 id="careers-title" className="text-heading-1 font-semibold text-ink">
            {careersPage.title}
          </h1>
        </div>
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
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-white/70 sm:h-[8.625rem] sm:w-[8.6875rem]">
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
