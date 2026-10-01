import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const BASE_URL = "https://www.srujanmirji.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...projectEntries,
  ];
}
