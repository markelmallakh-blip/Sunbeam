import { faqs } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "./FaqAccordion";

/* Figma "FAQs" (90:2064): centred title, an 862px accordion with the first answer open, and a CTA. */
export function Faq() {
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="flex scroll-mt-header flex-col items-center gap-stack border-y border-hairline bg-white px-edge py-block"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 id="faqs-title" className="text-heading-4 font-semibold text-ink">
          {faqs.title}
        </h2>
        <p className="text-body tracking-[0.5px] text-slate">{faqs.description}</p>
      </div>
      <FaqAccordion items={faqs.items} />
      <Button href={faqs.cta.href} variant="light">
        {faqs.cta.label}
      </Button>
    </section>
  );
}
