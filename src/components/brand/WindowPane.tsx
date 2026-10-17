import type { ComponentPropsWithoutRef } from "react";
import { windowPaneMask } from "@/lib/window-shape";
import { cn } from "@/lib/cn";

type WindowPaneProps = ComponentPropsWithoutRef<"div"> & {
  /** Which pane of the window shape to cut the content to (0–29). */
  pane: number;
};

/* Masks any content (image, video, color block) to the outline of one window pane. */
export function WindowPane({ pane, className, style, ...props }: WindowPaneProps) {
  const mask = windowPaneMask(pane);
  return (
    <div
      className={cn("[mask-size:100%_100%] [mask-repeat:no-repeat]", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask, ...style }}
      {...props}
    />
  );
}
