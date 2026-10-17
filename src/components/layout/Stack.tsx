import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const gaps = {
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-10",
  xl: "gap-16",
} as const;

type StackProps = ComponentPropsWithoutRef<"div"> & {
  gap?: keyof typeof gaps;
  align?: "start" | "center" | "end";
};

const alignments = {
  start: "items-start",
  center: "items-center text-center",
  end: "items-end",
} as const;

export function Stack({ gap = "md", align = "start", className, ...props }: StackProps) {
  return (
    <div className={cn("flex flex-col", gaps[gap], alignments[align], className)} {...props} />
  );
}
