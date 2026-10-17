import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProject, getProjectDetail, projectSlugs } from "@/content/projects";
import { ProjectHero } from "@/components/sections/project/ProjectHero";
import { ProjectOverview } from "@/components/sections/project/ProjectOverview";
import { ProjectDeliver } from "@/components/sections/project/ProjectDeliver";
import { ProjectGallery } from "@/components/sections/project/ProjectGallery";
import { ProjectFeedback } from "@/components/sections/project/ProjectFeedback";
import { MoreProjects } from "@/components/sections/project/MoreProjects";
import { Consultation } from "@/components/sections/Consultation";
import { PageMotion } from "@/components/animations/PageMotion";
import { withBase } from "@/lib/base-path";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  const detail = getProjectDetail(slug);
  if (!project || !detail) return {};
  return {
    title: project.title,
    description: detail.summary,
    alternates: { canonical: withBase(`/projects/${slug}`) },
    openGraph: {
      url: withBase(`/projects/${slug}`),
      title: `${project.title} — Sunbeam Spaces`,
      description: detail.summary,
      images: [{ url: project.cover.src, alt: project.cover.alt }],
    },
  };
}

/*
 * Figma "Single Project — Baxters" (60:803). The page reads its slug inside <Suspense>, so a
 * client navigation shows the shell at once (Next.js instant navigation) while the project
 * streams in; every known project is still prerendered in full.
 */
export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-svh bg-stone" />}>
      <Project params={params} />
    </Suspense>
  );
}

async function Project({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  const detail = getProjectDetail(slug);
  if (!project || !detail) notFound();

  return (
    <>
      <ProjectHero project={project} detail={detail} />
      <ProjectOverview overview={detail.overview} />
      <ProjectDeliver deliver={detail.deliver} />
      <ProjectGallery gallery={detail.gallery} />
      <ProjectFeedback feedback={detail.feedback} />
      <MoreProjects current={slug} />
      <Consultation />
      <PageMotion />
    </>
  );
}
