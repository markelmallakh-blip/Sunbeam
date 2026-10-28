import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProject, projectSlugs } from "@/content/projects";
import { ProjectHero } from "@/components/sections/project/ProjectHero";
import { ProjectDetail } from "@/components/sections/project/ProjectDetail";
import { ProjectGallery } from "@/components/sections/project/ProjectGallery";
import { MoreProjects } from "@/components/sections/project/MoreProjects";
import { Consultation } from "@/components/sections/Consultation";
import { withBase } from "@/lib/base-path";

/* The fully written case study that stands in for sections other projects don't have yet. */
const TEMPLATE_SLUG = "baxters";
const MIN_GALLERY = 3;

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: withBase(`/projects/${slug}`) },
    openGraph: {
      url: withBase(`/projects/${slug}`),
      title: `${project.title} — Sunbeam Spaces`,
      description: project.summary,
      images: [{ url: project.cover.src, alt: project.cover.alt }],
    },
  };
}

/*
 * Figma "Single Project — Baxters" (90:3139): hero, Our Art in Detail, the Design Details gallery,
 * Discover More and the consultation block. The slug is read inside <Suspense> so client
 * navigation shows the shell at once; every project is still prerendered in full.
 */
export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-svh bg-mist" />}>
      <Project params={params} />
    </Suspense>
  );
}

async function Project({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  // Until each case study has its own copy and renders, projects borrow the Baxters sections they
  // are missing, so every project page shows the full structure to the client.
  const sample = getProject(TEMPLATE_SLUG);
  const detail = project.detail ?? sample?.detail;
  const gallery = project.gallery.length >= MIN_GALLERY ? project.gallery : (sample?.gallery ?? []);

  return (
    <>
      <ProjectHero project={project} />
      {detail && <ProjectDetail detail={detail} />}
      {gallery.length >= MIN_GALLERY && <ProjectGallery images={gallery} />}
      <MoreProjects current={slug} />
      <Consultation />
    </>
  );
}
