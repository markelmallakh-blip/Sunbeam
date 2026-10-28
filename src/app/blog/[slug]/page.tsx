import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, Suspense } from "react";
import { notFound } from "next/navigation";
import { getPost, postSlugs, relatedPosts } from "@/content/blog";
import { siteConfig } from "@/config/site";
import { PostArticle } from "@/components/blog/PostArticle";
import { PostCard } from "@/components/blog/PostCard";
import { ShareLinks } from "@/components/blog/ShareLinks";
import { Consultation } from "@/components/sections/Consultation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { withBase } from "@/lib/base-path";

export function generateStaticParams() {
  return postSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: withBase(`/blog/${slug}`) },
    openGraph: {
      type: "article",
      url: withBase(`/blog/${slug}`),
      title: `${post.title} — Sunbeam Spaces`,
      description: post.excerpt,
      images: [{ url: post.image.src, alt: post.image.alt }],
    },
  };
}

/* The slug is read inside <Suspense> so client navigations show the shell at once. */
export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-svh bg-white" />}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = relatedPosts(slug);
  const url = new URL(withBase(`/blog/${slug}`), siteConfig.url).toString();

  return (
    <>
      <article aria-labelledby="post-title" className="bg-white">
        <header className="flex flex-col items-center gap-6 px-edge pt-block pb-stack text-center">
          <Link
            href="/blog"
            className="link-underline flex items-center gap-1 text-small font-medium tracking-[1px] text-slate uppercase"
          >
            <Icon name="arrow-left" size={16} />
            Blog &amp; News
          </Link>
          <p className="flex items-center gap-2 text-caption font-medium tracking-[0.5px] text-slate">
            {[post.category, post.date, post.readingTime].map((part, index) => (
              <Fragment key={part}>
                {index > 0 && <span aria-hidden className="size-[3px] rounded-full bg-slate" />}
                <span>{part}</span>
              </Fragment>
            ))}
          </p>
          <h1 id="post-title" className="max-w-[56rem] text-heading-2 font-semibold text-ink">
            {post.title}
          </h1>
          <p className="max-w-[40rem] text-[1.125rem] leading-[1.6] tracking-[0.5px] text-slate">
            {post.excerpt}
          </p>
        </header>

        <div className="px-edge">
          <div className="relative mx-auto aspect-[16/9] max-h-[45rem] w-full max-w-[90.5rem] overflow-hidden">
            <ResponsiveImage asset={post.image} sizes="100vw" fill priority parallax={false} />
          </div>
        </div>

        <div className="mx-auto flex max-w-[45rem] flex-col gap-stack px-edge py-block">
          <PostArticle post={post} />
          <div className="border-t border-hairline pt-8">
            <ShareLinks url={url} title={post.title} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="related-title"
          className="flex flex-col items-center gap-stack border-t border-hairline bg-white px-edge py-block"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 id="related-title" className="text-heading-4 font-semibold text-ink">
              Related Posts
            </h2>
            <p className="text-body tracking-[0.5px] text-slate">
              More ideas and news from the studio
            </p>
          </div>
          <ul className="grid w-full gap-x-4 gap-y-12 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <PostCard post={item} />
              </li>
            ))}
          </ul>
          <Button href="/blog" variant="light">
            View all
          </Button>
        </section>
      )}

      <Consultation />
    </>
  );
}
