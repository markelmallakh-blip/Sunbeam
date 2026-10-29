"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import type { ImageAsset } from "@/types/media";
import { cn } from "@/lib/cn";

type RefractionImageProps = {
  image: ImageAsset;
  sizes: string;
  priority?: boolean;
  /** Radius of the clear lens in px (shrinks on narrow images). */
  lensRadius?: number;
  /** Width of one glass flute in px. */
  flute?: number;
  className?: string;
};

/** How much wider than its flute each slice of the photo is (higher = stronger refraction). */
const SQUEEZE = 1.6;
/* Quick, well-damped springs: the lens keeps up with the pointer without overshooting. */
const FOLLOW = { stiffness: 320, damping: 32, mass: 0.6 };
const GROW = { stiffness: 300, damping: 30, mass: 0.6 };

type Size = { width: number; height: number };

/*
 * A photo behind fluted (reeded) glass that clears in a soft round lens around the pointer —
 * after the hero visual on evelienlulofs.nl, drawn in code so it works on any uploaded image.
 * Every flute shows a wider vertical slice of the photo squeezed into its width, like real
 * reeded glass, which stays still. Hovering grows a feathered circle of the clear photo that
 * quickly follows the mouse and fades away on leave; touch shows it under the finger. Reduced
 * motion keeps the glass only.
 *
 * All layers read the same file (unoptimized), so replacing the image updates every layer at once.
 */
export function RefractionImage({
  image,
  sizes,
  priority = false,
  lensRadius = 190,
  flute = 40,
  className,
}: RefractionImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Size | null>(null);
  const [natural, setNatural] = useState<Size>({ width: image.width, height: image.height });
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const radius = useMotionValue(0);
  const springX = useSpring(x, FOLLOW);
  const springY = useSpring(y, FOLLOW);
  const springRadius = useSpring(radius, GROW);

  /* Clear core over most of the lens, with a short feathered rim so its edge reads clearly. */
  const mask = useTransform(
    () =>
      `radial-gradient(circle ${Math.max(springRadius.get(), 0.01)}px at ${springX.get()}px ${springY.get()}px, #000 62%, rgb(0 0 0 / 0.5) 84%, transparent 100%)`,
  );

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setBox({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const place = (event: PointerEvent<HTMLDivElement>, jump: boolean) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    if (jump) {
      x.jump(px);
      y.jump(py);
      springX.jump(px);
      springY.jump(py);
    } else {
      x.set(px);
      y.set(py);
    }
  };
  const show = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !box) return;
    // Enter from where the pointer is, so the lens grows in place instead of sliding in.
    if (springRadius.get() < 1) place(event, true);
    radius.set(Math.min(lensRadius, box.width * 0.24));
  };

  return (
    <div
      ref={ref}
      onPointerEnter={show}
      onPointerDown={show}
      onPointerMove={(event) => {
        if (reduceMotion) return;
        place(event, false);
        if (radius.get() === 0) show(event);
      }}
      onPointerLeave={() => radius.set(0)}
      className={cn("relative touch-pan-y overflow-hidden bg-stone", className)}
    >
      {/* Plain photo: first paint before measuring, and the accessible image. */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        unoptimized
        priority={priority}
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget;
          if (naturalWidth && naturalHeight)
            setNatural({ width: naturalWidth, height: naturalHeight });
        }}
        className="object-cover"
      />
      {box && (
        <div aria-hidden className="absolute inset-0 brightness-[0.94] saturate-[0.8]">
          <Flutes src={image.src} natural={natural} box={box} flute={flute} />
        </div>
      )}
      {box && (
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${image.src}")`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      )}
    </div>
  );
}

/* The reeded glass: one slice of the cover-fitted photo per flute, plus a soft highlight. */
function Flutes({
  src,
  natural,
  box,
  flute,
}: {
  src: string;
  natural: Size;
  box: Size;
  flute: number;
}) {
  const count = Math.ceil(box.width / flute);
  const width = box.width / count;
  // object-fit: cover geometry, so each slice lines up with the clear photo above it.
  const scale = Math.max(box.width / natural.width, box.height / natural.height);
  const coverWidth = natural.width * scale;
  const coverHeight = natural.height * scale;
  const offsetX = (coverWidth - box.width) / 2;
  const offsetY = (coverHeight - box.height) / 2;

  return (
    <div className="flex size-full">
      {Array.from({ length: count }, (_, index) => {
        const centre = index * width + width / 2 + offsetX;
        const position = width / 2 - centre / SQUEEZE;
        return (
          <div
            key={index}
            className="relative h-full shrink-0"
            style={{
              width,
              backgroundImage: `url("${src}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${coverWidth / SQUEEZE}px ${coverHeight}px`,
              backgroundPosition: `${position}px ${-offsetY}px`,
            }}
          >
            <span className="absolute inset-0 bg-[linear-gradient(90deg,rgb(255_255_255/0.24),transparent_32%,transparent_68%,rgb(0_0_0/0.16))]" />
          </div>
        );
      })}
    </div>
  );
}
