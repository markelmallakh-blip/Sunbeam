import { founder } from "@/content/about";
import { FounderSignature } from "@/components/brand/FounderSignature";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma "Categories" (115:4953): the founder's letter centred on Gray .5, signed in rust script,
 * beside her portrait filling the right half.
 */
export function Founder() {
  return (
    <section
      aria-label={founder.title}
      className="relative z-10 flex flex-col bg-linen lg:flex-row"
    >
      {/* Phones read title, portrait, then the letter; desktop keeps the title with the letter. */}
      <h2 className="px-edge pt-block pb-5 text-center text-heading-4 font-semibold text-ink lg:hidden">
        {founder.title}
      </h2>
      <div className="flex flex-1 flex-col items-center justify-center gap-stack px-edge py-block text-center max-lg:order-2 max-lg:pt-5">
        <div className="flex flex-col items-center gap-4 text-ink">
          <h2 className="text-heading-4 font-semibold max-lg:hidden">{founder.title}</h2>
          <div className="flex max-w-[35.5rem] flex-col gap-[1em] text-body tracking-[0.5px] sm:gap-[1.3em]">
            {founder.letter.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <FounderSignature className="h-8 w-auto text-rust sm:h-10" />
          <p className="sr-only">{founder.name}</p>
          <p className="text-caption font-medium tracking-[1px] text-slate uppercase sm:text-small">
            {founder.role}
          </p>
        </div>
      </div>
      <div className="relative aspect-[756/709] flex-1 overflow-hidden max-lg:order-1 lg:aspect-auto lg:min-h-[44.3125rem]">
        <ResponsiveImage asset={founder.image} sizes="(min-width: 1024px) 50vw, 100vw" fill />
      </div>
    </section>
  );
}
