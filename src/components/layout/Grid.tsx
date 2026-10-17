import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const columns = {
  2: "md:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  12: "md:grid-cols-12",
} as const;

type GridProps = ComponentPropsWithoutRef<"div"> & {
  cols?: keyof typeof columns;
};

/* Mobile-first grid: one column, expanding at the breakpoints above. */
export function Grid({ cols = 12, className, ...props }: GridProps) {
  return <div className={cn("grid gap-x-6 gap-y-10", columns[cols], className)} {...props} />;
}
