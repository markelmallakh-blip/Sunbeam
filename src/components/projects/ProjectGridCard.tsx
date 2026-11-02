import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { projectHref, projectTags, type Project } from "@/content/projects";

/*
 * Figma "Project Card" (184:1815), Default → Hover, with the "frame" motion the client chose. At
 * rest the photo fills the card; on hover (desktop) its edges ease in to a thumbnail while the
 * photo settles back a touch, like a print sliding into a black passe-partout, and the tags rise
 * in beneath it. Smaller screens have no hover, so they keep the tags in a line above the title.
 * ProjectsExplorer scrubs a `--parallax` percentage on each frame that the photo drifts by.
 */
const SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw";

export function ProjectGridCard({ project }: { project: Project }) {
  const tags = projectTags(project);
  return (
    <Link href={projectHref(project.slug)} className="group flex flex-col gap-5">
      <div
        data-parallax-frame
        // The mount turns black the instant the frame starts closing in and only goes back to
        // grey (the loading colour) after the photo has grown back over it, so grey never shows.
        className="relative aspect-[448/560] overflow-hidden bg-mist transition-colors delay-1000 duration-0 lg:group-hover:bg-black lg:group-hover:delay-0 lg:group-focus-visible:bg-black lg:group-focus-visible:delay-0"
      >
        {/* The thumbnail box from Figma's hover variant, as insets of the card. */}
        <div className="absolute inset-0 transition-[clip-path] duration-1000 ease-soft [clip-path:inset(0)] lg:group-hover:[clip-path:inset(5.36%_6.03%_31.43%_6.03%)] lg:group-focus-visible:[clip-path:inset(5.36%_6.03%_31.43%_6.03%)]">
          <div className="absolute inset-x-0 -top-[6%] h-[112%] translate-y-[calc(var(--parallax,0)*1%)]">
            {/* Scales about the thumbnail's centre (37% down the card, 38% down this layer). */}
            <div className="absolute inset-0 origin-[50%_38%] transition-transform duration-1000 ease-soft lg:group-hover:scale-[0.92] lg:group-focus-visible:scale-[0.92]">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                fill
                sizes={SIZES}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <ul className="absolute bottom-6 left-6 hidden flex-col gap-[1.125rem] text-body font-medium tracking-[1.2px] text-silver uppercase lg:flex">
          {tags.map((tag, index) => (
            <li
              key={tag}
              // The stagger applies only on the way in; leaving, every tag fades out at once.
              style={{ "--tag-delay": `${300 + index * 80}ms` } as CSSProperties}
              className="translate-y-2 opacity-0 transition-[opacity,translate] duration-200 ease-soft group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-(--tag-delay) group-hover:duration-700 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:delay-(--tag-delay) group-focus-visible:duration-700"
            >
              {tag}
            </li>
          ))}
        </ul>
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
