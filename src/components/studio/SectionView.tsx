"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteDocumentFile, saveDataFile } from "@/app/studio/actions"
import { formatDate } from "@/lib/formatDate"
import ConfirmDialog from "./ConfirmDialog"
import RecordPanel from "./RecordPanel"
import { LabelsForm, SettingsForm } from "./SettingsForm"
import { KEY, PARENT, VALUE, deleteBlocker, getIn, moveRow, readRows, removeRow, rowTitle, saveRow, siblingCount, type Row } from "./engine"
import type { Json, JsonObject } from "./json"
import type { Column, Lookups } from "./schema"
import { findSection } from "./sections"

const CARD = "bg-surface rounded-2xl border border-line"
const TH = "text-left px-3 py-3 font-bold text-gray-900 dark:text-ink whitespace-nowrap"
const TD = "px-3 py-3 text-gray-700 dark:text-ink-body"
const ROW_BTN = "px-2 py-0.5 text-sm font-bold rounded disabled:text-gray-300 dark:disabled:text-ink-disabled disabled:hover:bg-transparent"

function cell(row: Row, column: Column): React.ReactNode {
  if (column.key === PARENT) return row.parentLabel
  if (column.key === KEY) return row.ref.key
  const value = getIn(row.value, column.key === VALUE ? [VALUE] : column.key.split("."))

  switch (column.format) {
    case "count":
      return Array.isArray(value) ? value.length : 0
    case "yesno":
      return value === true ? "Yes" : "No"
    case "date":
      return typeof value === "string" && value ? formatDate(value) : "–"
    case "colour":
      return typeof value === "string" ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: value }} />
          {value}
        </span>
      ) : (
        "–"
      )
    default:
      return typeof value === "string" || typeof value === "number" ? value || "–" : "–"
  }
}

function searchText(row: Row): string {
  return `${row.ref.key} ${row.parentLabel} ${JSON.stringify(row.value)}`.toLowerCase()
}

interface SectionViewProps {
  sectionId: string
  initial: Json
  lookups: Lookups
}

// One studio screen: a list with add / edit / delete, a settings form, or a labels form
export default function SectionView({ sectionId, initial, lookups }: SectionViewProps) {
  const router = useRouter()
  const [data, setData] = useState(initial)
  const [query, setQuery] = useState("")
  // undefined: panel closed, null: adding, a row: editing
  const [editing, setEditing] = useState<Row | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<Row | null>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [panelError, setPanelError] = useState("")
  const [saving, startSaving] = useTransition()

  const section = findSection(sectionId)
  if (!section) return null

  const rows = readRows(data, section)
  const q = query.trim().toLowerCase()
  const visible = q ? rows.filter((row) => searchText(row).includes(q)) : rows
  const hasFile = section.fields?.some((f) => f.type === "file") ?? false

  // Writes the file, then refreshes so dropdown choices and delete checks see the change
  const write = async (next: Json, done: string): Promise<boolean> => {
    const result = await saveDataFile(section.file, next)
    if (!result.ok) {
      setMessage({ ok: false, text: result.error })
      return false
    }
    setData(next)
    setMessage({ ok: true, text: done })
    router.refresh()
    return true
  }

  const save = (form: JsonObject) => {
    if (editing === undefined) return
    setPanelError("")
    startSaving(async () => {
      const result = await saveDataFile(section.file, saveRow(data, section, editing?.ref ?? null, form))
      if (!result.ok) {
        setPanelError(result.error)
        return
      }
      setData(saveRow(data, section, editing?.ref ?? null, form))
      setMessage({ ok: true, text: `Saved ${section.singular}` })
      setEditing(undefined)
      router.refresh()
    })
  }

  const cancel = (form: JsonObject, uploaded: boolean) => {
    setEditing(undefined)
    setPanelError("")
    // A file stored for a record that was never saved would be left behind
    if (uploaded && typeof form.id === "string") void deleteDocumentFile(form.id)
  }

  const confirmDelete = () => {
    if (!deleting) return
    const row = deleting
    startSaving(async () => {
      const ok = await write(removeRow(data, section, row.ref), `Deleted ${rowTitle(section, row)}`)
      if (ok && hasFile && typeof row.value.id === "string") await deleteDocumentFile(row.value.id)
      setDeleting(null)
    })
  }

  const move = (row: Row, by: number) => {
    startSaving(async () => {
      await write(moveRow(data, section, row.ref, by), "Order saved")
    })
  }

  const blocker = deleting ? deleteBlocker(section, deleting, lookups) : null

  return (
    <div>
      <Link href="/studio" className="text-sm text-link hover:underline">
        ← Studio
      </Link>
      <div className="flex items-end justify-between gap-3 flex-wrap mt-2 mb-4">
        <div>
          <h1 className="text-[24px] leading-[30px] font-bold text-gray-900 dark:text-ink">{section.title}</h1>
          <p className="mt-1 text-sm text-ink-body">
            {section.description} <span className="text-ink-muted">Saved in {section.file}.json.</span>
          </p>
        </div>
        {message && (
          <span role="status" className={`text-sm font-bold ${message.ok ? "text-success" : "text-danger"}`}>
            {message.text}
          </span>
        )}
      </div>

      {section.kind === "labels" && (
        <LabelsForm section={section} data={data} saving={saving} onSave={(next) => write(next, "Saved")} />
      )}

      {section.kind === "settings" && (
        <SettingsForm
          title={section.title}
          fields={section.fields ?? []}
          data={data}
          lookups={lookups}
          saving={saving}
          onSave={(next) => write(next, "Saved")}
        />
      )}

      {section.kind === "list" && (
        <div className="space-y-6">
          <section className={`${CARD} overflow-hidden`}>
            <div className="flex items-center justify-between gap-3 flex-wrap px-5 pt-5">
              <h2 className="text-[18px] leading-6 font-bold text-gray-900 dark:text-ink">
                {section.title} <span className="font-normal text-gray-500 dark:text-ink-muted">({rows.length})</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setPanelError("")
                  setEditing(null)
                }}
                className="h-8 px-5 rounded-full bg-[#ff9900] text-sm font-bold text-[#0f141a] hover:bg-[#fa6f00] whitespace-nowrap"
              >
                Add {section.singular}
              </button>
            </div>
            <div className="px-5 mt-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${section.title.toLowerCase()}`}
                aria-label={`Search ${section.title.toLowerCase()}`}
                className="w-full max-w-[420px] h-9 px-3 text-sm text-gray-900 dark:text-ink border border-line-strong rounded-lg outline-none focus:border-link"
              />
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-line">
                    {(section.columns ?? []).map((column, i) => (
                      <th key={column.key} className={`${TH} ${i === 0 ? "pl-5" : ""}`}>
                        {column.label}
                      </th>
                    ))}
                    <th className={`${TH} pr-5 text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={`${row.ref.parent}-${row.ref.index}-${row.ref.key}`} className="border-b border-gray-100 dark:border-line-subtle hover:bg-[#f1faff] dark:hover:bg-surface-selected">
                      {(section.columns ?? []).map((column, i) => (
                        <td key={column.key} className={`${TD} ${i === 0 ? "pl-5 text-gray-900 dark:text-ink" : ""} max-w-[320px] truncate`}>
                          {cell(row, column)}
                        </td>
                      ))}
                      <td className={`${TD} pr-5 text-right whitespace-nowrap`}>
                        <button
                          type="button"
                          disabled={saving || q !== "" || row.ref.index === 0}
                          onClick={() => move(row, -1)}
                          aria-label="Move up"
                          className={`${ROW_BTN} text-link hover:bg-surface-selected`}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={saving || q !== "" || row.ref.index === siblingCount(rows, row.ref) - 1}
                          onClick={() => move(row, 1)}
                          aria-label="Move down"
                          className={`${ROW_BTN} text-link hover:bg-surface-selected`}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPanelError("")
                            setEditing(row)
                          }}
                          className={`${ROW_BTN} text-link hover:bg-surface-selected`}
                        >
                          Edit
                        </button>
                        <button type="button" onClick={() => setDeleting(row)} className={`${ROW_BTN} text-danger hover:bg-[#fff5f5] dark:hover:bg-danger/10`}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visible.length === 0 && (
                    <tr>
                      <td colSpan={(section.columns?.length ?? 0) + 1} className="px-4 py-6 text-center text-sm font-bold text-gray-500 dark:text-ink-muted">
                        {q ? "Nothing matches the search" : `No ${section.title.toLowerCase()} yet`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {section.settings && (
            <SettingsForm
              title={section.settingsTitle ?? "Settings"}
              fields={section.settings}
              data={data}
              lookups={lookups}
              saving={saving}
              onSave={(next) => write(next, "Saved")}
            />
          )}
        </div>
      )}

      {editing !== undefined && (
        <RecordPanel
          key={editing ? `${editing.ref.parent}-${editing.ref.index}-${editing.ref.key}` : "new"}
          section={section}
          data={data}
          row={editing}
          rows={rows}
          lookups={lookups}
          saving={saving}
          error={panelError}
          onSave={save}
          onCancel={cancel}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${section.singular}`}
          confirmLabel={blocker ? undefined : "Delete"}
          busy={saving}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        >
          {blocker ? (
            <p>
              <strong>{rowTitle(section, deleting)}</strong> cannot be deleted. {blocker}
            </p>
          ) : (
            <p>
              Delete <strong>{rowTitle(section, deleting)}</strong>? {hasFile ? "Its file is deleted too. " : ""}This cannot be undone here.
            </p>
          )}
        </ConfirmDialog>
      )}
    </div>
  )
}
