import type { Section, SectionGroup } from "../schema"
import { connect, documents, projects, skills, widgets } from "./content"
import { settings, text } from "./console"

// To add a use case to the studio, describe it in content.ts or console.ts.
export const SECTION_GROUPS: SectionGroup[] = [projects, documents, skills, connect, widgets, settings, text]

export function findSection(id: string): Section | undefined {
  return SECTION_GROUPS.flatMap((group) => group.sections).find((section) => section.id === id)
}
