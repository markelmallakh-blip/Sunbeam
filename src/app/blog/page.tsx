import type { Metadata } from "next";
import { blogPage, posts } from "@/content/blog";
import { BlogList } from "@/components/blog/BlogList";
import { Consultation } from "@/components/sections/Consultation";
import { withBase } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Blog & News",
  description:
    "Ideas, trends and studio news from Sunbeam Design Studio — interiors that blend style, comfort and function.",
  alternates: { canonical: withBase("/blog") },
};

/* Figma "Blog" (180:6395): centred intro, category tabs, the post grid and the consultation block. */
export default function BlogPage() {
  return (
    <>
      <section aria-labelledby="blog-title" className="bg-white">
        <div className="flex flex-col items-center gap-4 px-edge py-[3.75rem] text-center">
          <p className="text-small font-medium tracking-[2px] text-slate uppercase">
            {blogPage.eyebrow}
          </p>
          <h1 id="blog-title" className="text-heading-2 font-semibold text-[#262626]">
            {blogPage.title}
          </h1>
        </div>
        <BlogList posts={posts} categories={blogPage.categories} />
      </section>
      <Consultation />
    </>
  );
}
