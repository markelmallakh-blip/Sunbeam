import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type RollTextProps = {
  children: string;
  /** Delay between letters in ms — sets the speed of the wave. */
  stagger?: number;
  className?: string;
};

/*
 * Hover label roll: each letter slides up and an identical copy rises from below, one letter
 * after another. Triggered by the nearest ancestor with the `group/roll` class (hover or keyboard
 * focus). Screen readers get the label once; the animated letters are hidden from them.
 * The global reduced-motion rule turns the transition into an instant swap.
 */
export function RollText({ children, stagger = 18, className }: RollTextProps) {
  const letters = Array.from(children);

  return (
    <span className={cn("relative inline-flex overflow-hidden leading-[1.25]", className)}>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="inline-flex whitespace-pre">
        {letters.map((letter, index) => (
          <span
            key={index}
            style={{ "--roll-delay": `${index * stagger}ms` } as CSSProperties}
            className="relative inline-block transition-transform delay-(--roll-delay) duration-500 ease-soft group-hover/roll:-translate-y-full group-focus-visible/roll:-translate-y-full"
          >
            <span className="block">{letter}</span>
            <span className="absolute top-full left-0 block">{letter}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
