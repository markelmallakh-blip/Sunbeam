"use client";

import { motion } from "framer-motion";
import { useId, useState, type KeyboardEvent } from "react";
import { easeSoft } from "@/lib/motion";
import { cn } from "@/lib/cn";

type SegmentedControlProps<T extends string> = {
  name: string;
  label: string;
  options: readonly T[];
  defaultValue?: T;
  onChange?: (value: T) => void;
  error?: string;
};

/*
 * A single choice shown as a Gray .5 track with a white pill that glides to the chosen option.
 * Works as a radio group: arrow keys move the choice, and the value posts through a hidden input.
 */
export function SegmentedControl<T extends string>({
  name,
  label,
  options,
  defaultValue,
  onChange,
  error,
}: SegmentedControlProps<T>) {
  const [value, setValue] = useState<T | "">(defaultValue ?? "");
  const id = useId();
  const errorId = `${id}-error`;

  const choose = (next: T) => {
    setValue(next);
    onChange?.(next);
  };
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = options[(index + step + options.length) % options.length];
    if (!next) return;
    choose(next);
    document.getElementById(`${id}-${next}`)?.focus();
  };

  return (
    <div className="flex flex-col gap-2">
      <p id={`${id}-label`} className="text-small tracking-[0.5px] text-slate">
        {label}
      </p>
      <input type="hidden" name={name} value={value} />
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "flex rounded-[4px] border bg-linen p-1",
          error ? "border-rust" : "border-transparent",
        )}
      >
        {options.map((option, index) => {
          const selected = option === value;
          return (
            <button
              key={option}
              id={`${id}-${option}`}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (!value && index === 0) ? 0 : -1}
              onClick={() => choose(option)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "relative flex-1 rounded-[2px] px-3 py-3 text-small font-medium tracking-[0.5px] transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-line",
                selected ? "text-ink" : "text-slate hover:text-ink",
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${id}-pill`}
                  className="absolute inset-0 rounded-[2px] bg-white shadow-[0_1px_3px_rgb(0_0_0/0.08)]"
                  transition={{ duration: 0.45, ease: easeSoft }}
                />
              )}
              <span className="relative">{option}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="text-caption tracking-[0.5px] text-rust">
          {error}
        </p>
      )}
    </div>
  );
}
