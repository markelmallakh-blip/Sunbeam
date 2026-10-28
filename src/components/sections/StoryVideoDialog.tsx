"use client";

import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { VideoAsset } from "@/types/media";
import { Icon } from "@/components/ui/Icon";
import { Video } from "@/components/media/Video";

type StoryVideoDialogProps = {
  video: VideoAsset;
  label: string;
  /** Custom trigger content; the label then stays as the button's accessible name. */
  children?: ReactNode;
  triggerClassName?: string;
};

/*
 * Native <dialog> gives focus trapping, Escape-to-close and an accessible modal for free. It is
 * mounted only while open, in <body>, so the film loads on demand and the modal never inherits
 * styles (such as a hidden cursor) from the area around its trigger.
 */
export function StoryVideoDialog({
  video,
  label,
  children,
  triggerClassName = "inline-flex items-center gap-2 text-small font-medium transition-opacity duration-300 hover:opacity-70",
}: StoryVideoDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={children ? label : undefined}
        className={triggerClassName}
      >
        {children ?? (
          <>
            <Icon name="play" size={18} />
            <span>{label}</span>
          </>
        )}
      </button>
      {open &&
        createPortal(
          <dialog
            ref={(node) => {
              if (node && !node.open) node.showModal();
            }}
            onClose={() => setOpen(false)}
            aria-label={video.label}
            className="m-auto w-[min(90vw,calc(85svh*9/16))] bg-black p-0 backdrop:bg-black/80"
          >
            <form method="dialog" className="flex justify-end">
              <button
                type="submit"
                aria-label="Close video"
                className="grid size-11 place-items-center text-white"
              >
                <Icon name="close" />
              </button>
            </form>
            <Video asset={video} controls priority />
          </dialog>,
          document.body,
        )}
    </>
  );
}
