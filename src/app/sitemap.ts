import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projectSlugs } from "@/content/projects";

type Route = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
};

/* Add each new route here as the inner pages (Services, Projects listing…) are built. */
const routes: Route[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "yearly" },
  ...projectSlugs.map((slug): Route => ({
    path: `/projects/${slug}`,
    priority: 0.7,
    changeFrequency: "yearly",
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route.path, siteConfig.url).toString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
