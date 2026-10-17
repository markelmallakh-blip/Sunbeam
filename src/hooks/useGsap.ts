"use client";

import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

type GsapSetup = (context: { reduceMotion: boolean }) => void | (() => void);

/**
 * Runs GSAP code scoped to `scope` (selector strings only match inside it) and reverts every
 * tween and ScrollTrigger created inside on unmount or when `deps` change.
 * The setup re-runs when the reduced-motion preference changes.
 */
export function useGsap(
  setup: GsapSetup,
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return;
    const mm = gsap.matchMedia(scope.current);
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        motionOk: "(prefers-reduced-motion: no-preference)",
      },
      (context) => setup({ reduceMotion: Boolean(context.conditions?.reduceMotion) }),
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callers own the dependency list, like useEffect.
  }, deps);
}
