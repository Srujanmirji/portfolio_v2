import { Section } from "@/components/layout/Section";
import { LabExperiments } from "@/components/lab/LabExperiments";

export function Lab() {
  return <Section id="lab">
    <div className="lab-heading">
      <p className="section-label"><span>05</span> / Lab</p>
      <h2 id="lab-title" className="section-title">The<br />lab.</h2>
      <p className="lab-note">Example entries await final details.</p>
    </div>
    <LabExperiments />
  </Section>;
}
