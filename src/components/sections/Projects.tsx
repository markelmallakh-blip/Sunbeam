import { projects } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { ProjectsCarousel } from "./ProjectsCarousel";

/* Figma "Categories" (95:5988): centred heading, the "our work carousel" and a "View all" CTA. */
export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="flex scroll-mt-header flex-col items-center gap-stack overflow-hidden bg-white px-edge py-block"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 id="projects-title" className="text-heading-2 font-semibold text-ink">
          {projects.title}
        </h2>
        <p className="max-w-[43.625rem] text-body tracking-[0.5px] text-slate">
          {projects.description}
        </p>
      </div>
      <ProjectsCarousel items={projects.items} />
      <Button href={projects.cta.href} variant="light">
        {projects.cta.label}
      </Button>
    </section>
  );
}
