"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  forwardRef,
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@/lib/cn";

/*
 * Dropdown menu after Origin UI's "checkbox items" menu (Radix under the hood): an 8px-corner
 * white panel with a hairline border and soft shadow, rows with 6px corners that tint on hover
 * or keyboard focus, and a black check in front of the chosen row. Opens with a short fade and
 * zoom. Keyboard, focus and outside-click handling come from Radix.
 */
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, onPointerDownOutside, onCloseAutoFocus, ...props }, ref) => {
  // Closing with the mouse shouldn't draw a focus ring back on the trigger; the keyboard should.
  const closedByPointer = useRef(false);
  const handleCloseAutoFocus = useCallback(
    (event: Event) => {
      if (onCloseAutoFocus) return onCloseAutoFocus(event);
      if (!closedByPointer.current) return;
      event.preventDefault();
      closedByPointer.current = false;
    },
    [onCloseAutoFocus],
  );

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        onPointerDown={() => {
          closedByPointer.current = true;
        }}
        onPointerDownOutside={(event) => {
          closedByPointer.current = true;
          onPointerDownOutside?.(event);
        }}
        onCloseAutoFocus={handleCloseAutoFocus}
        className={cn(
          "z-[70] min-w-40 overflow-hidden rounded-lg border border-hairline bg-white p-1 text-ink shadow-lg shadow-black/5",
          // Fades and zooms in from the trigger as it mounts (@starting-style); it closes at once, since
          // Radix waits for any close animation to end before removing the menu.
          "origin-(--radix-dropdown-menu-content-transform-origin) transition-[opacity,scale,translate] duration-150 ease-out starting:-translate-y-1 starting:scale-95 starting:opacity-0",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

/* A single-choice row: the chosen one shows a black check, like the reference's checkbox items. */
export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer items-center rounded-md py-2 pr-3 pl-8 text-small tracking-[0.5px] text-slate outline-none select-none",
      "transition-colors focus:bg-mist focus:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=checked]:font-medium data-[state=checked]:text-ink",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2.5 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <svg viewBox="0 0 16 16" className="size-4 text-black" aria-hidden>
          <path
            d="M3.5 8.5l3 3 6-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
