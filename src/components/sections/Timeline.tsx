import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { TimelineMotion } from "@/components/motion/TimelineMotion";
import { timeline } from "@/data/timeline";

export function Timeline() {
  return <Section id="timeline">
    <div className="timeline-heading">
      <p className="section-label"><span>04</span> / Timeline</p>
      <h2 id="timeline-title" className="section-title">The<br />building.</h2>
      <p className="timeline-note">Draft milestones · dates to confirm</p>
    </div>
    <TimelineMotion>
      <div className="timeline-rail" aria-hidden="true"><div className="timeline-progress" /></div>
      <ol className="timeline-years">
        {timeline.map((group) => <li className="timeline-year-group" key={group.year}>
          <h3 className="timeline-year" aria-label={`${group.year}, date to confirm`}>{group.year}</h3>
          <div className="timeline-card">
            <ul className="timeline-milestones">
              {group.milestones.map((milestone) => <li key={milestone.title}>
                <p className="section-label">{milestone.category}</p>
                <h4>{milestone.projectSlug
                  ? <Link href={`/work/${milestone.projectSlug}`} data-cursor="VIEW">{milestone.title}<span aria-hidden="true">↗</span></Link>
                  : milestone.title}</h4>
              </li>)}
            </ul>
          </div>
        </li>)}
      </ol>
    </TimelineMotion>
  </Section>;
}
