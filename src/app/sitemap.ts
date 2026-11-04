import type { MetadataRoute } from "next";
import { profile, projects } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${profile.url}/projects/${project.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}