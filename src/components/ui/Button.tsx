import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/*
 * Mirrors the Figma "CTA" component set (15:3087): Type × Status × size × icon.
 * 2026-10 redesign: 4px corners, 0.5px tracking. Secondary CTAs are the ink outline everywhere.
 */
const variants = {
  dark: "bg-ink text-white hover:bg-black",
  /* Solid white, for use over photos and dark fades. */
  white: "bg-white text-ink hover:bg-mist",
  "outline-light": "border border-white text-white hover:bg-white hover:text-ink",
  "outline-dark": "border border-ink text-ink hover:bg-ink hover:text-white",
} as const;

const sizes = {
  sm: "h-8 gap-1.5 px-3.5 text-caption sm:h-9 sm:gap-2 sm:px-4 sm:text-small",
  md: "h-9 gap-1.5 px-4 text-[0.8125rem] sm:h-10 sm:gap-2 sm:px-[1.125rem] sm:text-[0.9375rem]",
  lg: "h-11 gap-2 px-6 text-small sm:h-[3.625rem] sm:gap-3 sm:px-8 sm:text-subtitle",
  /* Between md and lg: the role page's Apply Now and the application's submit button. */
  cta: "h-10 gap-2 px-5 text-small sm:h-12 sm:px-6 sm:text-body",
} as const;

export type ButtonVariant = keyof typeof variants;

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  icon?: "left" | "right" | "none";
  className?: string;
  children: ReactNode;
};

type LinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonOwnProps> & {
  href: string;
};
type NativeButtonProps = Omit<ComponentPropsWithoutRef<"button">, keyof ButtonOwnProps> & {
  href?: undefined;
};

export type ButtonProps = ButtonOwnProps & (LinkProps | NativeButtonProps);

export function buttonClasses({
  variant = "dark",
  size = "md",
  className,
}: Pick<ButtonOwnProps, "variant" | "size" | "className">) {
  return cn(
    "group/btn inline-flex shrink-0 items-center justify-center rounded-[4px] font-medium tracking-[0.5px] whitespace-nowrap uppercase",
    "transition-colors duration-300 ease-soft disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

function isLink(props: LinkProps | NativeButtonProps): props is LinkProps {
  return props.href !== undefined;
}

export function Button({
  variant,
  size = "md",
  icon = "right",
  className,
  children,
  ...rest
}: ButtonProps) {
  const iconSize = size === "lg" ? 16 : size === "cta" ? 14 : size === "md" ? 13 : 12;
  const classes = buttonClasses({ variant, size, className });
  const content = (
    <>
      {icon === "left" && <Icon name="arrow-right" size={iconSize} />}
      <span>{children}</span>
      {icon === "right" && (
        <Icon
          name="arrow-right"
          size={iconSize}
          className="transition-transform duration-500 ease-soft group-hover/btn:translate-x-1"
        />
      )}
    </>
  );

  if (isLink(rest)) {
    return (
      <Link {...rest} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" {...rest} className={classes}>
      {content}
    </button>
  );
}
