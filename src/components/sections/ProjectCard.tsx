import type { Project } from "@/content/home";
import { TextLink } from "@/components/ui/TextLink";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/* "Selected work" slide: meta and a detail image beside the large cover (Figma 1026px card). */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      aria-labelledby={`project-${project.slug}`}
      className="grid gap-4 lg:grid-cols-[39.4%_1fr] lg:items-end"
    >
      <div className="flex flex-col items-start">
        <ul className="flex flex-wrap" aria-label="Categories">
          {project.tags.map((tag) => (
            <li key={tag} className="bg-stone px-1.5 py-0.5 text-small text-ink/80">
              {tag}
            </li>
          ))}
        </ul>
        <h3 id={`project-${project.slug}`} className="mt-3 font-display text-title">
          {project.title}
        </h3>
        <TextLink href={project.href} className="mt-5 text-body">
          Explore
        </TextLink>
        <div className="relative mt-10 hidden aspect-[404/313] w-full overflow-hidden lg:block">
          <ResponsiveImage asset={project.detail} sizes="(min-width: 1024px) 26vw, 404px" fill />
        </div>
      </div>
      <div className="relative aspect-[606/481] w-full overflow-hidden">
        <ResponsiveImage
          asset={project.cover}
          sizes="(min-width: 1024px) 606px, (min-width: 640px) 34rem, 85vw"
          fill
        />
      </div>
    </article>
  );
}
