import type { JsonObject } from "./json"

export interface Option {
  value: string
  label: string
}

// Choices and cross-references read from the data files on every page load
export interface Lookups {
  regions: Option[]
  skillGroups: Option[]
  projectTypes: Option[]
  subnets: Option[]
  services: Option[]
  helpTopics: Option[]
  svgIcons: Option[]
  pngIcons: Option[]
  // What uses each id, e.g. usage.skillGroups.cloud = ["Infobahn Technical Solutions"]
  usage: Record<string, Record<string, string[]>>
}

export type LookupName = Exclude<keyof Lookups, "usage">

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "date"
  | "number"
  | "boolean"
  | "colour"
  | "select"
  | "multiselect"
  | "tags"
  | "rows"
  | "file"

export interface Field {
  // Path inside the record, dotted for nested values ("metrics.hoursSpent")
  key: string
  label: string
  type: FieldType
  required?: boolean
  hint?: string
  options?: string[] | Option[] | LookupName
  // Sub-fields of a "rows" field, and the sub-field that titles each row
  fields?: Field[]
  rowTitle?: string
  // Leave the key out of the file when the value is empty
  omitEmpty?: boolean
  // Filled in automatically on a new record
  auto?: { kind: "slug" | "hex" | "uuid"; from?: string; prefix?: string }
  // Cannot be changed once the record exists (ids that other data points at)
  lock?: boolean
  unique?: boolean
}

export interface Column {
  label: string
  key: string
  format?: "date" | "count" | "colour" | "yesno"
}

export type Source =
  // The records are the array at `path`
  | { kind: "array"; path: string[] }
  // The records are the `child` arrays of each parent at `path`, shown as one list
  // (without `child`, each parent is itself the array of records)
  | { kind: "nested"; path: string[]; child?: string; parentLabel: string; parentTitle?: string }
  // The records are the entries of the object at `path`
  | {
      kind: "map"
      path: string[]
      keyLabel: string
      keyHint?: string
      valueLabel?: string
      valueOptions?: LookupName
    }

export type Guard =
  // Blocked while another record points at this one
  | { usage: string; key: string }
  // Blocked while the record still has children
  | { nonEmpty: string; what: string }

export interface Section {
  id: string
  title: string
  // "project", "skill group": used in "Add project", "Delete skill group"
  singular: string
  description: string
  // File in public/data, without .json
  file: string
  kind: "list" | "settings" | "labels"
  source?: Source
  columns?: Column[]
  fields?: Field[]
  // Field that names a record in dialogs
  titleKey?: string
  // Extra keys a new record starts with
  defaults?: JsonObject
  // File-level fields shown above a list
  settings?: Field[]
  settingsTitle?: string
  guard?: Guard
  sync?: "projectTypes"
  // "labels": top-level keys to show / hide
  include?: string[]
  exclude?: string[]
}

export interface SectionGroup {
  title: string
  note?: string
  sections: Section[]
}
