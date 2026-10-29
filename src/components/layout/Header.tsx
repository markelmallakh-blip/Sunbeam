"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { mainNavigation, primaryCta, type MenuKey } from "@/config/navigation";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { HeaderMenu } from "@/components/navigation/HeaderMenu";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { ScheduleOverlay } from "@/components/booking/ScheduleOverlay";
import { cn } from "@/lib/cn";
import { duration, easeSoft } from "@/lib/motion";

/*
 * Figma "Header" (101:2267). At the top of the homepage it is transparent on a black-to-clear
 * gradient with white type (90px, 66px logo). It is not sticky: scrolling down glides it up out
 * of view, scrolling up glides it back in from the top as a compact bar (64px, 40px logo). It
 * stays transparent while over the hero photo and turns solid white with ink type ("Variant3")
 * once past it. Other pages start solid. "Services" and "Projects" open their dropdowns (Figma
 * "Services menu" / "Projects menu") on hover or click: the header turns solid, the page dims to
 * 60% black and the open item's chevron becomes a minus. "Schedule Meeting" opens the Cal.com
 * booking overlay ("Variant2"): the header stays in view, the logo and links blur and the button
 * becomes ✕.
 */
const TALL = 90;
const COMPACT = 64;
/* Grace period before a hover-opened menu closes, so the pointer can travel into the panel. */
const HOVER_CLOSE_DELAY = 160;

export function Header({ booking }: { booking: ReactNode }) {
  const pathname = usePathname();
  // Pages that open on a full-bleed photo: the homepage and each project.
  const overHero = pathname === "/" || /^\/projects\/[^/]+\/?$/.test(pathname);
  const [scrolled, setScrolled] = useState(false);
  // Past the full-bleed hero photo: only then does the header turn solid white on hero pages.
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  // The open menu is remembered with the page it was opened on, so navigating closes it.
  const [menuState, setMenuState] = useState<{ menu: MenuKey; path: string } | null>(null);
  const openMenu = menuState?.path === pathname ? menuState.menu : null;
  const setOpenMenu = useCallback(
    (menu: MenuKey | null) => setMenuState(menu ? { menu, path: pathname } : null),
    [pathname],
  );
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeBooking = useCallback(() => setBookingOpen(false), []);
  const closeMenu = useCallback(() => setOpenMenu(null), [setOpenMenu]);
  const compact = scrolled;
  const solid = ((pastHero || !overHero) && !bookingOpen) || openMenu !== null;
  const height = compact ? COMPACT : TALL;

  useEffect(() => {
    let lastY = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Stay transparent while the header still sits over the hero, so scrolling back up never
      // shows a white bar on top of the photo.
      setPastHero(y > window.innerHeight - TALL);
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

  useEffect(() => {
    if (!openMenu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openMenu, setOpenMenu]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), HOVER_CLOSE_DELAY);
  };
  const openOnHover = (menu: MenuKey) => {
    if (bookingOpen || !window.matchMedia("(hover: hover)").matches) return;
    cancelClose();
    setOpenMenu(menu);
  };

  return (
    <>
      {/* The header is fixed; inner pages keep its height free so content starts below it. */}
      {!overHero && <div aria-hidden style={{ height: TALL }} />}

      <AnimatePresence>
        {openMenu && (
          <motion.div
            key="menu-wash"
            aria-hidden
            onClick={closeMenu}
            className="fixed inset-0 z-40 hidden bg-black/60 lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast, ease: easeSoft }}
          />
        )}
      </AnimatePresence>

      <header
        style={{ height }}
        onMouseLeave={openMenu ? scheduleClose : undefined}
        onMouseEnter={openMenu ? cancelClose : undefined}
        className={cn(
          // Tailwind's translate utilities set `translate`, so that is the property to animate.
          "fixed inset-x-0 top-0 z-50 transition-[height,translate,background-color,color,box-shadow] duration-700 ease-soft",
          hidden && !bookingOpen && !openMenu && "-translate-y-full",
          solid ? "bg-white text-ink shadow-[0_1px_0_var(--color-mist)]" : "text-white",
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
              "hidden h-full transition-[filter] duration-500 lg:block",
              bookingOpen && "pointer-events-none blur-[11px]",
            )}
          >
            {/*
             * No gaps between items: each one carries its spacing as side padding and fills the
             * header's height, so moving from Services to Projects never crosses dead space that
             * would start closing the open menu.
             */}
            <ul className="flex h-full items-stretch">
              {mainNavigation.map((item) => {
                const itemClass =
                  "link-underline flex items-center gap-0.5 text-small font-medium tracking-[1px] uppercase";
                if (!item.menu) {
                  return (
                    <li key={item.label} className="flex items-center px-3">
                      <Link href={item.href} className={itemClass}>
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const menu = item.menu;
                const open = openMenu === menu;
                return (
                  <li
                    key={item.label}
                    className="flex items-center px-3"
                    onMouseEnter={() => openOnHover(menu)}
                    onMouseLeave={scheduleClose}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls="header-menu"
                      onClick={() => {
                        cancelClose();
                        setBookingOpen(false);
                        setOpenMenu(open ? null : menu);
                      }}
                      className={itemClass}
                    >
                      {item.label}
                      <Icon name={open ? "minus" : "arrow-down"} size={20} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              aria-expanded={bookingOpen}
              aria-controls="schedule-meeting"
              aria-label={bookingOpen ? "Close booking" : undefined}
              onClick={() => {
                setOpenMenu(null);
                setBookingOpen((open) => !open);
              }}
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

        <AnimatePresence>
          {openMenu && (
            <motion.div
              // One shell for both menus: switching between Services and Projects keeps the
              // white panel in place and only cross-fades its contents (see MenuPanel).
              key="header-menu"
              id="header-menu"
              data-lenis-prevent
              // The pointer is already inside the header, so its onMouseEnter never fires when
              // moving from a nav item down into the panel; cancel the item's pending close here.
              onMouseEnter={cancelClose}
              className="absolute inset-x-0 top-full hidden max-h-[calc(100svh-100%)] overflow-y-auto border-t border-mist bg-white text-ink lg:block"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: duration.fast, ease: easeSoft }}
            >
              <MenuPanel menu={openMenu} onNavigate={closeMenu} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ScheduleOverlay open={bookingOpen} onClose={closeBooking} top={height}>
        {booking}
      </ScheduleOverlay>
    </>
  );
}

/*
 * The open dropdown's contents. Its height glides to fit whichever menu is showing, and on a
 * switch the new menu simply fades in (CSS @starting-style) — the panel itself never closes,
 * so hovering from Services to Projects reads as one continuous surface.
 */
function MenuPanel({ menu, onNavigate }: { menu: MenuKey; onNavigate: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setHeight(entry.contentRect.height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="overflow-hidden"
      initial={false}
      animate={{ height }}
      transition={{ duration: 0.45, ease: easeSoft }}
    >
      <div ref={contentRef}>
        <div
          key={menu}
          className="transition-[opacity,translate] duration-500 ease-soft starting:translate-y-1 starting:opacity-0"
        >
          <HeaderMenu menu={menu} onNavigate={onNavigate} />
        </div>
      </div>
    </motion.div>
  );
}
