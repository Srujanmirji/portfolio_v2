import { Section } from "@/components/layout/Section";
import { technologyGroups } from "@/data/technologies";

export function TechStack() {
  return <Section id="stack">
    <div className="stack-layout">
      <div className="stack-heading">
        <p className="section-label"><span>06</span> / Tech stack</p>
        <h2 id="stack-title" className="section-title">Tech<br />stack.</h2>
        <p className="stack-note">Tools used in this portfolio. Additional technologies await confirmation.</p>
      </div>
      <div className="stack-groups">
        {technologyGroups.map((group) => <div key={group.id} className="stack-group">
          <h3 id={`stack-${group.id}`}>{group.category}</h3>
          {group.technologies.length ? <ul aria-labelledby={`stack-${group.id}`}>
            {group.technologies.map((technology) => <li key={technology}>{technology}</li>)}
          </ul> : <p className="stack-pending">Technologies coming soon.</p>}
        </div>)}
      </div>
    </div>
  </Section>;
}
