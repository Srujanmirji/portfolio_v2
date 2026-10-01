import { projects } from "./projects";

export const experimentCategories = ["AI / ML", "Web", "macOS", "3D / Creative", "Product Experiments"] as const;
export type ExperimentCategory = (typeof experimentCategories)[number];
export type Experiment = { id: string; title: string; categories: readonly ExperimentCategory[]; description?: string; projectSlug?: string };

// Sources: 05-CONTENT.md example titles and PRD §18. Entries without a project
// are explicitly labelled examples. TODO(owner): supply real experiment details/assets/URLs.
export const experiments: readonly Experiment[] = [
  { id: "3d-web", title: "3D Web Experiments", categories: ["Web", "3D / Creative"] },
  { id: "ai", title: "AI Experiments", categories: ["AI / ML"] },
  { id: "macos", title: "macOS Experiments", categories: ["macOS"] },
  { id: "prototypes", title: "Product Prototypes", categories: ["Product Experiments"] },
  { id: "creative", title: "Creative Coding", categories: ["3D / Creative"] },
  { id: "livewall", title: "LiveWall", categories: ["macOS"], description: projects.find((project) => project.slug === "livewall")?.description, projectSlug: "livewall" },
];
