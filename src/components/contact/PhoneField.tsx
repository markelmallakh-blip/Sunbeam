"use client";

import { useState } from "react";
import { countryCodes } from "@/content/contact";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type PhoneFieldProps = {
  id: string;
  defaultCode?: string;
  defaultValue?: string;
  error?: string;
};

/*
 * Phone number with its country code: the code sits at the start of the Figma input as a small
 * menu (Egypt by default), followed by the number with the usual floating label. Posts
 * `phoneCode` and `phone`.
 */
export function PhoneField({ id, defaultCode, defaultValue, error }: PhoneFieldProps) {
  const [code, setCode] = useState(defaultCode || countryCodes[0].code);
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "flex h-14 rounded-[4px] border bg-linen transition-colors duration-300 focus-within:border-line",
          error ? "border-rust" : "border-transparent",
        )}
      >
        <input type="hidden" name="phoneCode" value={code} />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            aria-label={`Country code, ${code}`}
            className="group flex shrink-0 items-center gap-1 border-r border-hairline pr-2.5 pl-3.5 text-body tracking-[0.5px] text-ink outline-none"
          >
            {code}
            <Icon
              name="arrow-down"
              size={16}
              className="transition-transform duration-300 ease-soft group-data-[state=open]:rotate-180"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
            <DropdownMenuRadioGroup value={code} onValueChange={setCode}>
              {countryCodes.map((entry) => (
                <DropdownMenuRadioItem key={entry.code} value={entry.code}>
                  <span className="w-12 shrink-0">{entry.code}</span>
                  {entry.country}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <input
            id={id}
            name="phone"
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            required
            placeholder=" "
            defaultValue={defaultValue}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="peer block h-full w-full bg-transparent px-3.5 pt-5 text-body tracking-[0.5px] text-ink outline-none"
          />
          <label
            htmlFor={id}
            className="pointer-events-none absolute top-4 left-3.5 text-body tracking-[0.5px] text-slate transition-all duration-300 ease-soft peer-focus:top-2 peer-focus:text-caption peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-caption"
          >
            Phone number
          </label>
        </div>
      </div>
      {error && (
        <p id={errorId} className="text-caption tracking-[0.5px] text-rust">
          {error}
        </p>
      )}
    </div>
  );
}
