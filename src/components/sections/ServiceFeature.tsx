import Link from "next/link";
import type { Service } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExploreCursor } from "@/components/ui/ExploreCursor";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

type ServiceFeatureProps = {
  service: Service;
  /** Copy on the left and images on the right (Figma FF&E row). */
  reversed?: boolean;
};

/*
 * One service row: two image frames that arrive tilted and straighten on scroll (ServicesMotion),
 * linked as one target beside the copy; the whole row shows the "Explore" cursor.
 */
export function ServiceFeature({ service, reversed = false }: ServiceFeatureProps) {
  const [primary, secondary] = service.images;

  const images = (
    <Link
      href={service.href}
      aria-label={`Explore ${service.title}`}
      className={cn(
        "flex items-start",
        reversed ? "gap-4 lg:col-span-8 lg:col-start-5 lg:-ml-8" : "gap-3 lg:col-span-8",
      )}
    >
      {reversed ? (
        <>
          <div
            data-tilt="3.7"
            className="relative aspect-[540/690] w-[60%] rotate-[3.7deg] overflow-hidden"
          >
            <ResponsiveImage asset={primary} sizes="(min-width: 1024px) 38vw, 60vw" fill />
          </div>
          <div
            data-tilt="-4"
            className="relative mt-[8.5rem] aspect-square w-[38%] -rotate-4 overflow-hidden"
          >
            <ResponsiveImage asset={secondary} sizes="(min-width: 1024px) 24vw, 38vw" fill />
          </div>
        </>
      ) : (
        <>
          <div
            data-tilt="4"
            className="relative mt-[2.1rem] aspect-square w-[39%] rotate-4 overflow-hidden"
          >
            <ResponsiveImage asset={secondary} sizes="(min-width: 1024px) 24vw, 39vw" fill />
          </div>
          <div
            data-tilt="-3.5"
            className="relative aspect-[552/690] w-[59%] -rotate-[3.5deg] overflow-hidden"
          >
            <ResponsiveImage asset={primary} sizes="(min-width: 1024px) 36vw, 59vw" fill />
          </div>
        </>
      )}
    </Link>
  );

  return (
    <ExploreCursor href={service.href}>
      <article
        aria-labelledby={`${service.id}-title`}
        className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6"
      >
        {!reversed && images}
        <Reveal
          className={cn(
            "flex flex-col items-start gap-4",
            reversed
              ? "lg:col-span-4 lg:row-start-1 lg:pt-16"
              : "lg:col-span-4 lg:col-start-9 lg:pt-20",
          )}
        >
          <Eyebrow className="text-slate">{service.eyebrow}</Eyebrow>
          <h3 id={`${service.id}-title`} className="font-display text-h3">
            {service.title}
          </h3>
          <p className="max-w-[24rem] text-body text-slate">{service.description}</p>
          <Button href={service.href} variant="outline-dark" className="mt-4">
            Know more
          </Button>
        </Reveal>
        {reversed && images}
      </article>
    </ExploreCursor>
  );
}
