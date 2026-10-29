"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
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
 */
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>({ menu: null });
  const [direction, setDirection] = useState<1 | -1>(1);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const go = (next: View, towards: 1 | -1) => {
    setDirection(towards);
    setView(next);
  };
  const close = () => setOpen(false);

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

  // Entrances use @starting-style transitions and nothing waits on an exit animation, so the
  // sheet and every panel change apply at once and simply ease in.
  const sheet = open && (
    <div
      ref={sheetRef}
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-lenis-prevent
      className="fixed inset-0 z-[60] flex flex-col bg-white text-ink transition-opacity duration-300 ease-soft lg:hidden starting:opacity-0"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-mist px-edge">
        <Link href="/" onClick={close} aria-label="Sunbeam Spaces — home">
          <Logo decorative className="h-10 w-auto" />
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="-mr-2 grid size-11 place-items-center"
        >
          <Icon name="close" />
        </button>
      </div>

      <nav aria-label="Mobile" className="relative flex-1 overflow-x-hidden overflow-y-auto">
        <div
          key={view.menu === "category" ? `category-${view.index}` : String(view.menu)}
          className={cn(
            "px-edge pb-6 transition-[opacity,translate] duration-400 ease-soft starting:opacity-0",
            direction === 1 ? "starting:translate-x-12" : "starting:-translate-x-12",
          )}
        >
          <Panel view={view} go={go} close={close} />
        </div>
      </nav>

      <div className="flex shrink-0 flex-col gap-4 border-t border-mist px-edge pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
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
          // Each open starts from the main list, easing in from the right.
          setView({ menu: null });
          setDirection(1);
          setOpen(true);
        }}
        className="-mr-2 grid size-11 place-items-center"
      >
        <Icon name="menu" />
      </button>
      {typeof document !== "undefined" && createPortal(sheet, document.body)}
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
        {mainNavigation.map((item) => {
          const menu = item.menu;
          return (
            <li key={item.label} className="border-b border-mist">
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
