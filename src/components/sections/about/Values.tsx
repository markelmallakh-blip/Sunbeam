import { values } from "@/content/about";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma "Container" Variant2 (152:2223), the layout the client chose: four line illustrations,
 * each centred over its title and description and split by rules on desktop. Two to a row on
 * phones.
 */
export function Values() {
  const items = values.items.flatMap((value) =>
    value.icon ? [{ ...value, icon: value.icon }] : [],
  );

  return (
    <section
      aria-labelledby="values-title"
      className="flex flex-col items-center gap-stack bg-mist px-edge py-block"
    >
      <div className="flex flex-col items-center gap-2 text-center text-ink">
        <p className="text-small font-medium tracking-[1px] uppercase">{values.eyebrow}</p>
        <h2 id="values-title" className="text-heading-3 font-semibold">
          {values.title}
        </h2>
      </div>

      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-10 sm:gap-y-12 lg:grid-cols-4">
        {items.map((value) => (
          <li
            key={value.title}
            className="flex flex-col items-center gap-3 text-center sm:gap-5 sm:px-4 lg:border-l lg:border-[#c4c5c7] lg:first:border-l-0"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg sm:h-[8.625rem] sm:w-[8.6875rem]">
              <ResponsiveImage asset={value.icon} sizes="139px" fill parallax={false} />
            </div>
            <div className="flex flex-col items-center gap-1.5 tracking-[0.5px] sm:gap-3">
              <h3 className="text-heading-6 font-bold text-ink">{value.title}</h3>
              <p className="max-w-[20rem] text-small text-slate sm:text-body">
                {value.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
