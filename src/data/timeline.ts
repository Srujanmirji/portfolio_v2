type Milestone = { title: string; category: "Education" | "Community" | "Hackathons" | "Projects" | "Leadership" | "Experiments"; projectSlug?: string };
type TimelineYear = { year: number; milestones: readonly Milestone[] };

// Source: 05-CONTENT.md. TODO(owner): confirm these draft years and milestones
// before publication; no exact dates, awards, counts or institutions are inferred.
export const timeline: readonly TimelineYear[] = [
  { year: 2024, milestones: [
    { title: "B.Tech CSE", category: "Education" },
    { title: "Developer community involvement", category: "Community" },
  ] },
  { year: 2025, milestones: [
    { title: "National hackathons", category: "Hackathons" },
    { title: "Tanvo", category: "Projects", projectSlug: "tanvo" },
    { title: "Development projects", category: "Projects" },
  ] },
  { year: 2026, milestones: [
    { title: "HackArena 2K26", category: "Hackathons", projectSlug: "hackarena" },
    { title: "GeeksforGeeks Campus Mantri", category: "Leadership" },
    { title: "Hackathon projects", category: "Projects" },
    { title: "Product experiments", category: "Experiments" },
  ] },
];
