"use client";

import { useState } from "react";
import type { Post, PostCategory } from "@/content/blog";
import { cn } from "@/lib/cn";
import { PostCard } from "./PostCard";

type Filter = "All" | PostCategory;

/*
 * Figma "Bar" + "Project Grid" (180:6402, 180:6424): category tabs with counts over a Gray 2
 * rule (the active tab carries a 2px ink underline), then three cards per row, 16px apart.
 */
export function BlogList({ posts, categories }: { posts: Post[]; categories: PostCategory[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const tabs: { label: Filter; count: number }[] = [
    { label: "All", count: posts.length },
    ...categories.map((category) => ({
      label: category,
      count: posts.filter((post) => post.category === category).length,
    })),
  ];
  const visible = filter === "All" ? posts : posts.filter((post) => post.category === filter);

  return (
    <>
      <div className="px-edge">
        <div
          role="tablist"
          aria-label="Filter posts"
          className="flex [scrollbar-width:none] gap-10 overflow-x-auto border-b border-hairline"
        >
          {tabs.map((tab) => {
            const active = tab.label === filter;
            return (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="blog-grid"
                onClick={() => setFilter(tab.label)}
                className={cn(
                  "-mb-px flex shrink-0 items-start gap-1.5 border-b-2 pt-6 pb-[1.375rem] font-medium transition-colors duration-300",
                  active
                    ? "border-[#262626] text-[#262626]"
                    : "border-transparent text-slate hover:text-[#262626]",
                )}
              >
                <span className="text-body tracking-[1.5px] uppercase">{tab.label}</span>
                <span className="text-[0.625rem] leading-[1.3] tracking-[0.5px] text-slate">
                  {String(tab.count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ul
        id="blog-grid"
        role="tabpanel"
        className="grid gap-x-4 gap-y-12 px-edge pt-8 pb-24 md:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} headingLevel={2} />
          </li>
        ))}
      </ul>
    </>
  );
}
