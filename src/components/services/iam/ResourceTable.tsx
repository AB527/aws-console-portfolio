"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GITHUB_REPO_URL } from "@/lib/constants"
import iamConsole from "@data/iam-console.json"
import InfoLink from "@/components/ui/InfoLink"

export interface Column<T> {
  header: string
  render: (row: T) => React.ReactNode
  sortValue?: (row: T) => string | number
}

interface ResourceTableProps<T> {
  title: string
  // Help topic opened by the Info link
  infoTopic: string
  description: string
  columns: Column<T>[]
  rows: T[]
  // Shown in place of the rows while they are loading
  status?: React.ReactNode
  rowKey: (row: T) => string
  searchText: (row: T) => string
  searchPlaceholder: string
  createLabel: string
  emptyText: string
}

type SortDir = "asc" | "desc"

function SortIcon({ dir }: { dir: SortDir | null }) {
  return (
    <svg className="shrink-0 text-gray-700 dark:text-ink-body" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      {dir === "asc" ? <path d="M5 1l4 7H1z" /> : <path d="M5 9L1 2h8z" fill={dir ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />}
    </svg>
  )
}

export default function ResourceTable<T>({
  title,
  infoTopic,
  description,
  columns,
  rows,
  status,
  rowKey,
  searchText,
  searchPlaceholder,
  createLabel,
  emptyText,
}: ResourceTableProps<T>) {
  const router = useRouter()
  const labels = iamConsole.table
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<{ col: number; dir: SortDir }>({ col: 0, dir: "asc" })
  const [spinning, setSpinning] = useState(false)

  const q = query.trim().toLowerCase()
  const filtered = rows.filter((row) => searchText(row).toLowerCase().includes(q))

  const sortCol = columns[sort.col]
  const visible = sortCol?.sortValue
    ? [...filtered].sort((a, b) => {
        const va = sortCol.sortValue!(a)
        const vb = sortCol.sortValue!(b)
        const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb))
        return sort.dir === "asc" ? cmp : -cmp
      })
    : filtered

  const allSelected = visible.length > 0 && visible.every((r) => selected.has(rowKey(r)))

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(visible.map(rowKey)))
  }

  const toggleRow = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleSort = (col: number) => {
    setSort((s) => (s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: "asc" }))
  }

  const handleRefresh = () => {
    setSpinning(true)
    setSelected(new Set())
    setQuery("")
    router.refresh()
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-gray-200 dark:border-line shadow-sm">
      <div className="px-5 pt-5">
        {/* Header + actions */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-2">
            <h1 className="text-[22px] font-bold text-gray-900 dark:text-ink">
              {title} <span className="font-normal text-gray-500 dark:text-ink-muted">({status ? "–" : rows.length})</span>
            </h1>
            <InfoLink topic={infoTopic} className="text-xs font-bold text-[#0073bb] dark:text-link hover:underline" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              aria-label={labels.refreshLabel}
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[#0073bb] dark:border-link text-[#0073bb] dark:text-link hover:bg-[#f1faff] dark:hover:bg-surface-selected"
            >
              <svg className={spinning ? "animate-spin" : ""} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 4v5h-5" />
              </svg>
            </button>
            <button
              disabled
              className="h-9 px-5 rounded-full border-2 border-gray-300 dark:border-line text-sm font-bold text-gray-400 dark:text-ink-muted cursor-not-allowed"
            >
              {labels.deleteLabel}
            </button>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-5 flex items-center rounded-full bg-[#ff9900] text-sm font-bold text-gray-900 hover:bg-[#ec8c00]"
            >
              {createLabel}
            </a>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-ink-body mt-1">{description}</p>

        {/* Search + pagination */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 max-w-[70%] flex items-center gap-2 h-9 px-3 border border-gray-400 dark:border-line-strong rounded-lg bg-surface">
            <svg className="text-[#414d5c] dark:text-ink-body" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 text-sm text-gray-700 dark:text-ink-body placeholder-gray-500 dark:placeholder-ink-muted placeholder:italic outline-none bg-transparent"
            />
          </div>
          <div className="ml-auto flex items-center gap-1 text-gray-400 dark:text-ink-muted">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-surface-subtle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <span className="text-sm font-bold text-gray-900 dark:text-ink px-1">1</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-surface-subtle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            <span className="w-px h-6 bg-gray-300 dark:bg-line mx-2" />
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 dark:text-ink-body hover:bg-gray-100 dark:hover:bg-surface-subtle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-line">
              <th className="pl-5 pr-2 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label={labels.selectAllLabel}
                  className="w-4 h-4 accent-[#0073bb] dark:accent-link align-middle"
                />
              </th>
              {columns.map((col, i) => (
                <th key={col.header} className="text-left px-3 py-3 font-bold text-gray-900 dark:text-ink">
                  <span className="flex items-center gap-2 border-l border-gray-300 dark:border-line pl-3">
                    {col.sortValue ? (
                      <button onClick={() => toggleSort(i)} className="flex-1 flex items-center justify-between gap-2 text-left">
                        {col.header}
                        <SortIcon dir={sort.col === i ? sort.dir : null} />
                      </button>
                    ) : (
                      col.header
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const key = rowKey(row)
              const checked = selected.has(key)
              return (
                <tr
                  key={key}
                  className={`border-b border-gray-100 dark:border-line-subtle transition-colors ${checked ? "bg-[#f1faff] dark:bg-surface-selected" : "hover:bg-[#f1faff] dark:hover:bg-surface-selected"}`}
                >
                  <td className="pl-5 pr-2 py-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRow(key)}
                      className="w-4 h-4 accent-[#0073bb] dark:accent-link align-middle"
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.header} className="px-3 py-3 text-gray-700 dark:text-ink-body">
                      <div className="pl-3">{col.render(row)}</div>
                    </td>
                  ))}
                </tr>
              )
            })}
            {status && (
              <tr>
                <td colSpan={columns.length + 1}>{status}</td>
              </tr>
            )}
            {!status && visible.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-sm font-bold text-gray-500 dark:text-ink-muted">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
