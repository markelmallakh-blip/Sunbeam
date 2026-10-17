"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import type { Faq } from "@/content/home";
import { Icon } from "@/components/ui/Icon";
import { duration, easeSoft } from "@/lib/motion";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="w-full border-t border-line">
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;
        return (
          <li key={item.question} className="border-b border-rule">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center gap-5 py-7 text-left hover:text-rust"
              >
                <span className="w-6 shrink-0 text-small text-slate">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-subtitle">{item.question}</span>
                <Icon name={open ? "minus" : "plus"} size={22} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: duration.fast, ease: easeSoft }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[33rem] pb-7 pl-11 text-body text-slate">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
