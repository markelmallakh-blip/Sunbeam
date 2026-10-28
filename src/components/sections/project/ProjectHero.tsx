import Image from "next/image";
import { Fragment } from "react";
import type { Project } from "@/content/projects";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma "Hero" (115:5288): the project photo full-bleed, fading to 90% black over its lower third,
 * with title, meta line and summary bottom-left and the client logo on a white tile bottom-right.
 */
export function ProjectHero({ project }: { project: Project }) {
  const meta = [
    project.category,
    project.sector,
    ...project.services,
    project.location,
    project.year,
  ].filter((item): item is string => Boolean(item));

  return (
    <section
      aria-labelledby="project-title"
      className="relative isolate flex h-[56.25rem] max-h-svh min-h-[35rem] items-end gap-2.5 overflow-hidden px-edge pb-8 text-white"
    >
      <div className="absolute inset-0 -z-10">
        <ResponsiveImage asset={project.hero} sizes="100vw" fill priority parallax={false} />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-transparent from-[64%] to-black/90"
        />
      </div>

      <div className="flex flex-1 flex-col items-start gap-4">
        <div className="flex flex-col gap-2">
          <h1 id="project-title" className="text-heading-4 font-semibold">
            {project.title}
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-small font-medium tracking-[0.5px]">
            {meta.map((item, index) => (
              <Fragment key={item}>
                {index > 0 && <span aria-hidden className="size-[3px] rounded-full bg-white" />}
                <span>{item}</span>
              </Fragment>
            ))}
          </p>
        </div>
        <p className="max-w-[43.125rem] text-body tracking-[0.5px]">{project.summary}</p>
      </div>

      {project.logo && (
        <div className="hidden h-[5.6875rem] w-[7.4375rem] shrink-0 place-items-center bg-white sm:grid">
          <Image
            src={project.logo.src}
            alt={project.logo.alt}
            width={project.logo.width}
            height={project.logo.height}
            className="h-[4.2rem] w-auto"
          />
        </div>
      )}
    </section>
  );
}
