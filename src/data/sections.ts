import { projects } from "./projects";

export const sections = [
  { id: "home", label: "Introduction", heading: "Srujan Mirji", description: "" },
  { id: "about", label: "About", heading: "Ideas\ninto\nreal\nproducts.", description: "I'm Srujan, a computer science student who enjoys turning ideas into working products. I build across AI, software, product design, and creative technology." },
  { id: "work", label: "Work", heading: "Projects.", description: projects.filter((project) => project.featured).map((project) => project.title).join(" · ") },
  { id: "timeline", label: "Timeline", heading: "The\nbuilding.", description: "" },
  { id: "lab", label: "Lab", heading: "The\nlab.", description: "" },
  { id: "stack", label: "Tech stack", heading: "Tech\nstack.", description: "" },
  { id: "contact", label: "Contact", heading: "Let's\nbuild\nit.", description: "Have an idea worth building? I'm open to interesting products, collaborations, and technical projects." },
] as const;

export type SectionId = (typeof sections)[number]["id"];
export const navigation = ["work", "about", "lab", "contact"] as const satisfies readonly SectionId[];
