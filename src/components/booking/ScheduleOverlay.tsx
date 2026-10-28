"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { smoothScroll } from "@/lib/smooth-scroll";
import { duration, easeSoft } from "@/lib/motion";

type ScheduleOverlayProps = {
  open: boolean;
  onClose: () => void;
  /** Current header height in px: the panel drops in right below it. */
  top: number;
  /** The booking embed; rendered only while open so the iframe loads on demand. */
  children: ReactNode;
};

/*
 * Figma Header "Variant2" (101:2268): the page dims to 80% black under the header and the
 * Cal.com booking panel (890 × 533, 12px corners) drops in under the "Schedule Meeting" button.
 * Escape, the backdrop or the header's close button dismiss it; page scrolling pauses meanwhile.
 */
export function ScheduleOverlay({ open, onClose, top, children }: ScheduleOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const lenis = smoothScroll.get();
    const previousOverflow = document.body.style.overflow;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            aria-hidden
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast, ease: easeSoft }}
          />
          <motion.div
            key="panel"
            ref={panelRef}
            id="schedule-meeting"
            role="dialog"
            aria-modal="true"
            aria-label="Schedule a meeting"
            tabIndex={-1}
            data-lenis-prevent
            style={{ top, maxHeight: `calc(100dvh - ${top + 16}px)` }}
            className="fixed right-4 left-4 z-50 overflow-auto rounded-xl bg-white outline-none sm:left-auto sm:w-[55.625rem] sm:max-w-[calc(100vw-2rem)] lg:right-8"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: duration.base, ease: easeSoft }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
