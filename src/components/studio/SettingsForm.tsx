"use client"

import { useState } from "react"
import FieldControl, { INPUT } from "./FieldControl"
import { fromForm, getIn, sectionLabels, setIn, toForm, validate } from "./engine"
import { isObject, type Json, type JsonObject } from "./json"
import type { Field, Lookups, Section } from "./schema"

const CARD = "bg-white rounded-2xl border border-[#c6c6cd]"
const SAVE = "h-8 px-5 rounded-full bg-[#ff9900] text-sm font-bold text-[#0f141a] hover:bg-[#fa6f00] disabled:bg-gray-200 disabled:text-gray-400"

interface FormProps {
  data: Json
  saving: boolean
  // Resolves to true when the file was written
  onSave: (next: Json) => Promise<boolean>
}

function SaveBar({ dirty, saving, error }: { dirty: boolean; saving: boolean; error?: string }) {
  return (
    <div className="flex items-center justify-end gap-3 mt-5">
      {error && (
        <span role="alert" className="mr-auto text-sm font-bold text-[#d91515]">
          {error}
        </span>
      )}
      {dirty && !error && <span className="text-sm text-[#855900]">Unsaved changes</span>}
      <button type="submit" disabled={!dirty || saving} className={SAVE}>
        {saving ? "Saving" : "Save"}
      </button>
    </div>
  )
}

// A form over fields that sit at fixed places in a file (not a list of records)
export function SettingsForm({ title, fields, data, lookups, saving, onSave }: FormProps & { title: string; fields: Field[]; lookups: Lookups }) {
  const [form, setForm] = useState<JsonObject>(() => toForm(fields, isObject(data) ? data : {}))
  const [dirty, setDirty] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate(fields, form, [])
    setErrors(found)
    if (Object.keys(found).length > 0) return
    // Only the form's own fields are written; the rest of the file is taken as it is now
    let next = data
    const built = fromForm(fields, form)
    for (const field of fields) {
      const path = field.key.split(".")
      const value = getIn(built, path)
      if (value !== undefined) next = setIn(next, path, value)
    }
    if (await onSave(next)) setDirty(false)
  }

  return (
    <form onSubmit={submit} className={`${CARD} p-5`}>
      <h2 className="text-[18px] leading-6 font-bold text-gray-900">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {fields.map((field) => (
          <div key={field.key} className={field.type === "textarea" || field.type === "rows" ? "md:col-span-2" : ""}>
            <FieldControl
              field={field}
              value={getIn(form, field.key.split("."))}
              onChange={(value) => {
                setForm((prev) => setIn(prev, field.key.split("."), value) as JsonObject)
                setDirty(true)
              }}
              lookups={lookups}
              error={errors[field.key]}
              idPrefix="s-"
            />
          </div>
        ))}
      </div>
      <SaveBar dirty={dirty} saving={saving} error={Object.keys(errors).length > 0 ? "Fix the highlighted fields." : undefined} />
    </form>
  )
}

// "labels › 2 › empty" reads better than a raw path
const labelName = (path: string[]) => path.map((seg) => (/^\d+$/.test(seg) ? String(Number(seg) + 1) : seg)).join(" › ")

// Every piece of text in (part of) a file, one input each, grouped by its top-level key
export function LabelsForm({ section, data, saving, onSave }: FormProps & { section: Section }) {
  const [draft, setDraft] = useState(data)
  const [dirty, setDirty] = useState(false)
  const labels = sectionLabels(draft, section)
  const groups = [...new Set(labels.map((l) => l.path[0]))]

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (await onSave(draft)) setDirty(false)
  }

  return (
    <form onSubmit={submit}>
      <div className="space-y-4">
        {groups.map((group) => (
          <section key={group} className={`${CARD} p-5`}>
            <h2 className="text-[18px] leading-6 font-bold text-gray-900">{group}</h2>
            <div className="mt-4 space-y-3">
              {labels
                .filter((l) => l.path[0] === group)
                .map((l) => {
                  const id = `l-${l.path.join("-")}`
                  const name = l.path.length > 1 ? labelName(l.path.slice(1)) : group
                  const change = (value: string) => {
                    setDraft((prev) => setIn(prev, l.path, value))
                    setDirty(true)
                  }
                  return (
                    <div key={id} className="flex items-start gap-3 max-md:flex-col max-md:gap-1">
                      <label htmlFor={id} className="w-[260px] max-md:w-full shrink-0 pt-1.5 text-sm text-[#424650] break-words">
                        {name}
                      </label>
                      {l.value.length > 80 ? (
                        <textarea id={id} value={l.value} onChange={(e) => change(e.target.value)} rows={3} className={INPUT} />
                      ) : (
                        <input id={id} type="text" value={l.value} onChange={(e) => change(e.target.value)} className={INPUT} />
                      )}
                    </div>
                  )
                })}
            </div>
          </section>
        ))}
      </div>
      <SaveBar dirty={dirty} saving={saving} />
    </form>
  )
}
