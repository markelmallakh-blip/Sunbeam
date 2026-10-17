import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const tones = {
  white: "bg-white text-ink",
  stone: "bg-stone text-ink",
  linen: "bg-linen text-ink",
  ink: "bg-ink text-white",
} as const;

const spacing = {
  default: "py-section",
  compact: "py-section-sm",
  none: "",
} as const;

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  tone?: keyof typeof tones;
  spacing?: keyof typeof spacing;
};

/* Full-width vertical band — every homepage block is one of these (Figma: padding 100/60). */
export function Section({
  tone = "white",
  spacing: space = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("relative scroll-mt-header", tones[tone], spacing[space], className)}
      {...props}
    />
  );
}
