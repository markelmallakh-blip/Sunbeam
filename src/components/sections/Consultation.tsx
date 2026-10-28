import { consultation } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { CalEmbed } from "@/components/booking/CalEmbed";

/*
 * Figma "Pre-footer / Book a Consultation" (90:2106): copy and an outline CTA beside the 890px
 * Cal.com booking embed. The heading is set in Montserrat like the rest of the redesign.
 */
export function Consultation() {
  return (
    <section
      id="consultation"
      aria-labelledby="consultation-title"
      className="flex scroll-mt-header flex-col gap-stack bg-linen px-edge py-block lg:flex-row lg:items-center"
    >
      <div className="flex flex-1 flex-col items-start gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-eyebrow-lg font-medium tracking-[0.5px] text-slate uppercase">
            {consultation.eyebrow}
          </p>
          <h2
            id="consultation-title"
            className="max-w-[32rem] text-heading-3 font-semibold text-balance text-ink"
          >
            {consultation.title}
          </h2>
        </div>
        <p className="max-w-[32rem] text-body tracking-[0.5px] text-slate">
          {consultation.description}
        </p>
        <Button href={consultation.cta.href} variant="outline-dark">
          {consultation.cta.label}
        </Button>
      </div>
      <div className="w-full overflow-hidden rounded-xl border border-hairline bg-white lg:w-[55.625rem] lg:shrink-0">
        <CalEmbed />
      </div>
    </section>
  );
}
