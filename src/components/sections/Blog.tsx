import Link from "next/link";
import { Fragment } from "react";
import { blog } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

/* Figma "FAQs" (116:7007) — the Blog & News block: three cards and an "Explore blog" CTA. */
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
        {blog.items.map((post) => (
          <li key={post.title}>
            <Link href={post.href} className="group flex flex-col gap-4">
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
                      {index > 0 && (
                        <span aria-hidden className="size-[3px] rounded-full bg-slate" />
                      )}
                      <span>{part}</span>
                    </Fragment>
                  ))}
                </p>
                <div className="flex flex-col gap-2">
                  <h3 className="text-heading-6 font-semibold text-ink">{post.title}</h3>
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
          </li>
        ))}
      </ul>
      <Button href={blog.cta.href} variant="light">
        {blog.cta.label}
      </Button>
    </section>
  );
}
