import type { SVGProps } from "react";
import { WINDOW_VIEWBOX, windowCells } from "@/lib/window-shape";

type WindowShapeProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Pane indexes to draw (row by row, 0–29). Defaults to the full grid. */
  panes?: readonly number[];
  /** Class applied to every pane path — use it for fills, strokes or animation hooks. */
  paneClassName?: string;
  title?: string;
};

/* The Sunbeam "window shape" — the whole 5 × 6 grid or any subset of its panes. */
export function WindowShape({ panes, paneClassName, title, ...props }: WindowShapeProps) {
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };
  const visible = panes ?? windowCells.map((_, index) => index);

  return (
    <svg
      viewBox={`0 0 ${WINDOW_VIEWBOX.width} ${WINDOW_VIEWBOX.height}`}
      fill="currentColor"
      {...a11y}
      {...props}
    >
      {visible.map((index) => {
        const cell = windowCells[index];
        return cell ? (
          <path key={index} d={cell.d} data-pane={index} className={paneClassName} />
        ) : null;
      })}
    </svg>
  );
}
