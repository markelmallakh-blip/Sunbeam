import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { projectHref, projectTags, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";

/*
 * Figma "Project Card" (184:1815), Default → Hover. At rest the photo fills the card; on hover
 * (desktop) it becomes a framed thumbnail on a light grey mount with the tags rising in beneath.
 * Two hover motions are kept for now so the client can compare them (ProjectsExplorer switches):
 * - "frame": the photo's edges ease in to the thumbnail while the photo settles back a touch, like
 *   a print sliding into a passe-partout. One slow continuous motion.
 * - "flip": after the Madinet Masr "tilting card" in reverse. Only the thumbnail's area turns over:
 *   its back face is that exact crop of the full photo, so the turn starts seamlessly, and the rest
 *   of the photo fades to the grey mount.
 * - "zoom": the classic card — tags in a line above the title on every screen, and the photo
 *   simply zooms in a little on hover.
 * Smaller screens have no hover, so they keep the tags in a line above the title. ProjectsExplorer
 * scrubs a `--parallax` percentage on each frame that every photo layer drifts by, which keeps the
 * flip's crop in register with the full photo.
 */
export type CardHover = "frame" | "flip" | "zoom";

/* The thumbnail box from Figma's hover variant, as insets of the card in %. */
const THUMB = { top: 5.36, side: 6.03, bottom: 31.43 };
const thumbWidth = 100 - THUMB.side * 2;
const thumbHeight = 100 - THUMB.top - THUMB.bottom;

/* The full photo layer, re-expressed in thumbnail units so the flip's back face lines up with it. */
const backLayer: CSSProperties = {
  left: `${(-THUMB.side / thumbWidth) * 100}%`,
  width: `${(100 / thumbWidth) * 100}%`,
  top: `${((-THUMB.top - 6) / thumbHeight) * 100}%`,
  height: `${(112 / thumbHeight) * 100}%`,
};

const drift = "translate-y-[calc(var(--parallax,0)*1%)]";
const SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw";

export function ProjectGridCard({
  project,
  hover = "frame",
}: {
  project: Project;
  hover?: CardHover;
}) {
  const tags = projectTags(project);
  return (
    <Link href={projectHref(project.slug)} className="group flex flex-col gap-5">
      <div data-parallax-frame className="relative aspect-[448/560] overflow-hidden bg-mist">
        {hover === "zoom" ? (
          <div className={cn("absolute inset-x-0 -top-[6%] h-[112%]", drift)}>
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes={SIZES}
              className="object-cover transition-transform duration-1000 ease-soft group-hover:scale-105"
            />
          </div>
        ) : hover === "frame" ? (
          <div className="absolute inset-0 transition-[clip-path] duration-1000 ease-soft [clip-path:inset(0)] lg:group-hover:[clip-path:inset(5.36%_6.03%_31.43%_6.03%)] lg:group-focus-visible:[clip-path:inset(5.36%_6.03%_31.43%_6.03%)]">
            <div className={cn("absolute inset-x-0 -top-[6%] h-[112%]", drift)}>
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
        ) : (
          <>
            <div className="absolute inset-0 transition-opacity duration-500 ease-soft lg:group-hover:opacity-0 lg:group-focus-visible:opacity-0">
              <div className={cn("absolute inset-x-0 -top-[6%] h-[112%]", drift)}>
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  fill
                  sizes={SIZES}
                  className="object-cover"
                />
              </div>
            </div>
            <div
              aria-hidden
              style={{
                top: `${THUMB.top}%`,
                left: `${THUMB.side}%`,
                right: `${THUMB.side}%`,
                bottom: `${THUMB.bottom}%`,
              }}
              className="absolute hidden perspective-[80rem] lg:block"
            >
              <div className="relative size-full rotate-x-180 transition-transform duration-700 ease-soft transform-3d group-hover:rotate-x-0 group-focus-visible:rotate-x-0">
                <div className="absolute inset-0 overflow-hidden backface-hidden">
                  <Image
                    src={project.cover.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 26vw, 1px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 rotate-x-180 overflow-hidden backface-hidden">
                  <div style={backLayer} className={cn("absolute", drift)}>
                    <Image
                      src={project.cover.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, 1px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {hover !== "zoom" && (
          <ul className="absolute bottom-6 left-6 hidden flex-col gap-[1.125rem] text-body font-medium tracking-[1.2px] text-slate uppercase lg:flex">
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
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <p
          className={cn(
            "flex flex-wrap items-center gap-2 text-caption font-medium tracking-[1.2px] text-slate uppercase",
            hover !== "zoom" && "lg:hidden",
          )}
        >
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
