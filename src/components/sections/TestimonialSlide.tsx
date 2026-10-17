import type { Testimonial } from "@/content/home";
import { Icon } from "@/components/ui/Icon";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * One testimonial: quote centred, a tall image top-right and a small thumbnail by the author.
 * While the slide is in focus its images drift gently (float keyframes, off for reduced motion).
 */
export function TestimonialSlide({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="relative flex h-full flex-col items-center px-4 text-center lg:pt-[9.7rem]">
      <div className="absolute top-0 right-10 hidden aspect-[166/174] w-[10.375rem] overflow-hidden group-data-[active=true]/slide:animate-float lg:block">
        <ResponsiveImage asset={testimonial.image} sizes="166px" fill />
      </div>
      <Icon name="quote" size={40} className="text-rust" />
      <blockquote className="mt-5 max-w-[31.5rem] font-display text-quote">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-auto flex flex-col gap-1 pt-24">
        <span className="text-small text-ink">{testimonial.author}</span>
        <span className="text-caption text-slate">{testimonial.project}</span>
      </figcaption>
      <div className="absolute bottom-0 left-10 hidden aspect-[143/86] w-[8.9375rem] overflow-hidden group-data-[active=true]/slide:animate-float-alt lg:block">
        <ResponsiveImage asset={testimonial.image} sizes="143px" fill />
      </div>
    </figure>
  );
}
