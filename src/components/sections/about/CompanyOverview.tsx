import { companyOverview } from "@/content/about";
import { CountUp } from "@/components/ui/CountUp";

/*
 * Figma "Content" (153:2404): centred title and three paragraphs, then four stats 120px apart
 * that count up as they come into view.
 */
export function CompanyOverview() {
  return (
    <section
      aria-labelledby="overview-title"
      className="flex flex-col items-center gap-stack px-edge py-block text-center"
    >
      <div className="flex flex-col items-center gap-8">
        <h2 id="overview-title" className="text-heading-4 font-semibold text-ink">
          {companyOverview.title}
        </h2>
        <div className="flex max-w-[56.125rem] flex-col gap-[1.3em] text-subtitle leading-[1.3] tracking-[0.5px] text-ink">
          {companyOverview.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-16 gap-y-10 sm:flex sm:gap-[7.5rem]">
        {companyOverview.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse items-center">
            <dt className="text-body tracking-[0.5px] text-slate">{stat.label}</dt>
            <dd className="text-[clamp(2.75rem,2.3rem+1.9vw,3.875rem)] leading-none font-semibold text-[#262626]">
              <CountUp value={stat.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
