"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * A <figure> that carries `data-inview` while most of it is on screen, so touch screens (which
 * have no hover) can show the same reveal as a hover with `group-data-inview:` classes.
 */
export function InViewFigure({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) el.toggleAttribute("data-inview", entry.isIntersecting);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={ref} className={className}>
      {children}
    </figure>
  );
}
