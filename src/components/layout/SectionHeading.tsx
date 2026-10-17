import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  size?: "h2" | "h3" | "h4";
  id?: string;
  className?: string;
};

/* Eyebrow + Alqest heading + optional intro, as used at the top of each Figma section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  size = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Eyebrow className="text-slate">{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn(
          "font-display text-ink",
          { h2: "text-h2", h3: "text-h3", h4: "text-h4" }[size],
        )}
      >
        {title}
      </h2>
      {description && (
        <div
          className={cn("mt-3 max-w-[26rem] text-body text-slate", align === "center" && "mx-auto")}
        >
          {description}
        </div>
      )}
    </div>
  );
}
