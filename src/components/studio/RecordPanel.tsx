"use client"

import { useState } from "react"
import { uploadDocument } from "@/app/studio/actions"
import FieldControl from "./FieldControl"
import { autoValue, editForm, formFields, getIn, newForm, setIn, validate, type Row } from "./engine"
import type { Json, JsonObject } from "./json"
import type { Lookups, Section } from "./schema"

interface RecordPanelProps {
  section: Section
  data: Json
  // The record being edited, or null for a new one
  row: Row | null
  rows: Row[]
  lookups: Lookups
  saving: boolean
  error: string
  onSave: (form: JsonObject) => void
  // `uploaded` is true when a file was stored for a record that was never saved
  onCancel: (form: JsonObject, uploaded: boolean) => void
}

const path = (key: string) => key.split(".")

// The right-hand form for adding or editing one record
export default function RecordPanel({ section, data, row, rows, lookups, saving, error, onSave, onCancel }: RecordPanelProps) {
  const fields = formFields(section, data)
  const [form, setForm] = useState<JsonObject>(() => (row ? editForm(section, data, row) : newForm(section, data)))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [uploadNote, setUploadNote] = useState<{ ok: boolean; text: string } | null>(null)

  const setField = (key: string, value: Json) => {
    setTouched((prev) => new Set(prev).add(key))
    setForm((prev) => {
      let next = setIn(prev, path(key), value) as JsonObject
      // Ids follow the field they are made from until someone types in them
      if (!row) {
        for (const field of fields) {
          if (field.auto?.kind === "slug" && field.auto.from === key && !touched.has(field.key)) {
            next = setIn(next, path(field.key), autoValue(field, next)) as JsonObject
          }
        }
      }
      return next
    })
  }

  const upload = async (file: File) => {
    setUploading(true)
    setUploadNote(null)
    const body = new FormData()
    body.set("id", String(form.id ?? ""))
    body.set("file", file)
    const result = await uploadDocument(body)
    setUploading(false)
    if (!result.ok) {
      setUploadNote({ ok: false, text: result.error })
      return
    }
    setUploaded(true)
    setUploadNote({ ok: true, text: `Stored ${file.name}` })
    setForm((prev) => {
      const key = typeof prev.key === "string" ? prev.key : ""
      // The public file path is built from the name's extension, so keep the two in step
      const name = key ? `${key.replace(/\.[^.]*$/, "")}.${result.ext}` : result.fileName
      return { ...prev, key: name, size: result.size, type: result.type, lastModified: result.lastModified, etag: result.etag }
    })
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const others = rows.filter((other) => !row || other.ref.parent !== row.ref.parent || other.ref.index !== row.ref.index)
    const found = validate(fields, form, others)
    setErrors(found)
    if (Object.keys(found).length === 0) onSave(form)
  }

  const cancel = () => onCancel(form, uploaded && !row)

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={cancel} />
      <form
        onSubmit={submit}
        className="absolute right-0 top-[56px] bottom-[32px] w-[560px] max-w-full flex flex-col bg-surface border-l border-line shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <h2 className="text-[20px] leading-6 font-bold text-gray-900 dark:text-ink">
            {row ? "Edit" : "Add"} {section.singular}
          </h2>
          <button type="button" onClick={cancel} aria-label="Close" className="w-8 h-8 text-xl leading-none rounded-full text-ink-body hover:bg-gray-100 dark:hover:bg-surface-subtle">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <FieldControl
                field={field}
                value={getIn(form, path(field.key))}
                onChange={(value) => setField(field.key, value)}
                lookups={lookups}
                error={errors[field.key]}
                locked={(row !== null && field.lock === true) || (field.auto !== undefined && field.auto.kind !== "slug")}
                onUpload={upload}
                busy={uploading}
              />
              {field.type === "file" && (uploading || uploadNote) && (
                <p role="status" className={`mt-1 text-xs font-bold ${uploadNote && !uploadNote.ok ? "text-danger" : "text-success"}`}>
                  {uploading ? "Uploading" : uploadNote?.text}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-line">
          {(error || Object.keys(errors).length > 0) && (
            <span role="alert" className="mr-auto text-sm font-bold text-danger">
              {error || "Fix the highlighted fields."}
            </span>
          )}
          <button
            type="button"
            onClick={cancel}
            className="h-8 px-5 rounded-full border-2 border-link text-sm font-bold text-link hover:bg-surface-selected"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="h-8 px-5 rounded-full bg-[#ff9900] text-sm font-bold text-[#0f141a] hover:bg-[#fa6f00] disabled:bg-gray-200 dark:disabled:bg-line disabled:text-gray-400 dark:disabled:text-ink-disabled"
          >
            {saving ? "Saving" : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}
