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
 * One open role on a light grey page: the title and details centred across the top, then the role's
 * three parts on the left and the application form in a white card on the right (stacked on phones).
 */
async function RoleContent({ params }: { params: PageProps<"/careers/[slug]">["params"] }) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();

  return (
    <article aria-labelledby="role-title" className="bg-mist px-edge pt-3 pb-block sm:pt-block">
      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-10 lg:gap-14">
        <header className="flex flex-col items-center gap-4 border-b border-ink/10 pb-10 text-center lg:pb-12">
          <Link
            href="/careers"
            className="link-underline flex w-fit items-center gap-1 text-caption font-medium tracking-[1px] text-slate uppercase"
          >
            <Icon name="arrow-left" size={14} />
            All roles
          </Link>
          <h1 id="role-title" className="text-heading-3 font-semibold text-ink">
            {role.title}
          </h1>
          <RoleMeta role={role} />
          {/* The form sits beside the role on desktop; below it on smaller screens, so this jumps there. */}
          <Button href="#apply" variant="dark" className="mt-2 lg:hidden">
            {careersPage.applyNow}
          </Button>
        </header>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="flex flex-col divide-y divide-ink/10">
            <RoleSection title="What you’ll do" items={role.responsibilities} />
            <RoleSection title="What you’ll bring" items={role.requirements} />
            <RoleSection title="What we offer" items={roleOffer} />
          </div>

          <section
            id="apply"
            aria-labelledby="apply-title"
            className="flex flex-col gap-6 bg-white p-6 sm:p-8 lg:p-10 lg:pb-8"
          >
            <h2 id="apply-title" className="text-heading-5 font-semibold text-ink">
              {careersPage.applyNow}
            </h2>
            <ApplicationForm role={role.title} />
          </section>
        </div>
      </div>
    </article>
  );
}

/* One part of the role: its title with the points listed one under another beneath it. */
function RoleSection({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="flex flex-col gap-3 py-7 first:pt-0 last:pb-0 lg:py-8">
      <h2 className="text-heading-6 font-semibold text-ink">{title}</h2>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-small leading-[1.55] tracking-[0.3px] text-ink/80 before:mt-[0.62em] before:size-1 before:shrink-0 before:rounded-full before:bg-ink"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
