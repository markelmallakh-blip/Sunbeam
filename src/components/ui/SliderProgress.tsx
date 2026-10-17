"use client";

import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

type SliderProgressProps = {
  /** 0 → 1 through the slider; the black bar fills the track as it grows. */
  progress: MotionValue<number>;
  className?: string;
};

/* Thin grey track that fills with ink from the left as the slider advances. */
export function SliderProgress({ progress, className }: SliderProgressProps) {
  return (
    <div aria-hidden className={cn("relative h-0.5 overflow-hidden bg-rule", className)}>
      <motion.span className="absolute inset-0 origin-left bg-ink" style={{ scaleX: progress }} />
    </div>
  );
}
