"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { values } from "@/content/about";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { duration, easeSoft } from "@/lib/motion";

type Layout = "photos" | "icons";

/*
 * Figma "Container" (152:1834) has two layouts, and clicking the section swaps between them so
 * both can be shown to the client: Default (152:1833) is five 320px photo cards, 8px apart;
 * Variant2 (152:2223) is four line illustrations with a title and description, split by rules.
 */
export function Values() {
  const [layout, setLayout] = useState<Layout>("photos");
  const toggle = () => setLayout((current) => (current === "photos" ? "icons" : "photos"));

  return (
    <section
      aria-labelledby="values-title"
      onClick={toggle}
      className="relative flex cursor-pointer flex-col items-center gap-stack bg-mist px-edge py-block"
    >
      <div className="flex flex-col items-center gap-2 text-center text-ink">
        <p className="text-small font-medium tracking-[1px] uppercase">{values.eyebrow}</p>
        <h2 id="values-title" className="text-heading-3 font-semibold">
          {values.title}
        </h2>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:right-4 focus-visible:rounded-[4px] focus-visible:bg-white focus-visible:px-3 focus-visible:py-2 focus-visible:text-small"
      >
        {layout === "photos" ? "Show the illustrated layout" : "Show the photo layout"}
      </button>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={layout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easeSoft }}
          className={
            layout === "photos"
              ? "grid w-full grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3 lg:grid-cols-5"
              : "grid w-full gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
          }
        >
          {layout === "photos"
            ? values.items.map((value) => (
                <li key={value.title} className="group flex flex-col gap-3">
                  <div className="relative h-80 overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-1000 ease-soft group-hover:scale-[1.04]">
                      <ResponsiveImage
                        asset={value.image}
                        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                        fill
                        parallax={false}
                      />
                    </div>
                  </div>
                  <h3 className="text-body font-semibold tracking-[0.5px] text-slate">
                    {value.title}
                  </h3>
                </li>
              ))
            : values.items.flatMap((value) =>
                value.icon
                  ? [
                      <li
                        key={value.title}
                        className="flex flex-col gap-[3.75rem] px-4 lg:border-l lg:border-[#c4c5c7] lg:first:border-l-0"
                      >
                        <div className="relative h-[8.625rem] w-[8.6875rem] shrink-0 overflow-hidden rounded-lg">
                          <ResponsiveImage asset={value.icon} sizes="139px" fill parallax={false} />
                        </div>
                        <div className="flex flex-col gap-4 tracking-[0.5px]">
                          <h3 className="text-heading-6 font-bold text-ink">{value.title}</h3>
                          <p className="text-body text-slate">{value.description}</p>
                        </div>
                      </li>,
                    ]
                  : [],
              )}
        </motion.ul>
      </AnimatePresence>
    </section>
  );
}
