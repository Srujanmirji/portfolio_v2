export type Project = {
  slug: string;
  title: string;
  description: string;
  categories: readonly string[];
  technologies: readonly string[] | null;
  image: { src: string; alt: string; width: number; height: number } | null;
  liveUrl: `https://${string}` | null;
  githubUrl: `https://github.com/${string}` | null;
  featured: boolean;
  caseStudy?: {
    context?: string;
    problem?: string;
    solution?: string;
    role?: string;
    features?: readonly string[];
    architecture?: string;
    result?: string;
  };
};

// Source: 05-CONTENT.md; featured order and LiveWall's Desktop category: PRD §§13–16.
// null means not supplied, not absent from the real project. TODO(owner): replace
// unknown stacks, screenshots and URLs with verified information. The StudentsMate
// stack in PRD §32 is a schema example, not evidence of its actual implementation.
export const projects: readonly Project[] = [
  {
    slug: "studentsmate",
    title: "StudentsMate",
    description: "AI-powered academic platform for students.",
    categories: ["AI", "Education", "Web App"],
    technologies: null,
    image: null,
    liveUrl: null,
    githubUrl: null,
    featured: true,
    // Feature names are supplied in PRD §13; implementation details remain TODO(owner).
    caseStudy: { features: ["AI Tutor", "Visual Concept Lab", "Smart Study Ecosystem", "Handwriting OCR", "Stress Analyst", "Study Planner", "Career Guidance", "Multilingual support"] },
  },
  {
    slug: "tanvo",
    title: "Tanvo",
    description: "Digital products and web solutions.",
    categories: ["Web", "Agency", "Product"],
    technologies: null,
    image: null,
    liveUrl: null,
    githubUrl: null,
    featured: true,
  },
  {
    slug: "livewall",
    title: "LiveWall",
    description: "A macOS live wallpaper application.",
    categories: ["macOS", "Creative Tech", "Desktop"],
    technologies: ["Swift"],
    image: null,
    liveUrl: null,
    githubUrl: null,
    featured: true,
  },
  {
    slug: "hackarena",
    title: "HackArena",
    description: "Inter-college hackathon platform and event experience.",
    categories: ["Hackathon", "Community", "Product"],
    technologies: null,
    image: null,
    liveUrl: null,
    githubUrl: null,
    featured: true,
  },
];
