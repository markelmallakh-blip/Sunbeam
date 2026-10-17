"use client";

import {
  animate,
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
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { duration, easeSoft } from "@/lib/motion";
import { CursorDisc } from "./CursorDisc";
import { Slide } from "./FocusSlider";
import { Icon } from "./Icon";

type LoopSliderProps = {
  children: ReactNode;
  label: string;
  /** Width classes shared by every slide. */
  slideClassName: string;
  gap?: number;
  inactiveScale?: number;
  inactiveOpacity?: number;
  /** Seconds between automatic advances; 0 turns autoplay off. */
  autoplay?: number;
  controls?: (state: {
    index: number;
    count: number;
    go: (step: number) => void;
    /** Fills 1/n per slide and wraps back after the last one. */
    progress: MotionValue<number>;
  }) => ReactNode;
};

const WINDOW = 2; // slides rendered on each side of the centre

const wrap = (value: number, count: number) => ((value % count) + count) % count;

/*
 * Endless centred slider: the position is an unbounded number and only a small window of
 * slides around it is rendered, each absolutely placed, so moving past the last slide simply
 * continues with the first — no rewind. Autoplay advances on a timer and pauses on hover, focus,
 * a hidden tab or reduced motion.
 */
export function LoopSlider({
  children,
  label,
  slideClassName,
  gap = 0,
  inactiveScale = 1,
  inactiveOpacity = 0.35,
  autoplay = 5,
  controls,
}: LoopSliderProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const position = useMotionValue(0);
  const target = useMotionValue(0);
  const [base, setBase] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const center = useMotionValue(0);
  const step = useMotionValue(0);

  useMotionValueEvent(position, "change", (value) => {
    const rounded = Math.round(value);
    if (rounded !== base) setBase(rounded);
  });

  const drag = useRef<{ x: number; from: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const go = useCallback(
    (delta: number) => {
      target.set(target.get() + delta);
      animate(
        position,
        target.get(),
        reduceMotion ? { duration: 0 } : { duration: duration.slow, ease: easeSoft },
      );
    },
    [position, target, reduceMotion],
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const sizer = sizerRef.current;
    if (!viewport || !sizer) return;
    center.set(viewport.clientWidth / 2 - sizer.offsetWidth / 2);
    step.set(sizer.offsetWidth + gap);
  }, [center, step, gap]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!autoplay || paused || reduceMotion || count < 2) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") go(1);
    }, autoplay * 1000);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, reduceMotion, count, go]);

  const progress = useTransform(position, (value) => Math.min(1, (wrap(value, count) + 1) / count));

  /* Drag/swipe: the track follows the pointer, then settles on the nearest slide. */
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { x: event.clientX, from: position.get(), moved: false };
    position.stop();
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || !step.get()) return;
    const dx = event.clientX - state.x;
    if (Math.abs(dx) > 6 && !state.moved) {
      state.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (state.moved) position.set(state.from - dx / step.get());
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    suppressClick.current = true;
    const dx = event.clientX - state.x;
    const delta =
      Math.abs(dx) > 60 ? -Math.sign(dx) * Math.max(1, Math.round(Math.abs(dx) / step.get())) : 0;
    target.set(Math.round(target.get()) + delta);
    animate(
      position,
      target.get(),
      reduceMotion ? { duration: 0 } : { duration: duration.base, ease: easeSoft },
    );
  };
  /* A drag that ends over a neighbour must not also select it. */
  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  const virtual = Array.from({ length: WINDOW * 2 + 1 }, (_, i) => base - WINDOW + i);

  return (
    <div className="flex flex-col gap-10">
      <CursorDisc
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="touch-pan-y overflow-hidden select-none"
        disc={
          <span className="flex items-center gap-1.5">
            <Icon name="arrow-left" size={14} strokeWidth={2} />
            Drag
            <Icon name="arrow-right" size={14} strokeWidth={2} />
          </span>
        }
      >
        {/* Invisible stack of every slide: the track takes the tallest one's height and the slide width. */}
        <div aria-hidden inert className="invisible grid">
          {slides.map((slide, i) => (
            <div
              key={i}
              ref={i === 0 ? sizerRef : undefined}
              className={cn("[grid-area:1/1]", slideClassName)}
            >
              {slide}
            </div>
          ))}
        </div>
        {virtual.map((vIndex) => (
          <LoopSlide
            key={vIndex}
            vIndex={vIndex}
            count={count}
            active={vIndex === base}
            position={position}
            center={center}
            step={step}
            inactiveScale={inactiveScale}
            inactiveOpacity={inactiveOpacity}
            className={slideClassName}
            onSelect={() => go(vIndex - base)}
          >
            {slides[wrap(vIndex, count)]}
          </LoopSlide>
        ))}
      </CursorDisc>
      {controls?.({ index: wrap(base, count), count, go, progress })}
    </div>
  );
}

type LoopSlideProps = {
  vIndex: number;
  count: number;
  active: boolean;
  position: MotionValue<number>;
  center: MotionValue<number>;
  step: MotionValue<number>;
  inactiveScale: number;
  inactiveOpacity: number;
  className: string;
  onSelect: () => void;
  children: ReactNode;
};

function LoopSlide({ vIndex, center, step, position, children, ...props }: LoopSlideProps) {
  const x = useTransform(() => center.get() + (vIndex - position.get()) * step.get());
  return (
    <Slide {...props} slideIndex={vIndex} position={position} x={x}>
      {children}
    </Slide>
  );
}
