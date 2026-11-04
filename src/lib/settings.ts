import regionsData from "@data/regions.json"
import services from "@data/services.json"
import settings from "@data/settings.json"
import type { ConsoleSettings } from "@/store/useConsoleStore"

export type SettingKey = keyof ConsoleSettings
export type SettingsDraft = Partial<ConsoleSettings>

export interface Option {
  value: string
  label: string
}

export interface Field {
  key: SettingKey
  label: string
  hint?: string
  note?: string
  badge?: string
  // What a checklist counts, for "All Regions" / "1 of 2 Regions"
  noun?: string
  control: "select" | "radio" | "toggle" | "checklist"
  options?: Option[]
  optionsFrom?: "regions" | "services"
}

export interface Section {
  id: string
  tab: string
  title: string
  description: string
  editTitle: string
  editDescription: string
  helpTopic?: string
  saveLabel: string
  groups: { title: string; fields: Field[] }[]
}

export const sections = settings.sections as Section[]

export const sectionFields = (section: Section) => section.groups.flatMap((g) => g.fields)

const regionOptions: Option[] = regionsData.groups
  .flatMap((g) => g.regions)
  .map((r) => ({ value: r.id, label: `${r.full} ${r.id}` }))

const serviceOptions: Option[] = services.map((s) => ({ value: s.id, label: s.title }))

// A checklist lists everything; a Region select only offers the Regions that are still visible
export function fieldOptions(field: Field, hiddenRegions: string[]): Option[] {
  if (field.optionsFrom === "services") return serviceOptions
  if (field.optionsFrom === "regions") {
    return field.control === "checklist" ? regionOptions : regionOptions.filter((o) => !hiddenRegions.includes(o.value))
  }
  return field.options ?? []
}

// The value as the settings card shows it
export function fieldSummary(field: Field, value: ConsoleSettings[SettingKey], hiddenRegions: string[]): string {
  const { labels } = settings
  if (typeof value === "boolean") return value ? labels.yes : labels.no
  const options = fieldOptions(field, hiddenRegions)
  if (Array.isArray(value)) {
    const noun = field.noun ?? ""
    if (value.length === 0) return labels.all.replace("%s", noun)
    return labels.some
      .replace("%d", String(options.length - value.length))
      .replace("%t", String(options.length))
      .replace("%s", noun)
  }
  return options.find((o) => o.value === value)?.label ?? value
}

// First Region that is not hidden, for when the selected one gets hidden
export function firstVisibleRegion(hiddenRegions: string[]): string | undefined {
  return regionOptions.find((o) => !hiddenRegions.includes(o.value))?.value
}
