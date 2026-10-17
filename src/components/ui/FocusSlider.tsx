"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Children,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { duration, easeSoft } from "@/lib/motion";

type FocusSliderProps = {
  children: ReactNode;
  label: string;
  /** Slide width classes; every slide shares one width so the active slide can be centred. */
  slideClassName: string;
  /** Gap between slides in px. */
  gap?: number;
  /** Scale and opacity of the slides beside the active one. */
  inactiveScale?: number;
  inactiveOpacity?: number;
  /** Slide shown first — use 1 so a neighbour peeks in on both sides. */
  initialIndex?: number;
  /**
   * Scroll-driven mode: a continuous slide position (0 = first slide, 1.5 = halfway between the
   * second and third) owned by the parent. The track follows it frame by frame, without easing.
   */
  position?: MotionValue<number>;
  /** Scroll-driven mode: called when a neighbour is clicked or an arrow key is pressed. */
  onRequestIndex?: (index: number) => void;
  /**
   * Where the active slide sits: centred by default, or at the offset (px from the viewport's
   * left edge) this returns — e.g. aligned with the section heading. Re-read on resize.
   */
  alignTo?: (viewport: HTMLElement) => number;
  /** Render-prop for controls (arrows, progress) below the track. */
  controls?: (state: {
    index: number;
    count: number;
    go: (step: number) => void;
    /** 0 → 1 across the whole slider, continuous while scrolling. */
    progress: MotionValue<number>;
  }) => ReactNode;
};

/*
 * Centred slider used by "Selected work" and the testimonials: the active slide sits in the
 * middle at full size, its neighbours peek in scaled down. Everything is derived from one motion
 * value (the slide position), so a scroll-driven slider and an eased click/drag slider share the
 * same rendering.
 */
export function FocusSlider({
  children,
  label,
  slideClassName,
  gap = 60,
  inactiveScale = 0.75,
  inactiveOpacity = 0.5,
  initialIndex = 0,
  position: externalPosition,
  onRequestIndex,
  alignTo,
  controls,
}: FocusSliderProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const start = Math.min(initialIndex, Math.max(0, count - 1));
  const ownPosition = useMotionValue(start);
  const position = externalPosition ?? ownPosition;
  const [index, setIndex] = useState(start);
  const center = useMotionValue(0);
  const stepSize = useMotionValue(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstSlideRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useMotionValueEvent(position, "change", (value) => {
    const rounded = Math.min(count - 1, Math.max(0, Math.round(value)));
    if (rounded !== index) setIndex(rounded);
  });

  const go = useCallback(
    (step: number) => {
      const next = Math.min(count - 1, Math.max(0, index + step));
      if (externalPosition) {
        onRequestIndex?.(next);
        return;
      }
      setIndex(next);
      animate(
        ownPosition,
        next,
        reduceMotion ? { duration: 0 } : { duration: duration.slow, ease: easeSoft },
      );
    },
    [count, index, externalPosition, onRequestIndex, ownPosition, reduceMotion],
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const slide = firstSlideRef.current;
    if (!viewport || !slide) return;
    const width = slide.offsetWidth;
    center.set(alignTo ? alignTo(viewport) : viewport.clientWidth / 2 - width / 2);
    stepSize.set(width + gap);
  }, [gap, center, stepSize, alignTo]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const x = useTransform(() => center.get() - position.get() * stepSize.get());
  const progress = useTransform(position, (value) => (count > 1 ? value / (count - 1) : 1));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  return (
    <div className="flex flex-col gap-10">
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="overflow-hidden"
      >
        <motion.div
          className={cn(!externalPosition && "cursor-grab active:cursor-grabbing")}
          drag={externalPosition ? false : "x"}
          dragElastic={0.15}
          dragConstraints={{ left: 0, right: 0 }}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
        >
          <motion.div className="flex items-end" style={{ gap, x }}>
            {slides.map((slide, slideIndex) => (
              <Slide
                key={slideIndex}
                ref={slideIndex === 0 ? firstSlideRef : undefined}
                slideIndex={slideIndex}
                count={count}
                active={slideIndex === index}
                position={position}
                inactiveScale={inactiveScale}
                inactiveOpacity={inactiveOpacity}
                className={slideClassName}
                onSelect={() => go(slideIndex - index)}
              >
                {slide}
              </Slide>
            ))}
          </motion.div>
        </motion.div>
      </div>
      {controls?.({ index, count, go, progress })}
    </div>
  );
}

export type SlideProps = {
  ref?: React.Ref<HTMLDivElement>;
  /** Horizontal offset for absolutely positioned slides (LoopSlider). */
  x?: MotionValue<number>;
  slideIndex: number;
  count: number;
  active: boolean;
  position: MotionValue<number>;
  inactiveScale: number;
  inactiveOpacity: number;
  className: string;
  onSelect: () => void;
  children: ReactNode;
};

/* Scale and fade follow the slide's distance from the centre, so transitions are continuous. */
export function Slide({
  ref,
  x,
  slideIndex,
  count,
  active,
  position,
  inactiveScale,
  inactiveOpacity,
  className,
  onSelect,
  children,
}: SlideProps) {
  const distance = useTransform(position, (value) => Math.min(1, Math.abs(slideIndex - value)));
  const scale = useTransform(distance, [0, 1], [1, inactiveScale]);
  const opacity = useTransform(distance, [0, 1], [1, inactiveOpacity]);
  const originX = useTransform(position, (value) => (slideIndex < value ? 1 : 0));

  return (
    <motion.div
      ref={ref}
      aria-roledescription="slide"
      aria-label={`${slideIndex + 1} of ${count}`}
      data-active={active}
      className={cn(
        "group/slide",
        x ? "absolute inset-y-0 left-0 [&>div]:h-full" : "relative",
        "shrink-0",
        className,
      )}
      style={{ scale, opacity, originX, originY: 1, x }}
    >
      <div inert={!active}>{children}</div>
      {!active && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Show slide ${slideIndex + 1}`}
          onClick={onSelect}
          className="absolute inset-0 cursor-pointer"
        />
      )}
    </motion.div>
  );
}
