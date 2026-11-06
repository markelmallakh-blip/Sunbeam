import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { careersPage, getRole, roleOffer, roleSlugs } from "@/content/careers";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { RoleMeta } from "@/components/careers/RoleList";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { withBase } from "@/lib/base-path";

export function generateStaticParams() {
  return roleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) return {};
  return {
    title: `${role.title} — Careers`,
    description: role.summary,
    alternates: { canonical: withBase(`/careers/${slug}`) },
    openGraph: {
      url: withBase(`/careers/${slug}`),
      title: `${role.title} — Sunbeam Spaces`,
      description: role.summary,
    },
  };
}

/* The slug is read inside <Suspense> so client navigations show the shell at once. */
export default function RolePage({ params }: PageProps<"/careers/[slug]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-svh bg-white" />}>
      <RoleContent params={params} />
    </Suspense>
  );
}

/*
 * One open role, kept compact: a left-aligned header with "Apply now" beside it, the role as three
 * rows (title left, points listed right), then the application form under a centred "Apply now" (which
 * the header button scrolls down to).
 */
async function RoleContent({ params }: { params: PageProps<"/careers/[slug]">["params"] }) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();

  return (
    <>
      <article aria-labelledby="role-title" className="px-edge pt-block pb-block">
        <div className="mx-auto flex w-full max-w-[56rem] flex-col gap-stack">
          <header className="flex flex-col gap-6 border-b border-hairline pb-stack lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4">
              <Link
                href="/careers"
                className="link-underline flex w-fit items-center gap-1 text-small font-medium tracking-[1px] text-slate uppercase"
              >
                <Icon name="arrow-left" size={16} />
                All roles
              </Link>
              <h1 id="role-title" className="text-heading-2 font-semibold text-ink">
                {role.title}
              </h1>
              <RoleMeta role={role} />
            </div>
            <Button href="#apply" variant="dark" size="cta" className="self-start lg:self-end">
              {careersPage.applyNow}
            </Button>
          </header>

          <div className="flex flex-col divide-y divide-hairline">
            <RoleSection title="What you’ll do" items={role.responsibilities} />
            <RoleSection title="What you’ll bring" items={role.requirements} />
            <RoleSection title="What we offer" items={roleOffer} />
          </div>
        </div>
      </article>

      <section
        id="apply"
        aria-labelledby="apply-title"
        className="scroll-mt-header bg-white px-edge pb-block"
      >
        <div className="mx-auto flex w-full max-w-[56rem] flex-col items-center gap-8 border-t border-hairline pt-block sm:gap-10">
          <h2 id="apply-title" className="text-center text-heading-3 font-semibold text-ink">
            {careersPage.applyNow}
          </h2>
          <div className="w-full max-w-[46rem]">
            <ApplicationForm role={role.title} />
          </div>
        </div>
      </section>
    </>
  );
}

/* One part of the role: its title with the points listed one under another beneath it. */
function RoleSection({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="flex flex-col gap-3 py-8 first:pt-0 last:pb-0 sm:gap-4 lg:py-10">
      <h2 className="text-heading-5 font-semibold text-ink">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-small leading-[1.5] tracking-[0.3px] text-ink/80 before:mt-[0.6em] before:size-1.5 before:shrink-0 before:rounded-full before:bg-ink sm:text-body"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
