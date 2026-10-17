import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

/* Figma text style "Eyebrow": sits above every section heading. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={cn("text-eyebrow font-medium uppercase", className)}>{children}</p>;
}
