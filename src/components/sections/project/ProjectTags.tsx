import { Fragment } from "react";
import { cn } from "@/lib/cn";

/* Figma tag pill: categories on a stone chip, split by thin vertical rules. */
export function ProjectTags({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul
      aria-label="Categories"
      className={cn(
        "flex w-fit flex-wrap items-center gap-2 bg-stone px-2 py-0.5 text-small font-medium text-slate",
        className,
      )}
    >
      {tags.map((tag, index) => (
        <Fragment key={tag}>
          {index > 0 && <li aria-hidden className="h-2.5 w-px bg-line/60" />}
          <li>{tag}</li>
        </Fragment>
      ))}
    </ul>
  );
}
