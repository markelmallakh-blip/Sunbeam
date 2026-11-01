"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { mainNavigation, primaryCta, projectsMenu, servicesMenu } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

/* Which panel is showing: the main list, a menu, or one project category inside Projects. */
type View =
  | { menu: null }
  | { menu: "services" }
  | { menu: "projects" }
  | { menu: "category"; index: number };

/*
 * Phone and tablet menu: a white full-screen sheet with its own top bar (logo and close), the
 * pages as full-width rows split by hairlines, and "Schedule Meeting" across the bottom.
 * Services and Projects drill into their own panel, and each project category into its list,
 * easing in from the right with a Back row; Back eases in from the left. It is portalled to the
 * body so the header's slide-away transform can never clip it. Escape closes it.
 *
 * The sheet stays mounted so opening and closing both animate: it wipes down from the top while
 * its bar copies the header's height, so the menu lines morph into the close cross in place and
 * the rows rise in one after another. Closing wipes it back up, faster.
 */
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>({ menu: null });
  const [direction, setDirection] = useState<1 | -1>(1);
  const [bar, setBar] = useState({ height: 64, logo: 40 });
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const go = (next: View, towards: 1 | -1) => {
    setDirection(towards);
    setView(next);
  };
  const close = () => setOpen(false);

  // Portals need the document, which only exists after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLElement>("nav a, nav button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [open]);

  const sheet = (
    <div
      ref={sheetRef}
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      data-lenis-prevent
      data-open={open || undefined}
      style={{ "--bar-h": `${bar.height}px`, "--logo-h": `${bar.logo}px` } as CSSProperties}
      className={cn(
        "group/sheet fixed inset-0 z-[60] flex flex-col bg-white text-ink ease-soft lg:hidden",
        "transition-[clip-path,visibility]",
        open
          ? "visible duration-600 [clip-path:inset(0_0_0_0)]"
          : "invisible duration-400 [clip-path:inset(0_0_100%_0)]",
      )}
    >
      <div className="flex h-(--bar-h) shrink-0 items-center justify-between border-b border-mist px-edge">
        <Link href="/" onClick={close} aria-label="Sunbeam Spaces — home">
          <Logo decorative className="h-(--logo-h) w-auto" />
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="-mr-2 grid size-11 place-items-center"
        >
          <MenuMark open={open} />
        </button>
      </div>

      <nav aria-label="Mobile" className="relative flex-1 overflow-x-hidden overflow-y-auto">
        <div
          key={view.menu === "category" ? `category-${view.index}` : String(view.menu)}
          className={cn(
            "px-edge pb-6 transition-[opacity,translate] duration-250 ease-soft starting:opacity-0",
            direction === 1 ? "starting:translate-x-6" : "starting:-translate-x-6",
          )}
        >
          <Panel view={view} go={go} close={close} />
        </div>
      </nav>

      <div
        className={cn(
          "flex shrink-0 flex-col gap-3 border-t border-mist px-edge pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] transition-[opacity,translate] ease-soft",
          open
            ? "translate-y-0 opacity-100 delay-300 duration-500"
            : "translate-y-3 opacity-0 duration-200",
        )}
      >
        <Button href={primaryCta.href} onClick={close} variant="dark" className="w-full">
          {primaryCta.label}
        </Button>
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="flex items-center justify-center gap-2 py-1 text-small tracking-[0.5px] text-slate"
        >
          <Icon name="mail" size={16} />
          {siteConfig.contact.email}
        </a>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        onClick={() => {
          // Each open starts from the main list, and the sheet's bar matches the header's so
          // the lines morph into the cross exactly where they are.
          const header = toggleRef.current?.closest("header");
          const logo = header?.querySelector("svg, img");
          if (header && logo) {
            setBar({
              height: Math.round(header.getBoundingClientRect().height),
              logo: Math.round(logo.getBoundingClientRect().height),
            });
          }
          setView({ menu: null });
          setDirection(1);
          setOpen(true);
        }}
        className="-mr-2 grid size-11 place-items-center"
      >
        <MenuMark open={false} />
      </button>
      {mounted && createPortal(sheet, document.body)}
    </div>
  );
}

function Panel({
  view,
  go,
  close,
}: {
  view: View;
  go: (next: View, towards: 1 | -1) => void;
  close: () => void;
}) {
  if (view.menu === null) {
    return (
      <ul>
        {mainNavigation.map((item, index) => {
          const menu = item.menu;
          return (
            <li
              key={item.label}
              style={{ "--row-delay": `${120 + index * 50}ms` } as CSSProperties}
              className="translate-y-3 border-b border-mist opacity-0 transition-[opacity,translate] duration-200 ease-soft group-data-open/sheet:translate-y-0 group-data-open/sheet:opacity-100 group-data-open/sheet:delay-(--row-delay) group-data-open/sheet:duration-500"
            >
              {menu ? (
                <Row onClick={() => go({ menu }, 1)} trailing="arrow-right">
                  {item.label}
                </Row>
              ) : (
                <Row href={item.href} onClick={close}>
                  {item.label}
                </Row>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  if (view.menu === "services") {
    return (
      <>
        <Back onClick={() => go({ menu: null }, -1)}>Services</Back>
        <ul className="flex flex-col gap-3 pt-2">
          {servicesMenu.map((service) => (
            <li key={service.href}>
              <Link
                href={service.href}
                onClick={close}
                className="flex items-center gap-4 rounded-[4px] bg-mist p-3"
              >
                <span className="relative size-20 shrink-0 overflow-hidden rounded-[2px]">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    style={"focus" in service ? { objectPosition: service.focus } : undefined}
                  />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-heading-6 font-semibold">{service.title}</span>
                  <span className="line-clamp-2 text-small tracking-[0.5px] text-slate">
                    {service.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (view.menu === "projects") {
    return (
      <>
        <Back onClick={() => go({ menu: null }, -1)}>Projects</Back>
        <ul>
          {projectsMenu.columns.map((column, index) => (
            <li key={column.title} className="border-b border-mist">
              <Row onClick={() => go({ menu: "category", index }, 1)} trailing="arrow-right">
                <span className="flex items-center gap-3">
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-[2px]">
                    <Image
                      src={column.image}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                      style={{ objectPosition: column.position }}
                    />
                  </span>
                  {column.title}
                </span>
              </Row>
            </li>
          ))}
        </ul>
        <Link
          href={projectsMenu.cta.href}
          onClick={close}
          className="mt-5 flex items-center gap-2 text-small font-medium tracking-[1px] uppercase"
        >
          {projectsMenu.cta.label}
          <Icon name="arrow-right" size={16} />
        </Link>
      </>
    );
  }

  const column = projectsMenu.columns[view.index];
  if (!column) return null;
  return (
    <>
      <Back onClick={() => go({ menu: "projects" }, -1)}>{column.title}</Back>
      <ul>
        {column.links.map((link) => (
          <li key={link.label} className="border-b border-mist">
            <Row href={link.href} onClick={close}>
              {link.label}
            </Row>
          </li>
        ))}
      </ul>
    </>
  );
}

/* A full-width 56px row: a link, or a button that drills into a sub-panel. */
function Row({
  href,
  onClick,
  trailing,
  children,
}: {
  href?: string;
  onClick: () => void;
  trailing?: "arrow-right";
  children: ReactNode;
}) {
  const className =
    "flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left text-heading-6 font-semibold";
  const content = (
    <>
      {children}
      {trailing && <Icon name={trailing} size={20} className="shrink-0 text-slate" />}
    </>
  );
  return href ? (
    <Link href={href} onClick={onClick} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

/* Back row at the top of a sub-panel, naming the panel it opened. */
function Back({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-mist pt-4 pb-4">
      <button
        type="button"
        onClick={onClick}
        className="-ml-1 flex min-h-11 w-fit items-center gap-1 text-small font-medium tracking-[1px] text-slate uppercase"
      >
        <Icon name="arrow-left" size={18} />
        Back
      </button>
      <p className="text-heading-4 font-semibold">{children}</p>
    </div>
  );
}

/*
 * Two lines that turn into a cross: each slides to the middle and rotates. The sheet's copy is
 * drawn as lines on open and then eases into the cross, so the icon seems to morph in place.
 */
function MenuMark({ open }: { open: boolean }) {
  const line =
    "absolute left-1 h-[1.5px] w-4 rounded-full bg-current transition-[translate,rotate] duration-500 ease-soft";
  return (
    <span aria-hidden className="relative block size-6">
      <span className={cn(line, "top-[7.25px]", open && "translate-y-[4px] rotate-45")} />
      <span className={cn(line, "top-[15.25px]", open && "-translate-y-[4px] -rotate-45")} />
    </span>
  );
}
