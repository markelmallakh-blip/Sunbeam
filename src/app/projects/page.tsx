import type { Metadata } from "next";
import { projects, projectsPage } from "@/content/projects";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { Consultation } from "@/components/sections/Consultation";
import { withBase } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Projects",
  description: projectsPage.description,
  alternates: { canonical: withBase("/projects") },
};

/* Figma "Projects" (185:1587): intro, filter bar, staggered grid, consultation. */
export default function ProjectsPage() {
  return (
    <>
      <section
        aria-labelledby="projects-title"
        className="flex flex-col items-center px-edge pt-block pb-[4.5rem] text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-small font-medium tracking-[2px] text-slate uppercase">
            {projectsPage.eyebrow}
          </p>
          <h1 id="projects-title" className="text-heading-1 font-semibold text-ink">
            {projectsPage.title}
          </h1>
        </div>
      </section>
      <ProjectsExplorer projects={projects} />
      <Consultation />
    </>
  );
}
