"use client";

import { useState } from "react";
import { announcement } from "@/content/home";
import { Icon } from "@/components/ui/Icon";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="relative flex h-6 items-center justify-center bg-ink px-10 text-white">
      <p className="text-caption font-medium uppercase">{announcement}</p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setOpen(false)}
        className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center text-white/70 hover:text-white"
      >
        <Icon name="close" size={12} />
      </button>
    </div>
  );
}
