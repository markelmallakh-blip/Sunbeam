import type { Metadata } from "next";
import { PageIntro } from "@/components/services/PageIntro";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Consultation } from "@/components/sections/Consultation";
import { withBase } from "@/lib/base-path";
import { faqPage } from "./content";

export const metadata: Metadata = {
  title: "FAQs",
  description: faqPage.intro,
  alternates: { canonical: withBase("/faqs") },
  openGraph: { url: withBase("/faqs"), title: "FAQs — Sunbeam Spaces", description: faqPage.intro },
};

/* FAQ page: centred intro, the questions grouped under small headings, then the booking section. */
export default function FaqsPage() {
  return (
    <>
      <section
        aria-labelledby="faqs-title"
        className="flex flex-col items-center gap-stack px-edge py-block"
      >
        <PageIntro
          id="faqs-title"
          eyebrow={faqPage.eyebrow}
          title={faqPage.title}
          intro={faqPage.intro}
        />
        <div className="flex w-full max-w-[53.875rem] flex-col gap-stack">
          {faqPage.groups.map((group, groupIndex) => (
            <div key={group.title} className="flex flex-col gap-2">
              <h2 className="border-b border-hairline pb-4 text-heading-6 font-semibold text-ink">
                {group.title}
              </h2>
              <FaqAccordion items={group.items} defaultOpen={groupIndex === 0 ? 0 : null} />
            </div>
          ))}
        </div>
      </section>

      <Consultation />
    </>
  );
}
