import { aboutHero } from "@/content/about";
import { RefractionImage } from "@/components/media/RefractionImage";

/*
 * Figma "Hero" (90:2462): centred eyebrow and title above a full-bleed photo behind fluted glass
 * that clears around the pointer. The photo is at most Figma's 595px tall and shrinks with the
 * viewport so its bottom edge is always in view on first load.
 */
export function AboutHero() {
  return (
    <section aria-labelledby="about-title" className="flex flex-col items-center gap-8 pt-block">
      <div className="flex flex-col items-center gap-4 px-edge text-center">
        <p className="text-eyebrow-lg font-medium tracking-[0.5px] text-slate uppercase">
          {aboutHero.eyebrow}
        </p>
        <h1 id="about-title" className="text-heading-2 font-semibold text-ink">
          {aboutHero.title[0]}
          <br />
          {aboutHero.title[1]}
        </h1>
      </div>
      <RefractionImage
        image={aboutHero.image}
        sizes="100vw"
        priority
        className="h-[clamp(18rem,calc(100svh-25rem),37.1875rem)] w-full"
      />
    </section>
  );
}
