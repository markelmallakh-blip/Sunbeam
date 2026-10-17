import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { RollText } from "./RollText";

type TextLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  /** Text size defaults to body; pass a text-* class to change it. */
  tone?: "rust" | "ink";
};

/* Figma "Link" component (35:1006): uppercase label with a trailing chevron. */
export function TextLink({ tone = "rust", className, children, ...props }: TextLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group/roll inline-flex items-center gap-2 font-medium uppercase",
        tone === "rust" ? "text-rust" : "text-ink",
        className,
      )}
    >
      {typeof children === "string" ? <RollText>{children}</RollText> : <span>{children}</span>}
      <Icon
        name="arrow-right"
        size={12}
        className="transition-transform duration-300 ease-soft group-hover/roll:translate-x-1"
      />
    </Link>
  );
}
