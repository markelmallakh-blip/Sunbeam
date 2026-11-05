"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Lanyard from "./Lanyard/Lanyard";

/* The look of the badge within its own space (the spacer's height). */
const SIZE = 0.55;
const STRAP_LENGTH = 0.45;
/* Lanyard places the card top this fraction of the canvas height down: mix(0.12, 0.42, strap). */
const strapOffset = (strap: number) => 0.12 + 0.3 * strap;

/*
 * The careers hero's hanging studio badge: React Bits' Lanyard (three.js) with the Sunbeam card —
 * the header logo in white on ink at the front, in ink on linen at the back — on a black strap
 * printed with the logo. Visitors can drag, throw and click it to flip.
 *
 * The badge reserves `spacerClassName` of height in the flow, but its canvas fills the whole
 * (relatively positioned) section behind the content, so the card is never cropped while being
 * dragged around. Size and strap are rescaled so the card looks as it would in the spacer alone.
 * Reduced motion stills the breeze and the intro swing (handled inside Lanyard).
 */
export function StudioBadge({
  front,
  back,
  strap,
  spacerClassName,
}: {
  front: string;
  back: string;
  strap: string;
  spacerClassName: string;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      const space = spacer.current?.offsetHeight ?? 0;
      const whole = layer.current?.offsetHeight ?? 0;
      if (space > 0 && whole > 0) setRatio(Math.min(1, space / whole));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (spacer.current) observer.observe(spacer.current);
    if (layer.current) observer.observe(layer.current);
    return () => observer.disconnect();
  }, []);

  const size = Math.round(SIZE * ratio * 1000) / 1000;
  const strapLength =
    Math.round(Math.max(-0.38, (strapOffset(STRAP_LENGTH) * ratio - 0.12) / 0.3) * 1000) / 1000;

  return (
    <>
      <div ref={layer} className="absolute inset-0">
        <Lanyard
          frontImage={front}
          backImage={back}
          strapImage={strap}
          cardColor="#2c2929"
          finish="matte"
          metal="graphite"
          cornerRadius={0.25}
          size={size}
          strapLength={strapLength}
          strapWidth={0.8}
          breeze={0.35}
        />
      </div>
      <div ref={spacer} aria-hidden className={spacerClassName} />
    </>
  );
}
