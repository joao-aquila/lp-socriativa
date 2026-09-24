import type { MetadataRoute } from "next";
import { readProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await readProjects();
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/projetos`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...projects.map((project) => ({
      url: `${siteUrl}/projetos/${project.slug}`,
      lastModified: project.publishedAt ? new Date(project.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
