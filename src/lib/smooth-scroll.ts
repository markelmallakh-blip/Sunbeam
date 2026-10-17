import type Lenis from "lenis";

/* The active Lenis instance (null on the server, with reduced motion, or before mount). */
let instance: Lenis | null = null;

export const smoothScroll = {
  get: () => instance,
  set: (lenis: Lenis | null) => {
    instance = lenis;
  },
  /** Jump or glide to a position, falling back to native scrolling when Lenis is off. */
  to: (top: number, immediate = false) => {
    if (instance) instance.scrollTo(top, { immediate, force: true });
    else window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
  },
};
