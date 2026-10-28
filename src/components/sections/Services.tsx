import Link from "next/link";
import { services } from "@/content/homepage";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma "Container" (92:5891): centred heading over two full-height photo cards, each fading to
 * 60% black at the bottom under its title and description.
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
      <ul className="grid w-full gap-2 md:grid-cols-2">
        {services.items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="group relative isolate flex aspect-[4/5] flex-col items-center justify-end gap-3 overflow-hidden p-6 text-center text-white md:aspect-auto md:h-[min(46rem,80svh)]"
            >
              <div className="absolute inset-0 -z-10 transition-transform duration-1000 ease-soft group-hover:scale-[1.03]">
                <ResponsiveImage
                  asset={item.image}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  quality={85}
                  fill
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-b from-transparent from-50% to-black/60"
              />
              <h3 className="text-heading-4 font-semibold">{item.title}</h3>
              <p className="max-w-[34rem] text-body tracking-[0.5px]">{item.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
