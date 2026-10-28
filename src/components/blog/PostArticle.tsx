import { Fragment } from "react";
import type { Post, PostBlock } from "@/content/blog";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/*
 * Single post (no Figma frame yet): a centred 720px reading column in the redesign's type —
 * 18px body on a relaxed 1.7 line height, SemiBold subheads, a rust-ruled pull quote and
 * full-column images with captions.
 */
function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-[1.125rem] leading-[1.7] tracking-[0.3px] text-ink/90">{block.text}</p>
      );
    case "heading":
      return <h2 className="pt-4 text-heading-5 font-semibold text-ink">{block.text}</h2>;
    case "quote":
      return (
        <figure className="my-4 border-l-2 border-rust py-1 pl-6">
          <blockquote className="text-heading-5 leading-[1.4] font-medium text-ink">
            “{block.text}”
          </blockquote>
          {block.cite && (
            <figcaption className="mt-4 text-small font-medium tracking-[1px] text-slate uppercase">
              {block.cite}
            </figcaption>
          )}
        </figure>
      );
    case "image":
      return (
        <figure className="my-4 flex flex-col gap-3">
          <div className="relative aspect-[3/2] overflow-hidden">
            <ResponsiveImage
              asset={block.image}
              sizes="(min-width: 768px) 720px, 100vw"
              fill
              parallax={false}
            />
          </div>
          {block.caption && (
            <figcaption className="text-caption tracking-[0.5px] text-slate">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
  }
}

export function PostArticle({ post }: { post: Post }) {
  return (
    <div className="flex flex-col gap-6">
      {post.body.map((block, index) => (
        <Fragment key={index}>
          <Block block={block} />
        </Fragment>
      ))}
    </div>
  );
}
