/*
 * Sub-path the site is served from: empty normally, "/Sunbeam" for the GitHub Pages export
 * (set by NEXT_PUBLIC_BASE_PATH at build time). Next adds it to links and its own assets; files
 * from /public referenced by plain URL (images, videos, CSS backgrounds) need it added by hand.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Public-folder URL with the base path in front, e.g. withBase("/images/a.webp"). */
export function withBase(path: string) {
  return `${basePath}${path}`;
}

/** Strips the base path from a pathname (for router calls, which add it back themselves). */
export function withoutBase(pathname: string) {
  return basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
}
