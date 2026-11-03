"use client"

import { useState } from "react"
import { getIn, setIn, toForm } from "./engine"
import type { Json, JsonObject } from "./json"
import type { Field, Lookups, Option } from "./schema"

export const INPUT =
  "w-full min-w-0 px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-[#8c8c94] rounded-lg outline-none focus:border-[#006ce0] focus:ring-1 focus:ring-[#006ce0] disabled:bg-[#f2f3f3] disabled:text-[#656871]"
const SMALL_BTN = "px-2 py-0.5 text-xs font-bold text-[#006ce0] rounded hover:bg-[#f0fbff] disabled:text-gray-300 disabled:hover:bg-transparent"
const DANGER_BTN = "px-2 py-0.5 text-xs font-bold text-[#d91515] rounded hover:bg-[#fff5f5]"

function options(field: Field, lookups: Lookups): Option[] {
  const source = field.options
  if (!source) return []
  if (typeof source === "string") return lookups[source]
  return source.map((o) => (typeof o === "string" ? { value: o, label: o } : o))
}

const text = (value: Json | undefined) => (typeof value === "string" ? value : "")
const list = (value: Json | undefined) => (Array.isArray(value) ? value : [])

function Tags({ value, onChange, label }: { value: string[]; onChange: (v: Json) => void; label: string }) {
  const [draft, setDraft] = useState("")
  const add = () => {
    const tag = draft.trim()
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setDraft("")
  }
  return (
    <div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5 text-xs rounded-full bg-[#f0fbff] border border-[#b8e7ff] text-gray-900">
              {tag}
              <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove ${tag}`} className="w-4 h-4 leading-none rounded-full hover:bg-[#b8e7ff]">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            add()
          }
        }}
        onBlur={add}
        placeholder="Type and press Enter"
        aria-label={label}
        className={INPUT}
      />
    </div>
  )
}

function Rows({ field, value, onChange, lookups, idPrefix }: { field: Field; value: Json[]; onChange: (v: Json) => void; lookups: Lookups; idPrefix: string }) {
  const fields = field.fields ?? []
  const replace = (i: number, next: Json) => onChange(value.map((row, j) => (j === i ? next : row)))
  const move = (i: number, by: number) => {
    const next = [...value]
    ;[next[i], next[i + by]] = [next[i + by], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {value.map((row, i) => {
        const title = field.rowTitle ? text(getIn(row, [field.rowTitle])) : ""
        return (
          <div key={i} className="border border-[#c6c6cd] rounded-xl bg-[#fafafa]">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-[#ebebf0]">
              <span className="text-xs font-bold text-[#424650] truncate">{title || `${field.label} ${i + 1}`}</span>
              <span className="flex items-center shrink-0">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className={SMALL_BTN} aria-label="Move up">
                  ↑
                </button>
                <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} className={SMALL_BTN} aria-label="Move down">
                  ↓
                </button>
                <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className={DANGER_BTN}>
                  Remove
                </button>
              </span>
            </div>
            <div className="p-3 space-y-3">
              {fields.map((sub) => (
                <FieldControl
                  key={sub.key}
                  field={sub}
                  value={getIn(row, sub.key.split("."))}
                  onChange={(next) => replace(i, setIn(row, sub.key.split("."), next))}
                  lookups={lookups}
                  idPrefix={`${idPrefix}${field.key}-${i}-`}
                />
              ))}
            </div>
          </div>
        )
      })}
      <button type="button" onClick={() => onChange([...value, toForm(fields, {} as JsonObject)])} className={SMALL_BTN}>
        Add {field.label.toLowerCase()}
      </button>
    </div>
  )
}

interface FieldControlProps {
  field: Field
  value: Json | undefined
  onChange: (value: Json) => void
  lookups: Lookups
  error?: string
  locked?: boolean
  // "file" fields: called with the chosen file
  onUpload?: (file: File) => void
  busy?: boolean
  // Keeps input ids unique inside repeated rows
  idPrefix?: string
}

// One labelled form control, chosen by the field's type
export default function FieldControl({ field, value, onChange, lookups, error, locked = false, onUpload, busy = false, idPrefix = "" }: FieldControlProps) {
  const id = `f-${idPrefix}${field.key}`
  let control: React.ReactNode

  switch (field.type) {
    case "textarea":
      control = <textarea id={id} value={text(value)} onChange={(e) => onChange(e.target.value)} disabled={locked} rows={4} className={INPUT} />
      break
    case "date":
      control = <input id={id} type="date" value={text(value)} onChange={(e) => onChange(e.target.value)} disabled={locked} className={`${INPUT} max-w-[190px]`} />
      break
    case "number":
      control = (
        <input
          id={id}
          type="number"
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber)}
          disabled={locked}
          className={`${INPUT} max-w-[160px]`}
        />
      )
      break
    case "boolean":
      control = <input id={id} type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} disabled={locked} className="w-4 h-4 accent-[#006ce0]" />
      break
    case "colour":
      control = (
        <span className="flex items-center gap-2">
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(text(value)) ? text(value) : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${field.label} picker`}
            className="w-9 h-8 shrink-0 cursor-pointer"
          />
          <input id={id} type="text" value={text(value)} onChange={(e) => onChange(e.target.value)} className={`${INPUT} max-w-[140px]`} />
        </span>
      )
      break
    case "select": {
      const choices = options(field, lookups)
      const current = text(value)
      control = (
        <select id={id} value={current} onChange={(e) => onChange(e.target.value)} disabled={locked} className={INPUT}>
          {(!field.required || current === "") && <option value="">{field.required ? "Choose" : "None"}</option>}
          {current !== "" && !choices.some((o) => o.value === current) && <option value={current}>{current}</option>}
          {choices.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
      break
    }
    case "multiselect": {
      const chosen = list(value).map(String)
      control = (
        <div className="flex flex-col gap-1.5">
          {options(field, lookups).map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                checked={chosen.includes(o.value)}
                onChange={(e) => onChange(e.target.checked ? [...chosen, o.value] : chosen.filter((v) => v !== o.value))}
                className="w-4 h-4 accent-[#006ce0]"
              />
              {o.label}
            </label>
          ))}
        </div>
      )
      break
    }
    case "tags":
      control = <Tags value={list(value).map(String)} onChange={onChange} label={field.label} />
      break
    case "rows":
      control = <Rows field={field} value={list(value)} onChange={onChange} lookups={lookups} idPrefix={idPrefix} />
      break
    case "file":
      control = (
        <input
          id={id}
          type="file"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onUpload?.(file)
          }}
          className="block w-full text-sm text-gray-900 file:mr-3 file:h-8 file:px-4 file:rounded-full file:border-2 file:border-solid file:border-[#006ce0] file:bg-white file:text-sm file:font-bold file:text-[#006ce0] file:cursor-pointer"
        />
      )
      break
    default:
      control = <input id={id} type="text" value={text(value)} onChange={(e) => onChange(e.target.value)} disabled={locked} className={INPUT} />
  }

  return (
    <div>
      <label htmlFor={id} className="block mb-1 text-sm font-bold text-gray-900">
        {field.label}
        {!field.required && field.type !== "boolean" && field.type !== "file" && <span className="font-normal italic text-[#656871]"> - optional</span>}
      </label>
      {control}
      {field.hint && <p className="mt-1 text-xs text-[#656871]">{field.hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-bold text-[#d91515]">
          {error}
        </p>
      )}
    </div>
  )
}
