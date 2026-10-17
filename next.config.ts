import type { NextConfig } from "next";

/*
 * GITHUB_PAGES=true builds a static export for GitHub Pages: plain HTML in out/, served from
 * the /Sunbeam sub-path, without the image optimizer or Server Actions (no server there). The
 * newsletter action and the cached copyright year are swapped for static stand-ins. Normal
 * builds are unaffected.
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/Sunbeam" : "";

const nextConfig: NextConfig = {
  // Partial prerendering needs a server; the static export prerenders everything instead.
  cacheComponents: !pages,
  partialPrefetching: !pages,
  poweredByHeader: false,
  ...(pages && { output: "export", basePath, trailingSlash: true }),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    unoptimized: pages,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
    ...(pages && {
      resolveAlias: {
        "@/actions/newsletter": "./src/actions/newsletter.static.ts",
        "@/components/layout/CopyrightYear": "./src/components/layout/CopyrightYear.static.tsx",
      },
    }),
  },
};

export default nextConfig;
