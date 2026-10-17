import { projects } from "@/content/home";
import { projectHref } from "@/content/projects";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ProjectsSlider } from "@/components/sections/ProjectsSlider";

/* Figma "Categories" / Discover More (82:2302): the projects in the "Selected work" slider. */
export function MoreProjects({ current }: { current: string }) {
  const ordered = projects.items
    .filter((project) => project.slug !== current)
    .map((project) => ({ ...project, href: projectHref(project.slug) }));

  return (
    <section
      aria-labelledby="more-projects-title"
      className="flex flex-col gap-16 bg-white pt-section text-ink"
    >
      <Container>
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="more-projects-title"
            eyebrow="More projects"
            title="Discover More"
            size="h3"
          />
          <Button
            href={projects.cta.href}
            variant="outline-dark"
            className="self-start md:self-end"
          >
            View all
          </Button>
        </Reveal>
      </Container>
      <ProjectsSlider count={ordered.length}>
        {ordered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ProjectsSlider>
    </section>
  );
}
