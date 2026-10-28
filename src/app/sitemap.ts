import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projectSlugs } from "@/content/projects";
import { postSlugs } from "@/content/blog";
import { serviceSlugs } from "@/content/services";
import { withBase } from "@/lib/base-path";

type Route = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
};

/* Add each new route here as new pages are built. */
const routes: Route[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "yearly" },
  { path: "/projects", priority: 0.9, changeFrequency: "monthly" },
  ...serviceSlugs.map((slug): Route => ({
    path: `/services/${slug}`,
    priority: 0.8,
    changeFrequency: "yearly",
  })),
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  ...postSlugs.map((slug): Route => ({
    path: `/blog/${slug}`,
    priority: 0.5,
    changeFrequency: "yearly",
  })),
  { path: "/faqs", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  ...projectSlugs.map((slug): Route => ({
    path: `/projects/${slug}`,
    priority: 0.7,
    changeFrequency: "yearly",
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(withBase(route.path), siteConfig.url).toString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
