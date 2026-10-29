import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageIntroProps = {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** Optional CTA row under the intro. */
  children?: ReactNode;
  className?: string;
};

/*
 * Centred page opener for the inner pages without a Figma frame (services, FAQs, contact):
 * Eyebrow style, Heading 02 / Heading 2 title and a Body Medium intro in Secondary Dark Text.
 */
export function PageIntro({ id, eyebrow, title, intro, children, className }: PageIntroProps) {
  return (
    <header className={cn("flex w-full flex-col items-center gap-2 text-center", className)}>
      <p className="text-eyebrow-lg font-medium tracking-[0.5px] text-slate uppercase">{eyebrow}</p>
      <h1 id={id} className="text-heading-2 font-semibold text-ink">
        {title}
      </h1>
      {intro && (
        <p className="mt-2 max-w-[43.625rem] text-body tracking-[0.5px] text-slate">{intro}</p>
      )}
      {children && (
        <div className="mt-8 flex w-full flex-wrap justify-center gap-3">{children}</div>
      )}
    </header>
  );
}
