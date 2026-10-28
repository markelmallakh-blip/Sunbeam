"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

const tileClass =
  "grid size-[2.625rem] place-items-center rounded-[4px] bg-mist text-ink transition-colors duration-300 hover:bg-mist-strong";

/* Share row for a post: Facebook, email and copy-link, on the light-grey tiles used for CTAs. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-small font-medium tracking-[1px] text-slate uppercase">Share</span>
      <ul className="flex gap-2">
        <li>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook (opens in a new tab)"
            className={tileClass}
          >
            <Icon name="facebook" size={18} />
          </a>
        </li>
        <li>
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encoded}`}
            aria-label="Share by email"
            className={tileClass}
          >
            <Icon name="mail" size={18} />
          </a>
        </li>
        <li>
          <button
            type="button"
            onClick={copy}
            className="flex h-[2.625rem] items-center rounded-[4px] bg-mist px-4 text-small font-medium tracking-[0.5px] text-ink uppercase transition-colors duration-300 hover:bg-mist-strong"
          >
            <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
