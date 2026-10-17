"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { fullPaneIndexes, windowPaneMask } from "@/lib/window-shape";
import { WindowShape } from "@/components/brand/WindowShape";
import { smoothScroll } from "@/lib/smooth-scroll";
import { withoutBase } from "@/lib/base-path";

type Box = { x: number; y: number; width: number; height: number };

const ZOOM = 1.6; // how far a pane is scaled past the viewport so its edges are off-screen
const ARRIVAL_TIMEOUT = 5000;

/* Leave from one pane and arrive through a neighbouring one, chosen per route. */
function panesFor(from: string, to: string): [number, number] {
  const hash = (value: string) => [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const count = fullPaneIndexes.length;
  const leave = hash(from) % count;
  const enter = (leave + 1 + (hash(to) % (count - 1))) % count;
  return [fullPaneIndexes[leave] ?? 0, fullPaneIndexes[enter] ?? 1];
}

function paneBox(svg: SVGSVGElement, pane: number, shell: HTMLElement): Box {
  const rect = svg.querySelector(`[data-pane="${pane}"]`)?.getBoundingClientRect();
  const origin = shell.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0, width: 0, height: 0 };
  return {
    x: rect.left - origin.left,
    y: rect.top - origin.top,
    width: rect.width,
    height: rect.height,
  };
}

/* The pane scaled around its centre until it covers the whole viewport. */
function coverBox(pane: Box, shell: HTMLElement): Box {
  const scale = Math.max(window.innerWidth / pane.width, window.innerHeight / pane.height) * ZOOM;
  const origin = shell.getBoundingClientRect();
  const width = pane.width * scale;
  const height = pane.height * scale;
  return {
    x: window.innerWidth / 2 - origin.left - width / 2,
    y: window.innerHeight / 2 - origin.top - height / 2,
    width,
    height,
  };
}

function applyMask(shell: HTMLElement, box: Box) {
  const size = `${box.width}px ${box.height}px`;
  const position = `${box.x}px ${box.y}px`;
  shell.style.maskSize = size;
  shell.style.maskPosition = position;
  shell.style.setProperty("-webkit-mask-size", size);
  shell.style.setProperty("-webkit-mask-position", position);
}

function setMaskImage(shell: HTMLElement, pane: number | null) {
  const image = pane === null ? "" : windowPaneMask(pane);
  shell.style.maskImage = image;
  shell.style.maskRepeat = pane === null ? "" : "no-repeat";
  shell.style.setProperty("-webkit-mask-image", image);
  shell.style.setProperty("-webkit-mask-repeat", pane === null ? "" : "no-repeat");
  if (pane === null) {
    shell.style.maskSize = shell.style.maskPosition = "";
    shell.style.removeProperty("-webkit-mask-size");
    shell.style.removeProperty("-webkit-mask-position");
  }
}

function tweenBox(shell: HTMLElement, from: Box, to: Box, vars: gsap.TweenVars) {
  const state = { ...from };
  return new Promise<void>((resolve) => {
    gsap.to(state, {
      ...to,
      ...vars,
      onUpdate: () => applyMask(shell, state),
      onComplete: resolve,
    });
  });
}

/* A pane collapsed to a vertical line at its centre — the "folded" state. */
const folded = (box: Box): Box => ({ ...box, x: box.x + box.width / 2, width: 0 });

/**
 * Accordion-style page transition built on the window shape: the current page shrinks into
 * one pane, the pane folds shut, then a neighbouring pane unfolds with the next page and grows
 * back to full screen. Same-page anchors, new tabs and reduced motion use normal navigation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<SVGSVGElement>(null);
  const running = useRef(false);
  const arrival = useRef<(() => void) | null>(null);

  useEffect(() => {
    arrival.current?.();
    arrival.current = null;
  }, [pathname]);

  const navigate = useCallback(
    async (href: string, to: string) => {
      const shell = shellRef.current;
      const overlay = overlayRef.current;
      const shape = shapeRef.current;
      if (!shell || !overlay || !shape) return router.push(href);

      running.current = true;
      router.prefetch(href);
      const [leavePane, enterPane] = panesFor(window.location.pathname, to);
      const panes = shape.querySelectorAll("[data-pane]");
      const root = document.documentElement;
      root.style.overflow = "hidden";
      smoothScroll.get()?.stop();

      gsap.set(overlay, { autoAlpha: 1 });
      gsap.fromTo(
        panes,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, stagger: { amount: 0.2, from: leavePane } },
      );

      // Leave: page shrinks into its pane, then the pane folds shut.
      setMaskImage(shell, leavePane);
      const leaveBox = paneBox(shape, leavePane, shell);
      await tweenBox(shell, coverBox(leaveBox, shell), leaveBox, {
        duration: 0.6,
        ease: "power4.inOut",
      });
      await tweenBox(shell, leaveBox, folded(leaveBox), { duration: 0.22, ease: "power3.in" });

      // Swap routes while the page is fully hidden.
      const arrived = new Promise<void>((resolve) => {
        arrival.current = resolve;
        window.setTimeout(resolve, ARRIVAL_TIMEOUT);
      });
      router.push(href, { scroll: false });
      await arrived;
      const anchorTarget =
        to !== href && href.includes("#")
          ? document.getElementById(href.split("#")[1] ?? "")
          : null;
      const targetTop = anchorTarget
        ? anchorTarget.getBoundingClientRect().top + window.scrollY - 71
        : 0;
      smoothScroll.to(targetTop, true);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      // Enter: the next pane unfolds with the new page, then opens to full screen.
      setMaskImage(shell, enterPane);
      const enterBox = paneBox(shape, enterPane, shell);
      applyMask(shell, folded(enterBox));
      await tweenBox(shell, folded(enterBox), enterBox, { duration: 0.25, ease: "power3.out" });
      gsap.to(panes, { opacity: 0, duration: 0.3, stagger: { amount: 0.15, from: enterPane } });
      await tweenBox(shell, enterBox, coverBox(enterBox, shell), {
        duration: 0.6,
        ease: "power4.inOut",
      });

      setMaskImage(shell, null);
      gsap.set(overlay, { autoAlpha: 0 });
      root.style.overflow = "";
      smoothScroll.get()?.start();
      running.current = false;
    },
    [router],
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname)
        return;
      if (reduceMotion && !running.current) return;

      event.preventDefault();
      // Link hrefs carry the base path; the router adds it back itself.
      const path = withoutBase(url.pathname);
      if (!running.current) void navigate(path + url.search + url.hash, path);
    };
    // Capture phase runs before next/link's handler, which then sees `defaultPrevented`.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate, reduceMotion]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        className="invisible fixed inset-0 z-0 grid place-items-center bg-white opacity-0"
      >
        <WindowShape ref={shapeRef} className="h-[min(48svh,70vw)] w-auto text-ink" />
      </div>
      <div ref={shellRef} className="relative z-[1] bg-white">
        {children}
      </div>
    </>
  );
}
