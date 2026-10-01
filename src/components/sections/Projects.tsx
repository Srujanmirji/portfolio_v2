"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { ProjectCard, ProjectMedia } from "@/components/projects/ProjectCard";
import { useHorizontalProjects } from "@/components/motion/useHorizontalProjects";
import { projects, type Project } from "@/data/projects";

const featured = projects.filter((project) => project.featured);

export function Projects() {
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const navigate = useHorizontalProjects(stage, setActive);

  function select(index: number) {
    if (navigate.current) navigate.current(index);
    else {
      const card = document.getElementById(`project-${featured[index].slug}`);
      card?.scrollIntoView({ behavior: "instant" });
      card?.focus({ preventScroll: true });
    }
  }

  function preview(project: Project) {
    setSelected(project);
    dialog.current?.showModal();
  }

  return (
    <Section id="work">
      <div ref={stage} className="projects-stage">
        <div className="projects-heading">
          <p className="section-label"><span>03</span> / Work</p>
          <h2 id="work-title" className="section-title">Projects.</h2>
        </div>
        <nav className="project-navigation" aria-label="Featured projects">
          <p className="project-current" aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")} <span>{featured[active]?.title}</span></p>
          <div className="project-steps">
            {featured.map((project, index) => (
              <button type="button" key={project.slug} aria-label={`Show ${project.title}`} aria-current={index === active ? "true" : undefined} data-cursor="EXPLORE" onClick={() => select(index)}>
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </nav>
        <div className="projects-viewport">
          <div className="project-track">
            {featured.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} onPreview={preview} />)}
          </div>
        </div>
      </div>
      <dialog ref={dialog} className="project-dialog" aria-labelledby="preview-title" data-cursor="native">
        <button type="button" className="project-dialog-close" onClick={() => dialog.current?.close()} autoFocus>Close <span aria-hidden="true">×</span></button>
        {selected && <>
          <p className="section-label">Project preview</p>
          <h2 id="preview-title" className="project-title">{selected.title}</h2>
          <p>{selected.description}</p>
          <ProjectMedia project={selected} />
          <p className="project-technologies">{selected.categories.join(" · ")}</p>
          {selected.technologies && <p>Built with {selected.technologies.join(" · ")}</p>}
          <Link href={`/work/${selected.slug}`}>Read case study ↗</Link>
          {selected.liveUrl && <a href={selected.liveUrl}>Live project ↗</a>}
          {selected.githubUrl && <a href={selected.githubUrl}>GitHub ↗</a>}
        </>}
      </dialog>
    </Section>
  );
}
