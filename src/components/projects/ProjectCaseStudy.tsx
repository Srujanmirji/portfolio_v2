import Link from "next/link";
import type { Project } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { ProjectMedia } from "./ProjectCard";

export function ProjectCaseStudy({ project }: { project: Project }) {
  const details = project.caseStudy;
  // TODO(owner): replace missing narrative, contribution and outcome copy with verified facts.
  const chapters = [
    { id: "context", title: "Context", content: details?.context, pending: "The project background is coming soon." },
    { id: "problem", title: "Problem", content: details?.problem, pending: "The problem statement is coming soon." },
    { id: "solution", title: "Solution", content: details?.solution, pending: "The solution story is coming soon." },
    { id: "role", title: "My role", content: details?.role, pending: "Contribution details are coming soon." },
    { id: "features", title: "Features", pending: "The feature walkthrough is coming soon." },
    { id: "architecture", title: "Architecture", content: details?.architecture, pending: "Technical architecture is coming soon." },
    { id: "technology", title: "Technology", content: project.technologies?.join(" · "), pending: "The technology stack is coming soon." },
    { id: "result", title: "Result", content: details?.result, pending: "Verified results and current status are coming soon." },
  ];

  return (
    <Container className="case-study">
      <article aria-labelledby="case-title">
        <header className="case-hero">
          <Link className="case-back" href="/#work" data-cursor="EXPLORE"><span aria-hidden="true">←</span> Back to projects</Link>
          <p className="section-label">Work / Case study</p>
          <h1 id="case-title" className="case-title">{project.title}<span aria-hidden="true">.</span></h1>
          <p className="case-description">{project.description}</p>
          <ul className="project-categories case-categories" aria-label="Categories">{project.categories.map((category) => <li key={category}>{category}</li>)}</ul>
          <ProjectMedia project={project} />
        </header>
        <div className="case-chapters">
          {chapters.map((chapter, index) => (
            <section className="case-chapter" key={chapter.id} aria-labelledby={`case-${chapter.id}`}>
              <div className="case-chapter-heading">
                <p className="section-label"><span>{String(index + 1).padStart(2, "0")}</span></p>
                <h2 id={`case-${chapter.id}`}>{chapter.title}</h2>
              </div>
              <div className="case-chapter-content">
                {chapter.id === "features" && details?.features?.length ? <>
                  <ol className="case-features">{details.features.map((feature) => <li key={feature}>{feature}</li>)}</ol>
                  <p className="case-pending">Feature visuals and implementation details are coming soon.</p>
                </> : <p className={chapter.content ? undefined : "case-pending"}>{chapter.content ?? chapter.pending}</p>}
              </div>
            </section>
          ))}
          <section className="case-chapter" aria-labelledby="case-links">
            <div className="case-chapter-heading"><p className="section-label"><span>09</span></p><h2 id="case-links">Links</h2></div>
            <div className="case-chapter-content case-links">
              {project.liveUrl && <a href={project.liveUrl} data-cursor="OPEN">Live demo ↗</a>}
              {project.githubUrl && <a href={project.githubUrl} data-cursor="OPEN">GitHub ↗</a>}
              {!project.liveUrl && !project.githubUrl && <p className="case-pending">Project links are coming soon.</p>}
            </div>
          </section>
        </div>
        <footer className="case-footer"><Link className="case-back" href="/#work" data-cursor="EXPLORE"><span aria-hidden="true">←</span> Back to projects</Link></footer>
      </article>
    </Container>
  );
}
