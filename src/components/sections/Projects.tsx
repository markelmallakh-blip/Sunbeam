import { projects } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { ProjectCard } from "./ProjectCard";
import { ProjectsSlider } from "./ProjectsSlider";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="flex scroll-mt-header flex-col gap-16 bg-white pt-28 text-ink"
    >
      <Container>
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="projects-title"
            eyebrow={projects.eyebrow}
            title={projects.title}
            description={projects.description}
            size="h3"
            className="[&>div]:max-w-none"
          />
          <Button
            href={projects.cta.href}
            variant="dark"
            className="self-start md:mb-1 md:self-end"
          >
            {projects.cta.label}
          </Button>
        </Reveal>
      </Container>
      <ProjectsSlider count={projects.items.length} startIndex={1}>
        {projects.items.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ProjectsSlider>
    </section>
  );
}
