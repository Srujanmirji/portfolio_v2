import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectMedia({ project }: { project: Project }) {
  return (
    <div className="project-media">
      {project.image ? (
        <Image {...project.image} alt={project.image.alt} sizes="(min-width: 1024px) 55vw, 100vw" />
      ) : (
        <p className="project-image-placeholder">Project imagery<br /><span>Coming soon</span></p>
      )}
    </div>
  );
}

export function ProjectCard({ project, index, onPreview }: { project: Project; index: number; onPreview: (project: Project) => void }) {
  return (
    <article id={`project-${project.slug}`} className="project-card" aria-labelledby={`title-${project.slug}`} tabIndex={-1}>
      <div className="project-information">
        <p className="project-number">{String(index + 1).padStart(2, "0")}</p>
        <h3 id={`title-${project.slug}`} className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-meta">
          <ul className="project-categories" aria-label="Categories">
            {project.categories.map((category) => <li key={category}>{category}</li>)}
          </ul>
          {project.technologies && <p className="project-technologies">Built with {project.technologies.join(" · ")}</p>}
          <div className="project-actions">
            <Link className="project-link" href={`/work/${project.slug}`} data-cursor="VIEW">View project <span aria-hidden="true">↗</span><span className="sr-only">: {project.title}</span></Link>
            <button className="project-preview" type="button" data-cursor="VIEW" onClick={() => onPreview(project)}>Preview<span className="sr-only">: {project.title}</span></button>
          </div>
        </div>
      </div>
      <ProjectMedia project={project} />
    </article>
  );
}
