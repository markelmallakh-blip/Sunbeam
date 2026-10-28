"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { mainNavigation, primaryCta } from "@/config/navigation";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { ScheduleOverlay } from "@/components/booking/ScheduleOverlay";
import { cn } from "@/lib/cn";

/*
 * Figma "Header" (101:2267). At the top of the homepage it is transparent on a black-to-clear
 * gradient with white type (90px, 66px logo). It is not sticky: scrolling down slides it away,
 * scrolling up brings it back from the top as a compact solid bar (64px, 40px logo, ink type —
 * "Variant3"). Other pages start solid. "Schedule Meeting" opens the Cal.com booking overlay
 * ("Variant2"): the header stays in view, the logo and links blur and the button becomes ✕.
 */
const TALL = 90;
const COMPACT = 64;

export function Header({ booking }: { booking: ReactNode }) {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const closeBooking = useCallback(() => setBookingOpen(false), []);
  const compact = scrolled;
  const solid = (scrolled || !overHero) && !bookingOpen;

  useEffect(() => {
    let lastY = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Ignore tiny moves so the bar does not flicker; always show it near the top.
      if (y < TALL) setHidden(false);
      else if (y > lastY + 4) setHidden(true);
      else if (y < lastY - 4) setHidden(false);
      if (Math.abs(y - lastY) > 4 || y < TALL) lastY = y;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      {/* The header is fixed; inner pages keep its height free so content starts below it. */}
      {!overHero && <div aria-hidden style={{ height: TALL }} />}
      <header
        style={{ height: compact ? COMPACT : TALL }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[height,transform,background-color,color,box-shadow] duration-500 ease-soft",
          hidden && !bookingOpen && "-translate-y-full",
          solid ? "bg-white text-ink shadow-[0_1px_0_var(--color-hairline)]" : "text-white",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-b from-black from-[7%] to-transparent transition-opacity duration-500 ease-soft",
            solid || bookingOpen ? "opacity-0" : "opacity-100",
          )}
        />
        <div className="relative grid h-full grid-cols-[1fr_auto] items-center gap-6 px-edge lg:grid-cols-[1fr_auto_1fr]">
          <Link
            href="/"
            aria-label="Sunbeam Spaces — home"
            className={cn(
              "w-fit transition-[filter] duration-500",
              bookingOpen && "pointer-events-none blur-[11px]",
            )}
          >
            <Logo
              decorative
              className={cn(
                "w-auto transition-[height] duration-500 ease-soft",
                compact ? "h-10" : "h-12 lg:h-[4.125rem]",
              )}
            />
          </Link>

          <nav
            aria-label="Main"
            className={cn(
              "hidden transition-[filter] duration-500 lg:block",
              bookingOpen && "pointer-events-none blur-[11px]",
            )}
          >
            <ul className="flex items-center gap-6">
              {mainNavigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="link-underline flex items-center gap-0.5 text-small font-medium tracking-[1px] uppercase"
                  >
                    {item.label}
                    {item.menu && <Icon name="arrow-down" size={20} />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              aria-expanded={bookingOpen}
              aria-controls="schedule-meeting"
              aria-label={bookingOpen ? "Close booking" : undefined}
              onClick={() => setBookingOpen((open) => !open)}
              className="hidden items-center gap-2.5 text-small font-medium tracking-[1px] uppercase transition-opacity duration-300 hover:opacity-70 sm:flex"
            >
              {bookingOpen ? (
                <Icon name="close" size={20} />
              ) : (
                <>
                  <Icon name="calendar" size={20} />
                  {primaryCta.label}
                </>
              )}
            </button>
            <MobileNavigation />
          </div>
        </div>
      </header>
      <ScheduleOverlay open={bookingOpen} onClose={closeBooking} top={compact ? COMPACT : TALL}>
        {booking}
      </ScheduleOverlay>
    </>
  );
}
