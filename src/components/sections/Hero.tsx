import { hero } from "@/content/homepage";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma "Hero" (90:1849): full-bleed film under a 20% black wash and a black-to-clear gradient
 * rising from the bottom, with the eyebrow and headline centred on the lower edge.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="sticky top-0 isolate flex h-svh min-h-[40rem] flex-col items-center justify-end overflow-hidden px-edge pt-[6.25rem] pb-8 text-center sm:pb-12"
    >
      <div className="absolute inset-0 -z-10 bg-ink">
        {hero.video ? (
          <video
            className="size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={hero.poster.src}
            aria-label={hero.video.label}
          >
            <source src={hero.video.src} type={hero.video.mimeType} />
            <source src={hero.videoFallback} type="video/mp4" />
          </video>
        ) : (
          <ResponsiveImage asset={hero.poster} sizes="100vw" fill priority parallax={false} />
        )}
        <div aria-hidden className="absolute inset-0 bg-black/20" />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent to-50%"
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-eyebrow-lg font-medium tracking-[0.5px] text-offwhite uppercase">
          {hero.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="text-[clamp(1.625rem,1.067rem+2.286vw,3.125rem)] leading-[1.08] font-semibold text-white"
        >
          {hero.title[0]}
          <br />
          {hero.title[1]}
        </h1>
      </div>
    </section>
  );
}
