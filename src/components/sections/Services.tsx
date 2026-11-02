import Link from "next/link";
import { services } from "@/content/homepage";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma "Container" (92:5891): centred heading over the service photo cards (three across on
 * desktop), each fading to 60% black at the bottom under its title and description.
 */
export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="flex scroll-mt-header flex-col items-center gap-stack bg-mist px-edge py-block"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 id="services-title" className="text-heading-2 font-semibold text-ink">
          {services.title}
        </h2>
        <p className="max-w-[43.625rem] text-body tracking-[0.5px] text-slate">
          {services.description}
        </p>
      </div>
      <ul className="grid w-full gap-2 lg:grid-cols-3">
        {services.items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="group relative isolate flex aspect-square flex-col items-center justify-end gap-2 overflow-hidden p-5 text-center text-white sm:aspect-[16/10] sm:gap-3 sm:p-6 lg:aspect-auto lg:h-[min(42rem,78svh)]"
            >
              <div className="absolute inset-0 -z-10 transition-transform duration-1000 ease-soft group-hover:scale-[1.03]">
                <ResponsiveImage
                  asset={item.image}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  quality={85}
                  fill
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-b from-transparent from-50% to-black/60"
              />
              <h3 className="text-heading-4 font-semibold">{item.title}</h3>
              <p className="max-w-[26rem] text-small tracking-[0.5px] sm:text-body lg:min-h-[3lh]">
                {item.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
