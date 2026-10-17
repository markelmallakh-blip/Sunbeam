"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState, type HTMLAttributes, type PointerEvent, type ReactNode, type Ref } from "react";
import { cn } from "@/lib/cn";

type CursorDiscProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Content of the disc that replaces the mouse cursor (e.g. "Explore", "‹ Drag ›"). */
  disc: ReactNode;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

/*
 * Area whose mouse cursor becomes a 101px ink disc that follows the pointer on a soft spring
 * (Figma cursor components). Touch and keyboard users never see it. Extra props (click handlers,
 * pointer handlers) pass through to the area.
 */
export function CursorDisc({
  disc,
  children,
  className,
  ref,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: CursorDiscProps) {
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 35, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 350, damping: 35, mass: 0.6 });

  /* The disc is fixed to the viewport, so it is never clipped by overflow on the area. */
  const place = (event: PointerEvent<HTMLDivElement>, jump: boolean) => {
    const method = jump ? "jump" : "set";
    x[method](event.clientX);
    y[method](event.clientY);
  };

  return (
    <div
      {...props}
      ref={ref}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType !== "mouse") return;
        place(event, true);
        setHovering(true);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.pointerType === "mouse") place(event, false);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setHovering(false);
      }}
      className={cn(
        "relative [@media(pointer:fine)]:cursor-none [@media(pointer:fine)]:[&_*]:cursor-none",
        className,
      )}
    >
      {children}
      <AnimatePresence>
        {hovering && (
          <motion.span
            aria-hidden
            className="pointer-events-none fixed top-0 left-0 z-50 -mt-[3.15rem] -ml-[3.15rem] grid size-[6.3rem] place-items-center rounded-full bg-ink/70 text-small text-white backdrop-blur-sm"
            style={{ x: springX, y: springY }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {disc}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
