"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { projectHref, projectTags, type Project } from "@/content/projects";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/*
 * Figma "Project Card" (184:1815). Temporary: three hover styles for the client to compare (the
 * toggle sits above the grid in ProjectsExplorer). The earlier "frame" (thumbnail zoom) hover is
 * in git history. Hover only runs on desktop; smaller screens keep the tags in a line above the
 * title. ProjectsExplorer scrubs a `--parallax` percentage on each frame that the photo drifts by.
 *
 *   A Veil     — the photo dims and the tags with a "View project" link rise in at the centre.
 *   B Caption  — a white panel slides up over the foot of the photo with the tags and a link.
 *   C Chips    — small white tag chips rise in at the top-left of the photo.
 */
export type CardHover = "A" | "B" | "C";

export const cardHovers: { key: CardHover; label: string }[] = [
  { key: "A", label: "Veil" },
  { key: "B", label: "Caption" },
  { key: "C", label: "Chips" },
];

const SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw";
const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/* Stagger on the way in only; leaving, everything goes at once. */
const rise = (index: number, base = 200) =>
  ({ "--rise-delay": `${base + index * 70}ms` }) as CSSProperties;
const RISE = `translate-y-3 opacity-0 transition-[opacity,translate] duration-200 ${EASE} group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-(--rise-delay) group-hover:duration-700`;

export function ProjectGridCard({ project, hover }: { project: Project; hover: CardHover }) {
  const tags = projectTags(project);

  return (
    <Link href={projectHref(project.slug)} className="group flex flex-col gap-5">
      <div data-parallax-frame className="relative aspect-[448/560] overflow-hidden bg-mist">
        {/* B lifts the photo a little so the panel never hides its subject. */}
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-1000",
            EASE,
            hover === "B" && "lg:group-hover:-translate-y-[8%]",
          )}
        >
          <div className="absolute inset-x-0 -top-[6%] h-[112%] translate-y-[calc(var(--parallax,0)*1%)]">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes={SIZES}
              className="object-cover"
            />
          </div>
        </div>

        <div className="hidden lg:contents">
          {hover === "A" && <Veil tags={tags} />}
          {hover === "B" && <Caption tags={tags} />}
          {hover === "C" && <Chips tags={tags} />}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="flex flex-wrap items-center gap-2 text-caption font-medium tracking-[1.2px] text-slate uppercase lg:hidden">
          {tags.map((tag, index) => (
            <Fragment key={tag}>
              {index > 0 && <span aria-hidden className="size-[3px] rounded-full bg-ash" />}
              <span>{tag}</span>
            </Fragment>
          ))}
        </p>
        <h2 className="text-heading-5 font-semibold text-ink">{project.title}</h2>
      </div>
    </Link>
  );
}

function ViewLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-caption font-medium tracking-[1.2px] uppercase",
        className,
      )}
    >
      View project
      <Icon name="arrow-right" size={14} />
    </span>
  );
}

function Veil({ tags }: { tags: string[] }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/0 text-center text-white transition-colors duration-700 group-hover:bg-black/45">
      <ul className="flex flex-col items-center gap-2 text-small font-medium tracking-[1.5px] uppercase">
        {tags.map((tag, index) => (
          <li key={tag} style={rise(index)} className={RISE}>
            {tag}
          </li>
        ))}
      </ul>
      <span style={rise(tags.length, 260)} className={RISE}>
        <ViewLabel className="border-b border-white/60 pb-1" />
      </span>
    </div>
  );
}

function Caption({ tags }: { tags: string[] }) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-4 bg-white p-6 transition-transform duration-500 group-hover:translate-y-0 group-hover:duration-1000",
        EASE,
      )}
    >
      <p className="flex flex-wrap items-center gap-2 text-caption font-medium tracking-[1.2px] text-slate uppercase">
        {/* Each dot rises with the label after it, so none shows before its tag. */}
        {tags.map((tag, index) => (
          <span key={tag} style={rise(index, 250)} className={cn(RISE, "flex items-center gap-2")}>
            {index > 0 && <span aria-hidden className="size-[3px] rounded-full bg-ash" />}
            {tag}
          </span>
        ))}
      </p>
      <span style={rise(tags.length, 300)} className={RISE}>
        <ViewLabel className="text-ink" />
      </span>
    </div>
  );
}

function Chips({ tags }: { tags: string[] }) {
  return (
    <ul className="absolute top-5 left-5 flex flex-wrap gap-2 pr-5">
      {tags.map((tag, index) => (
        <li
          key={tag}
          style={rise(index, 150)}
          className={cn(
            RISE,
            "bg-white px-3 py-1.5 text-caption font-medium tracking-[1.2px] text-ink uppercase",
          )}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
