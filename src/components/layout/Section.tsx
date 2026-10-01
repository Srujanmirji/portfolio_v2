import type { ReactNode } from "react";
import type { SectionId } from "@/data/sections";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({ id, children, className }: { id: SectionId; children: ReactNode; className?: string }) {
  return (
    <section id={id} data-section={id} aria-labelledby={`${id}-title`} tabIndex={-1} className={cn("story-section", className)}>
      <Container>{children}</Container>
    </section>
  );
}
