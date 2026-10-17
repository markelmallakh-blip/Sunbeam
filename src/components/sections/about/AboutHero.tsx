import { aboutHero } from "@/content/about";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/animations/Reveal";
import { RefractionImage } from "@/components/media/RefractionImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CountUp } from "@/components/ui/CountUp";

/* Figma "Hero" (54:703): headline + intro, a wide photo behind reeded glass, and four counting stats. */
export function AboutHero() {
  return (
    <section
      aria-labelledby="about-title"
      className="bg-white pt-14 pb-section-sm text-ink lg:pt-20"
    >
      <Container className="flex flex-col gap-10 lg:gap-[3.75rem]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
          <Reveal className="flex flex-col gap-4 lg:w-[53.75rem]">
            <Eyebrow className="text-slate">{aboutHero.eyebrow}</Eyebrow>
            <h1 id="about-title" className="font-display text-display">
              {aboutHero.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </Reveal>
          <Reveal delay={0.15} className="lg:flex-1">
            <p className="text-subtitle text-slate">{aboutHero.intro}</p>
          </Reveal>
        </div>

        <Reveal offset={40}>
          <RefractionImage
            image={aboutHero.image}
            sizes="(min-width: 1512px) 1392px, calc(100vw - 2 * var(--spacing-gutter))"
            priority
            className="aspect-[4/3] sm:aspect-[1392/678] lg:max-h-[calc(100svh-4.4375rem-4rem)] lg:w-full"
          />
        </Reveal>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:flex sm:justify-end sm:gap-x-16 lg:gap-x-[6.25rem]">
          {aboutHero.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="flex flex-col-reverse gap-2">
              <dt className="text-small text-slate">{stat.label}</dt>
              <dd className="font-display text-h2 leading-[1.2] text-rust">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
