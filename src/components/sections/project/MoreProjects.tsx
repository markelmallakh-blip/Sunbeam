import { projectDetailCopy, projectHref, projectTags, projects } from "@/content/projects";
import { Button } from "@/components/ui/Button";
import { ProjectsCarousel } from "@/components/sections/ProjectsCarousel";

/*
 * Figma "Categories" (90:3196) — "Discover More": the homepage project carousel on Gray 1 with
 * every other project, and a white "View all" CTA.
 */
export function MoreProjects({ current }: { current: string }) {
  const items = projects
    .filter((project) => project.slug !== current)
    .map((project) => ({
      title: project.title,
      tags: projectTags(project),
      href: projectHref(project.slug),
      image: project.cover,
    }));

  return (
    <section
      aria-labelledby="more-projects-title"
      className="flex flex-col items-center gap-8 overflow-hidden bg-mist px-edge py-block"
    >
      <h2 id="more-projects-title" className="text-heading-3 font-semibold text-ink">
        {projectDetailCopy.discoverTitle}
      </h2>
      <ProjectsCarousel items={items} />
      <Button
        href={projectDetailCopy.discoverCta.href}
        variant="light"
        className="bg-white! hover:bg-mist-strong!"
      >
        {projectDetailCopy.discoverCta.label}
      </Button>
    </section>
  );
}
