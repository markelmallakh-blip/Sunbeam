"use client";

import Link from "next/link";
import { useState } from "react";
import { services } from "@/content/homepage";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/*
 * "Our Services", set apart from the project cards that follow: an accordion of three photos side
 * by side, one open and two collapsed; hovering a collapsed one opens it. Phones get the photos
 * as stacked bands instead.
 */
export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative flex scroll-mt-header flex-col items-center gap-stack bg-mist px-edge py-block"
    >
      <Intro />
      <div className="w-full lg:hidden">
        <Bands />
      </div>
      <Accordion />
    </section>
  );
}

/* The section heading and line, centred. */
function Intro() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h2 id="services-title" className="text-heading-2 font-semibold text-ink">
        {services.title}
      </h2>
      <p className="max-w-[43.625rem] text-body tracking-[0.5px] text-slate">
        {services.description}
      </p>
    </div>
  );
}

/* Phones: wide photo bands, one under another. */
function Bands() {
  return (
    <ul className="flex w-full flex-col gap-3 sm:gap-5">
      {services.items.map((item) => (
        <li key={item.title}>
          <Link
            href={item.href}
            className="group relative isolate flex aspect-[4/5] flex-col items-center justify-end gap-2 overflow-hidden p-5 text-center text-white sm:aspect-[16/10] sm:gap-3 sm:p-8 lg:aspect-auto lg:h-[min(46rem,82svh)] lg:p-12"
          >
            <div className="absolute inset-0 -z-10 transition-transform duration-1000 ease-soft group-hover:scale-[1.03]">
              <ResponsiveImage asset={item.image} sizes="100vw" quality={85} fill />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-linear-to-t from-black/65 via-black/15 via-45% to-transparent"
            />
            <h3 className="text-heading-3 font-semibold">{item.title}</h3>
            <p className="max-w-[34rem] text-small tracking-[0.5px] text-white/85 sm:text-body">
              {item.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* Desktop: one wide panel and two narrow ones; the hovered (or focused) panel opens. */
function Accordion() {
  const [open, setOpen] = useState(0);

  return (
    <ul className="hidden h-[min(40rem,72svh)] w-full gap-2 lg:flex">
      {services.items.map((item, index) => {
        const on = open === index;
        return (
          <li
            key={item.title}
            className={cn(
              "min-w-0 transition-[flex-grow] duration-700 ease-soft",
              on ? "grow-[3] 2xl:grow-[4]" : "grow",
            )}
            style={{ flexBasis: 0 }}
          >
            <Link
              href={item.href}
              onMouseEnter={() => setOpen(index)}
              onFocus={() => setOpen(index)}
              className="group relative isolate flex h-full flex-col justify-end overflow-hidden p-8 text-white"
            >
              <div className="absolute inset-0 -z-10">
                <ResponsiveImage
                  asset={item.image}
                  sizes="(min-width: 1024px) 66vw, 1px"
                  quality={85}
                  fill
                  parallax={false}
                />
              </div>
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 -z-10 bg-linear-to-t to-transparent transition-colors duration-700",
                  on ? "from-black/65 via-black/15 via-45%" : "from-black/70 via-black/40",
                )}
              />
              <div className={cn("flex items-end", on && "pr-18")}>
                <div className="flex min-w-0 flex-col">
                  <h3
                    className={cn(
                      "text-heading-5 font-semibold 2xl:text-heading-4",
                      on && "whitespace-nowrap",
                    )}
                  >
                    {item.title}
                  </h3>
                  {/* Collapsed panels fold the description away; their titles may wrap to fit the narrow card. */}
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-soft",
                      on ? "grid-rows-[1fr] opacity-100 delay-150" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <p className="max-w-[30rem] overflow-hidden pt-3 text-body tracking-[0.5px] text-white/85">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "absolute right-8 bottom-8 grid size-12 place-items-center rounded-[4px] border border-white transition-[opacity,background-color,color] duration-500",
                    on ? "opacity-100 group-hover:bg-white group-hover:text-ink" : "opacity-0",
                  )}
                >
                  <Icon name="arrow-right" size={20} />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
