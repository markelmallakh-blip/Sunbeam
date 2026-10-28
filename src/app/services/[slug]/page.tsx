import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getService, serviceSlugs } from "@/content/services";
import {
  ServiceDetails,
  ServiceHero,
  ServiceIncluded,
  ServiceProjects,
  ServiceStatement,
} from "@/components/services/ServiceSections";
import { Consultation } from "@/components/sections/Consultation";
import { withBase } from "@/lib/base-path";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.intro,
    alternates: { canonical: withBase(`/services/${slug}`) },
    openGraph: {
      url: withBase(`/services/${slug}`),
      title: `${service.title} — Sunbeam Spaces`,
      description: service.intro,
      images: [{ url: service.hero.src, alt: service.hero.alt }],
    },
  };
}

/*
 * Single service page (/services/interior-design, /services/ffe). The slug is read inside
 * <Suspense> so client navigations show the shell at once; both services are prerendered.
 */
export default function ServicePage({ params }: PageProps<"/services/[slug]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-svh bg-white" />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

async function ServiceContent({ params }: { params: PageProps<"/services/[slug]">["params"] }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <ServiceHero service={service} />
      <ServiceStatement service={service} />
      <ServiceIncluded service={service} />
      <ServiceDetails service={service} />
      <ServiceProjects service={service} />
      <Consultation />
    </>
  );
}
