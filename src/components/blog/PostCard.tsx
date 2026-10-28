import Link from "next/link";
import { Fragment } from "react";
import type { Post } from "@/content/blog";
import { Icon } from "@/components/ui/Icon";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Figma blog card (180:6878): 313px photo, category • date, a 20px SemiBold title, a two-line
 * excerpt and the rust "Read more" link. Shared by the homepage, /blog and related posts.
 */
export function PostCard({ post, headingLevel = 3 }: { post: Post; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
      <div className="relative h-[19.5625rem] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-1000 ease-soft group-hover:scale-[1.04]">
          <ResponsiveImage
            asset={post.image}
            sizes="(min-width: 768px) 33vw, 100vw"
            fill
            parallax={false}
          />
        </div>
      </div>
      <div className="flex max-w-[23.875rem] flex-col items-start gap-[0.6875rem]">
        <p className="flex items-center gap-2 text-caption font-medium tracking-[0.5px] text-slate">
          {[post.category, post.date].map((part, index) => (
            <Fragment key={part}>
              {index > 0 && <span aria-hidden className="size-[3px] rounded-full bg-slate" />}
              <span>{part}</span>
            </Fragment>
          ))}
        </p>
        <div className="flex flex-col gap-2">
          <Heading className="text-heading-6 font-semibold text-ink">{post.title}</Heading>
          <p className="text-small tracking-[0.5px] text-slate">{post.excerpt}</p>
        </div>
        <span className="flex items-center gap-0.5 text-small font-medium tracking-[1px] text-rust uppercase">
          Read more
          <Icon
            name="arrow-right"
            size={20}
            className="transition-transform duration-500 ease-soft group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
