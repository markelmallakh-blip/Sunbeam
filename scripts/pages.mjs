// GitHub Pages export helper (run by .github/workflows/pages.yml, on the CI checkout only).
//   node scripts/pages.mjs prepare  → removes the robots/sitemap route files, which can't be
//                                     statically exported while Cache Components is on
//   node scripts/pages.mjs finish   → writes out/robots.txt and out/sitemap.xml from the
//                                     exported pages, plus out/.nojekyll
import { existsSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const base = "/Sunbeam";
const step = process.argv[2];

if (step === "prepare") {
  for (const file of ["src/app/robots.ts", "src/app/sitemap.ts"]) {
    if (existsSync(file)) rmSync(file);
  }
} else if (step === "finish") {
  const pages = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) {
        if (!name.startsWith("_")) walk(path);
      } else if (name === "index.html") {
        const route = relative("out", dir).split(sep).join("/");
        if (route !== "404" && !route.startsWith("_")) pages.push(route ? `/${route}/` : "/");
      }
    }
  };
  walk("out");
  const urls = pages
    .sort()
    .map((route) => `  <url><loc>${site}${base}${route}</loc></url>`)
    .join("\n");
  writeFileSync(
    "out/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  writeFileSync(
    "out/robots.txt",
    `User-agent: *\nAllow: /\n\nSitemap: ${site}${base}/sitemap.xml\n`,
  );
  writeFileSync("out/.nojekyll", "");
  console.log(`Pages export ready: ${pages.length} pages`, pages);
} else {
  console.error("Usage: node scripts/pages.mjs prepare|finish");
  process.exit(1);
}
