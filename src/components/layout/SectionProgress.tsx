import { sections, type SectionId } from "@/data/sections";

export function SectionProgress({ active }: { active: SectionId | null }) {
  if (!active) return null;
  const index = sections.findIndex((section) => section.id === active);

  return (
    <div className="section-progress">
      <output className="section-counter" aria-label="Current section" aria-live="off">
        <span className="sr-only">{sections[index].label}, section </span>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className="counter-divider" aria-hidden="true"> / </span>
        <span className="sr-only"> of </span>
        <span className="counter-total">{String(sections.length).padStart(2, "0")}</span>
      </output>
      <div className="progress-segments" aria-hidden="true">
        {sections.map((section, position) => <span key={section.id} data-complete={position <= index} />)}
      </div>
    </div>
  );
}
