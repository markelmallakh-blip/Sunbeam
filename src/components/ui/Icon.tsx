import type { SVGProps } from "react";

/*
 * Hugeicons subset used by the Figma components page (stroke 1.5, round caps).
 * Icons inherit `currentColor`; add a name here before using a new glyph.
 */
const strokePaths = {
  "arrow-right": "M9 6l6 6-6 6",
  "arrow-left": "M15 6l-6 6 6 6",
  "arrow-down": "M18 9l-6 6-6-6",
  plus: "M12 4v16M4 12h16",
  minus: "M4 12h16",
  close: "M18 6 6 18M6 6l12 12",
  menu: "M4 8h16M4 16h16",
  calendar:
    "M16 2v3.5M8 2v3.5M3.5 9h17M3 12.2c0-4.1 0-6.2 1.3-7.5C5.6 3.4 7.7 3.4 11.8 3.4h.4c4.1 0 6.2 0 7.5 1.3 1.3 1.3 1.3 3.4 1.3 7.5v.4c0 4.1 0 6.2-1.3 7.5-1.3 1.3-3.4 1.3-7.5 1.3h-.4c-4.1 0-6.2 0-7.5-1.3C3 19 3 16.9 3 12.8v-.6Z",
  mail: "M2 6l6.9 3.9c2.5 1.4 3.6 1.4 6.2 0L22 6M3.5 19h17A1.5 1.5 0 0 0 22 17.5v-11A1.5 1.5 0 0 0 20.5 5h-17A1.5 1.5 0 0 0 2 6.5v11A1.5 1.5 0 0 0 3.5 19Z",
  location:
    "M12 21.5c-1.2 0-2.3-.5-3.2-1.4C6.2 17.6 3.8 14.2 5 10.6 5.9 7.7 8.7 6 12 6s6.1 1.7 7 4.6c1.2 3.6-1.2 7-3.8 9.5-.9.9-2 1.4-3.2 1.4ZM14.5 11.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 8v4l2 2",
  video:
    "M2 11c0-3.3 0-4.9 1-6s2.7-1 6-1h1c3.3 0 4.9 0 6 1s1 2.7 1 6v2c0 3.3 0 4.9-1 6s-2.7 1-6 1H9c-3.3 0-4.9 0-6-1s-1-2.7-1-6v-2ZM17 8.9l.1-.1c2.1-1.3 3.2-1.9 4-1.4.9.5.9 1.8.9 4.3v.6c0 2.5 0 3.8-.9 4.3-.8.5-1.9-.1-4-1.4L17 15",
  globe:
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM8 12c0 6 4 10 4 10s4-4 4-10-4-10-4-10-4 4-4 10ZM21 15H3M21 9H3",
} as const;

const fillPaths = {
  play: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.45 10.39c-.15.63-.87 1.07-2.3 1.96-1.39.86-2.08 1.28-2.64 1.11a1.4 1.4 0 0 1-.6-.37C9.5 14.67 9.5 13.78 9.5 12s0-2.67.41-3.09c.17-.17.38-.3.6-.37.56-.17 1.25.25 2.64 1.11 1.43.89 2.15 1.33 2.3 1.96.06.26.06.52 0 .78Z",
  facebook:
    "M13.5 21.9v-7.4h2.6l.4-3h-3V9.6c0-.9.3-1.5 1.5-1.5h1.6V5.4a22 22 0 0 0-2.4-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6v7.4a10 10 0 1 1 3.2 0Z",
  instagram:
    "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 7.3c0-1.5-.4-2.8-1.5-3.8S17.2 2 15.7 2c-1.5-.1-5.9-.1-7.4 0-1.5 0-2.8.4-3.8 1.5S3 5.8 3 7.3c-.1 1.5-.1 5.9 0 7.4 0 1.5.4 2.8 1.5 3.8s2.3 1.5 3.8 1.5c1.5.1 5.9.1 7.4 0 1.5 0 2.8-.4 3.8-1.5s1.5-2.3 1.5-3.8c.1-1.5.1-5.9 0-7.4Zm-1.9 9a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.4.4s-4.2.1-5.4-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.3s-.1-4.2.4-5.3A3 3 0 0 1 6.6 4c1.2-.5 4-.4 5.4-.4s4.2-.1 5.4.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.3s.1 4.2-.4 5.3Z",
  tiktok:
    "M19.3 6.7a4.6 4.6 0 0 1-2.8-.9 4.6 4.6 0 0 1-1.8-3.6h-3.2v12.5a2.7 2.7 0 1 1-1.9-2.6V8.9a5.9 5.9 0 1 0 5.1 5.8V8.4a7.8 7.8 0 0 0 4.6 1.5V6.7Z",
  quote:
    "M4.6 19c-1.1-1.2-1.8-2.6-1.8-4.8 0-3.9 2.7-7.3 6.7-9.1l1 1.5c-3.7 2-4.4 4.6-4.7 6.2.6-.3 1.5-.4 2.3-.4 2 .2 3.6 1.9 3.6 4a4.1 4.1 0 0 1-4.1 4.1c-1.3 0-2.4-.6-3-1.5Zm10 0c-1.1-1.2-1.8-2.6-1.8-4.8 0-3.9 2.7-7.3 6.7-9.1l1 1.5c-3.7 2-4.4 4.6-4.7 6.2.6-.3 1.5-.4 2.3-.4 2 .2 3.6 1.9 3.6 4a4.1 4.1 0 0 1-4.1 4.1c-1.3 0-2.4-.6-3-1.5Z",
} as const;

type FillIconName = keyof typeof fillPaths;
export type IconName = keyof typeof strokePaths | FillIconName;

function isFillIcon(name: IconName): name is FillIconName {
  return name in fillPaths;
}

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name: IconName;
  size?: number;
  /** Provide when the icon carries meaning on its own; otherwise it is hidden from assistive tech. */
  title?: string;
};

export function Icon({ name, size = 24, title, ...props }: IconProps) {
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };

  if (isFillIcon(name)) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...a11y} {...props}>
        <path d={fillPaths[name]} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
      {...props}
    >
      <path d={strokePaths[name]} />
    </svg>
  );
}
