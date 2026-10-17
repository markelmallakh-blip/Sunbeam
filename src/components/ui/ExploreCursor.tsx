"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { CursorDisc } from "./CursorDisc";

type ExploreCursorProps = {
  /** Where a click on the area (outside its own links and buttons) goes. */
  href: string;
  children: ReactNode;
  className?: string;
};

/*
 * Turns a whole area into an "Explore" zone: the cursor becomes the Explore disc and clicking
 * empty space opens `href`. Links and buttons inside keep their own behaviour, so keyboard and
 * touch users navigate with those.
 */
export function ExploreCursor({ href, children, className }: ExploreCursorProps) {
  const router = useRouter();

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    router.push(href);
  };

  return (
    <CursorDisc disc="Explore" onClick={onClick} className={className}>
      {children}
    </CursorDisc>
  );
}
