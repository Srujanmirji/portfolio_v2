// Categories from PRD §19 / 05-CONTENT.md. Names below are evidenced by this
// repository's package.json, Git workflow and hero WebGL implementation,
// not inferred personal proficiency.
// TODO(owner): confirm current use of Python, PyTorch, TensorFlow, Docker,
// Supabase, Cloud and Three.js before adding them to the public list.
export const technologyGroups = [
  { id: "ai", category: "AI / ML", technologies: [] },
  { id: "development", category: "Development", technologies: ["TypeScript", "React", "Next.js", "Node.js"] },
  { id: "infrastructure", category: "Infrastructure", technologies: ["Git"] },
  { id: "creative", category: "Creative Technology", technologies: ["GSAP", "WebGL"] },
] as const;
