"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryCta } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { cn } from "@/lib/cn";

/*
 * Figma "Header" (23:688): tall and transparent over the hero (logo 60px, 16px nav, light CTA);
 * compact and solid once the page scrolls (logo 48px, 14px nav, small dark CTA). Only pages with
 * a full-bleed hero (home, projects) start transparent; the rest use the compact, solid header.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Pages that open on a full-bleed photo: the homepage and each project.
  const overHero = pathname === "/" || pathname.startsWith("/projects/");
  const compact = scrolled || !overHero;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-[height,background-color,color] duration-500 ease-soft",
        overHero && "-mb-header",
        compact ? "h-[4.4375rem] bg-linen text-ink" : "h-header bg-transparent text-white",
      )}
    >
      <div className="mx-auto flex h-full max-w-site items-center justify-between gap-8 px-gutter">
        <Link href="/" aria-label="Sunbeam Spaces — home" className="shrink-0">
          <Logo
            decorative
            className={cn(
              "w-auto transition-[height] duration-500 ease-soft",
              compact ? "h-10 lg:h-12" : "h-11 lg:h-[3.75rem]",
            )}
          />
        </Link>
        <div className="flex items-center gap-6">
          <DesktopNavigation
            className={cn("hidden lg:block", compact ? "text-small" : "text-body")}
          />
          <div className="hidden sm:block">
            <Button
              href={primaryCta.href}
              variant={compact ? "dark" : "light"}
              size={compact ? "sm" : "md"}
            >
              {primaryCta.label}
            </Button>
          </div>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
