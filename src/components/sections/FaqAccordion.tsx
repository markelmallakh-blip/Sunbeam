"use client";

import { useId, useState } from "react";
import type { Faq } from "@/content/homepage";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/*
 * Figma "FAQ Item" / "FAQ Item / Open": 24px rows split by Gray 2 rules, plus/minus on the right.
 * Answers slide open on a grid-rows transition, so no height is measured in script.
 */
export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="w-full max-w-[53.875rem]">
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;
        return (
          <li key={item.question} className={cn("py-6", index > 0 && "border-t border-hairline")}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center gap-6 text-left text-body font-medium tracking-[0.5px] text-ink"
              >
                <span className="flex-1">{item.question}</span>
                <Icon name={open ? "minus" : "plus"} size={24} className="shrink-0" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!open}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-soft",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[46rem] pt-4 text-small tracking-[0.5px] text-slate">
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
