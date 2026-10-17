"use client";

import type { ReactNode } from "react";
import { LoopSlider } from "@/components/ui/LoopSlider";
import { Icon } from "@/components/ui/Icon";
import { SliderProgress } from "@/components/ui/SliderProgress";

export function TestimonialsSlider({ children }: { children: ReactNode }) {
  return (
    <LoopSlider
      label="Client testimonials"
      gap={0}
      inactiveScale={1}
      inactiveOpacity={0.35}
      slideClassName="w-[88vw] lg:w-[51.25rem]"
      controls={({ index, count, go, progress }) => (
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid size-11 place-items-center hover:text-rust disabled:opacity-30"
          >
            <Icon name="arrow-left" size={20} />
          </button>
          <SliderProgress progress={progress} className="w-36" />
          <p className="sr-only" aria-live="polite">
            Testimonial {index + 1} of {count}
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid size-11 place-items-center hover:text-rust disabled:opacity-30"
          >
            <Icon name="arrow-right" size={20} />
          </button>
        </div>
      )}
    >
      {children}
    </LoopSlider>
  );
}
