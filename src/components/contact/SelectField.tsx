"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  options: readonly string[];
  defaultValue?: string;
  error?: string;
};

/*
 * A form choice in the shape of the Figma input (Gray .5, 4px corners, 56px, floating label) that
 * opens the shared DropdownMenu instead of a native select. The value posts through a hidden input.
 */
export function SelectField({ id, name, label, options, defaultValue, error }: SelectFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <input type="hidden" name={name} value={value} />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "group relative flex h-14 w-full items-end rounded-[4px] border border-transparent bg-linen px-3.5 pb-2.5 text-left text-body tracking-[0.5px] text-ink transition-colors duration-300 outline-none",
            "focus-visible:border-line aria-invalid:border-rust data-[state=open]:border-line",
          )}
        >
          <span
            className={cn(
              "pointer-events-none absolute left-3.5 text-slate transition-all duration-300 ease-soft",
              value ? "top-2 text-caption" : "top-4 text-body",
            )}
          >
            {label}
          </span>
          <span className="truncate pr-8">{value}</span>
          <Icon
            name="arrow-down"
            size={20}
            className="absolute top-[1.125rem] right-3.5 transition-transform duration-300 ease-soft group-data-[state=open]:rotate-180"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
          <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
            {options.map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>
                {option}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && (
        <p id={errorId} className="text-caption tracking-[0.5px] text-rust">
          {error}
        </p>
      )}
    </div>
  );
}
