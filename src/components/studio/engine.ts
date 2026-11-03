import { isObject, type Json, type JsonObject } from "./json"
import type { Field, Lookups, Option, Section } from "./schema"

// Form-only keys that never reach the file
export const PARENT = "__parent"
export const KEY = "__key"
export const VALUE = "__value"

export interface RowRef {
  parent: number
  index: number
  key: string
}

export interface Row {
  ref: RowRef
  value: JsonObject
  parentLabel: string
}

// ---- paths -------------------------------------------------------------------------------

export function getIn(data: Json | undefined, path: string[]): Json | undefined {
  let cur = data
  for (const seg of path) {
    if (cur === undefined) return undefined
    if (Array.isArray(cur)) cur = cur[Number(seg)]
    else if (isObject(cur)) cur = cur[seg]
    else return undefined
  }
  return cur
}

export function setIn(data: Json | undefined, path: string[], value: Json): Json {
  if (path.length === 0) return value
  const [head, ...rest] = path
  if (Array.isArray(data)) {
    const next = [...data]
    next[Number(head)] = setIn(data[Number(head)], rest, value)
    return next
  }
  const obj = data !== undefined && isObject(data) ? data : {}
  return { ...obj, [head]: setIn(obj[head], rest, value) }
}

export function deleteIn(data: Json, path: string[]): Json {
  if (!isObject(data) || path.length === 0) return data
  const [head, ...rest] = path
  if (!(head in data)) return data
  if (rest.length === 0) return Object.fromEntries(Object.entries(data).filter(([k]) => k !== head))
  return { ...data, [head]: deleteIn(data[head], rest) }
}

const keyPath = (key: string) => key.split(".")
const asObject = (value: Json | undefined): JsonObject => (value !== undefined && isObject(value) ? value : {})
const asArray = (value: Json | undefined): Json[] => (Array.isArray(value) ? value : [])

export function isEmpty(value: Json | undefined): boolean {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)
}

// ---- reading records ---------------------------------------------------------------------

function children(parent: Json, child: string | undefined): Json[] {
  return child ? asArray(asObject(parent)[child]) : asArray(parent)
}

export function parentOptions(data: Json, section: Section): Option[] {
  const source = section.source
  if (source?.kind !== "nested") return []
  return asArray(getIn(data, source.path)).map((parent, i) => {
    const named = asObject(parent)[source.parentTitle ?? "name"]
    return { value: String(i), label: typeof named === "string" && named ? named : `${source.parentLabel} ${i + 1}` }
  })
}

export function readRows(data: Json, section: Section): Row[] {
  const source = section.source
  if (!source) return []

  if (source.kind === "array") {
    return asArray(getIn(data, source.path)).map((value, index) => ({
      ref: { parent: -1, index, key: "" },
      value: asObject(value),
      parentLabel: "",
    }))
  }

  if (source.kind === "nested") {
    const labels = parentOptions(data, section)
    return asArray(getIn(data, source.path)).flatMap((parent, p) =>
      children(parent, source.child).map((value, index) => ({
        ref: { parent: p, index, key: "" },
        value: asObject(value),
        parentLabel: labels[p].label,
      }))
    )
  }

  return Object.entries(asObject(getIn(data, source.path))).map(([key, value], index) => ({
    ref: { parent: -1, index, key },
    value: source.valueLabel ? { [VALUE]: value } : asObject(value),
    parentLabel: "",
  }))
}

// ---- forms -------------------------------------------------------------------------------

// The fields of a section's form, with the parent / key pickers its source needs
export function formFields(section: Section, data: Json): Field[] {
  const source = section.source
  const fields = section.fields ?? []
  if (source?.kind === "nested") {
    return [{ key: PARENT, label: source.parentLabel, type: "select", required: true, options: parentOptions(data, section) }, ...fields]
  }
  if (source?.kind === "map") {
    const key: Field = { key: KEY, label: source.keyLabel, type: "text", required: true, unique: true, lock: true, hint: source.keyHint }
    if (!source.valueLabel) return [key, ...fields]
    return [
      key,
      {
        key: VALUE,
        label: source.valueLabel,
        type: source.valueOptions ? "select" : "text",
        options: source.valueOptions,
        required: true,
      },
    ]
  }
  return fields
}

function formValue(field: Field, value: Json | undefined): Json {
  switch (field.type) {
    case "rows":
      return asArray(value).map((row) => toForm(field.fields ?? [], asObject(row)))
    case "tags":
    case "multiselect":
      return asArray(value).map(String)
    case "number":
      return typeof value === "number" ? value : null
    case "boolean":
      return value === true
    default:
      return typeof value === "string" ? value : isEmpty(value) ? "" : String(value)
  }
}

// A record as the form holds it: every field present, unknown keys carried along untouched
export function toForm(fields: Field[], record: JsonObject): JsonObject {
  let form: Json = record
  for (const field of fields) {
    if (field.type === "file") continue
    const path = keyPath(field.key)
    form = setIn(form, path, formValue(field, getIn(record, path)))
  }
  return asObject(form)
}

export function fromForm(fields: Field[], form: JsonObject): JsonObject {
  let out: Json = form
  for (const field of fields) {
    if (field.key === PARENT || field.key === KEY || field.type === "file") continue
    const path = keyPath(field.key)
    let value = getIn(form, path)
    if (field.type === "rows") value = asArray(value).map((row) => fromForm(field.fields ?? [], asObject(row)))
    if (isEmpty(value)) {
      if (field.omitEmpty) {
        out = deleteIn(out, path)
        continue
      }
      if (field.type === "number") value = 0
    }
    out = setIn(out, path, value ?? "")
  }
  return asObject(deleteIn(deleteIn(out, [PARENT]), [KEY]))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function autoValue(field: Field, form: JsonObject): string {
  const auto = field.auto
  if (!auto) return ""
  const prefix = auto.prefix ?? ""
  if (auto.kind === "uuid") return crypto.randomUUID()
  if (auto.kind === "hex") return prefix + crypto.randomUUID().replace(/-/g, "").slice(0, 17)
  const from = auto.from ? getIn(form, keyPath(auto.from)) : ""
  const slug = slugify(typeof from === "string" ? from : "")
  return slug ? prefix + slug : ""
}

// The form for a new record: blank, defaults for the pickers, generated ids
export function newForm(section: Section, data: Json): JsonObject {
  const fields = formFields(section, data)
  let form = toForm(fields, {})
  if (section.source?.kind === "nested") form = { ...form, [PARENT]: parentOptions(data, section)[0]?.value ?? "" }
  for (const field of fields) {
    if (field.auto && field.auto.kind !== "slug") form = asObject(setIn(form, keyPath(field.key), autoValue(field, form)))
  }
  return form
}

export function editForm(section: Section, data: Json, row: Row): JsonObject {
  return { ...toForm(formFields(section, data), row.value), [PARENT]: String(row.ref.parent), [KEY]: row.ref.key }
}

export function validate(fields: Field[], form: JsonObject, others: Row[]): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of fields) {
    const value = getIn(form, keyPath(field.key))
    if (field.required && isEmpty(value)) {
      errors[field.key] = `${field.label} is required.`
      continue
    }
    if ((field.unique || field.auto) && !isEmpty(value)) {
      const taken = others.some((row) => (field.key === KEY ? row.ref.key : getIn(row.value, keyPath(field.key))) === value)
      if (taken) errors[field.key] = `Another entry already uses this ${field.label.toLowerCase()}.`
    }
    if (field.type === "url" && typeof value === "string" && value && !/^(https?:\/\/|mailto:|tel:|\/)/.test(value)) {
      errors[field.key] = "Start with https://, mailto:, tel: or / for a page in this site."
    }
    if (field.type === "rows") {
      asArray(value).forEach((row, i) => {
        const first = Object.values(validate(field.fields ?? [], asObject(row), []))[0]
        if (first && !errors[field.key]) errors[field.key] = `Row ${i + 1}: ${first}`
      })
    }
  }
  return errors
}

// ---- writing records ---------------------------------------------------------------------

function withChildren(data: Json, section: Section, parent: number, change: (items: Json[]) => Json[]): Json {
  const source = section.source
  if (source?.kind !== "nested") return data
  const path = [...source.path, String(parent), ...(source.child ? [source.child] : [])]
  return setIn(data, path, change(asArray(getIn(data, path))))
}

function afterChange(data: Json, section: Section): Json {
  if (section.sync === "projectTypes") {
    // projectTypes mirrors the list of ids; an entry that already exists keeps its own description
    const existing = asArray(getIn(data, ["projectTypes"])).map(asObject)
    const types = asArray(getIn(data, ["instanceTypeDetails"])).map((type) => {
      const { id = "", description = "" } = asObject(type)
      return existing.find((t) => t.id === id) ?? { id, description }
    })
    return setIn(data, ["projectTypes"], types)
  }
  return data
}

// Adds the record (ref null) or replaces the one at ref
export function saveRow(data: Json, section: Section, ref: RowRef | null, form: JsonObject): Json {
  const source = section.source
  if (!source) return data
  const built = fromForm(formFields(section, data), form)
  const defaults = Object.fromEntries(Object.entries(section.defaults ?? {}).filter(([k]) => !(k in built)))
  const record = ref ? built : { ...built, ...defaults }
  let next = data

  if (source.kind === "array") {
    const items = asArray(getIn(data, source.path))
    next = setIn(data, source.path, ref ? items.map((item, i) => (i === ref.index ? record : item)) : [...items, record])
  } else if (source.kind === "nested") {
    const target = Number(form[PARENT])
    if (ref && ref.parent === target) {
      next = withChildren(data, section, target, (items) => items.map((item, i) => (i === ref.index ? record : item)))
    } else {
      if (ref) next = withChildren(next, section, ref.parent, (items) => items.filter((_, i) => i !== ref.index))
      next = withChildren(next, section, target, (items) => [...items, record])
    }
  } else {
    const key = String(form[KEY])
    const value = source.valueLabel ? (form[VALUE] ?? "") : record
    const entries = Object.entries(asObject(getIn(data, source.path)))
    const updated: [string, Json][] = ref ? entries.map(([k, v]) => (k === ref.key ? [key, value] : [k, v])) : [...entries, [key, value]]
    next = setIn(data, source.path, Object.fromEntries(updated))
  }
  return afterChange(next, section)
}

export function removeRow(data: Json, section: Section, ref: RowRef): Json {
  const source = section.source
  if (!source) return data
  let next = data
  if (source.kind === "array") {
    next = setIn(data, source.path, asArray(getIn(data, source.path)).filter((_, i) => i !== ref.index))
  } else if (source.kind === "nested") {
    next = withChildren(data, section, ref.parent, (items) => items.filter((_, i) => i !== ref.index))
  } else {
    next = setIn(data, source.path, Object.fromEntries(Object.entries(asObject(getIn(data, source.path))).filter(([k]) => k !== ref.key)))
  }
  return afterChange(next, section)
}

function swap<T>(items: T[], i: number, by: number): T[] {
  const j = i + by
  if (j < 0 || j >= items.length) return items
  const next = [...items]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

// Moves a record one place up (-1) or down (1) among its siblings
export function moveRow(data: Json, section: Section, ref: RowRef, by: number): Json {
  const source = section.source
  if (!source) return data
  let next = data
  if (source.kind === "array") {
    next = setIn(data, source.path, swap(asArray(getIn(data, source.path)), ref.index, by))
  } else if (source.kind === "nested") {
    next = withChildren(data, section, ref.parent, (items) => swap(items, ref.index, by))
  } else {
    next = setIn(data, source.path, Object.fromEntries(swap(Object.entries(asObject(getIn(data, source.path))), ref.index, by)))
  }
  return afterChange(next, section)
}

export function siblingCount(rows: Row[], ref: RowRef): number {
  return rows.filter((row) => row.ref.parent === ref.parent).length
}

// Why a record cannot be deleted, or null when it can
export function deleteBlocker(section: Section, row: Row, lookups: Lookups): string | null {
  const guard = section.guard
  if (!guard) return null
  if ("nonEmpty" in guard) {
    const count = asArray(row.value[guard.nonEmpty]).length
    return count > 0 ? `It still has ${count} ${guard.what}. Move or delete those first.` : null
  }
  const id = guard.key === KEY ? row.ref.key : getIn(row.value, keyPath(guard.key))
  const users = typeof id === "string" ? (lookups.usage[guard.usage]?.[id] ?? []) : []
  return users.length > 0 ? `It is used by: ${users.join(", ")}. Change those first.` : null
}

export function rowTitle(section: Section, row: Row): string {
  if (section.source?.kind === "map") return row.ref.key
  const value = getIn(row.value, keyPath(section.titleKey ?? "name"))
  return typeof value === "string" && value ? value : `this ${section.singular}`
}

// ---- labels ------------------------------------------------------------------------------

export interface Label {
  path: string[]
  value: string
}

// Every string in a file, for the "text labels" forms
export function flattenLabels(data: Json | undefined, path: string[] = []): Label[] {
  if (typeof data === "string") return [{ path, value: data }]
  if (Array.isArray(data)) return data.flatMap((item, i) => flattenLabels(item, [...path, String(i)]))
  if (data !== undefined && isObject(data)) return Object.entries(data).flatMap(([k, v]) => flattenLabels(v, [...path, k]))
  return []
}

export function sectionLabels(data: Json, section: Section): Label[] {
  return flattenLabels(data).filter(({ path }) => {
    if (section.include && !section.include.includes(path[0])) return false
    return !section.exclude?.includes(path[0])
  })
}
