import { blog } from "@/content/homepage";
import { posts } from "@/content/blog";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/blog/PostCard";

/* Figma "FAQs" (116:7007) — the Blog & News block: the latest three posts and an "Explore blog" CTA. */
export function Blog() {
  return (
    <section
      id="blog"
      aria-labelledby="blog-title"
      className="flex scroll-mt-header flex-col items-center gap-stack bg-white px-edge py-block"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 id="blog-title" className="text-heading-4 font-semibold text-ink">
          {blog.title}
        </h2>
        <p className="text-body tracking-[0.5px] text-slate">{blog.description}</p>
      </div>
      <ul className="grid w-full gap-10 md:grid-cols-3 md:gap-2">
        {posts.slice(0, blog.count).map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <Button href={blog.cta.href} variant="light">
        {blog.cta.label}
      </Button>
    </section>
  );
}
