import { founder } from "@/content/about";
import { FounderSignature } from "@/components/brand/FounderSignature";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma "Categories" (115:4953): the founder's letter centred on Gray .5, signed in rust script,
 * beside her portrait filling the right half.
 */
export function Founder() {
  return (
    <section aria-labelledby="founder-title" className="flex flex-col bg-linen lg:flex-row">
      <div className="flex flex-1 flex-col items-center justify-center gap-stack px-edge py-block text-center">
        <div className="flex flex-col items-center gap-4 text-ink">
          <h2 id="founder-title" className="text-heading-4 font-semibold">
            {founder.title}
          </h2>
          <div className="flex max-w-[35.5rem] flex-col gap-[1.3em] text-body tracking-[0.5px]">
            {founder.letter.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <FounderSignature className="h-10 w-auto text-rust" />
          <p className="sr-only">{founder.name}</p>
          <p className="text-small font-medium tracking-[1px] text-slate uppercase">
            {founder.role}
          </p>
        </div>
      </div>
      <div className="relative aspect-[756/709] flex-1 overflow-hidden lg:aspect-auto lg:min-h-[44.3125rem]">
        <ResponsiveImage asset={founder.image} sizes="(min-width: 1024px) 50vw, 100vw" fill />
      </div>
    </section>
  );
}
