import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const title = `${project.title} — Srujan Mirji`;
  const url = `/work/${project.slug}`;

  return {
    title,
    description: project.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: project.description,
      url,
      type: "article",
      siteName: "Srujan Mirji",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.srujanmirji.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: project.title,
        item: `https://www.srujanmirji.in/work/${project.slug}`,
      },
    ],
  };

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    author: {
      "@type": "Person",
      name: "Srujan Mirji",
      url: "https://www.srujanmirji.in",
    },
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    ...(project.liveUrl ? { url: project.liveUrl } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectCaseStudy project={project} />
    </>
  );
}
