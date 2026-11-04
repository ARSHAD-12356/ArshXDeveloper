import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { projects } from "@/data/site";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  const images = project.media?.type === "image" ? [{ url: project.media.src, alt: project.media.alt }] : undefined;
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description, images },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) notFound();

  return (
    <>
      <Header />
      <main id="main" className="relative z-10">
        <ProjectDetail project={projects[index]} index={index} />
      </main>
      <Footer />
    </>
  );
}
