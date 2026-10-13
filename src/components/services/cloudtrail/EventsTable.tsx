"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/formatDate"
import type { TrailEvent } from "@/lib/cloudtrail"

type Attribute = "name" | "userName" | "source" | "region"
const ATTRIBUTES: { key: Attribute; label: string }[] = [
  { key: "name", label: "Event name" },
  { key: "userName", label: "User name" },
  { key: "source", label: "Event source" },
  { key: "region", label: "AB Region" },
]

type SortKey = Attribute | "time"
const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Event name" },
  { key: "time", label: "Event time" },
  { key: "userName", label: "User name" },
  { key: "source", label: "Event source" },
  { key: "region", label: "AB Region" },
]

function SortIcon({ dir }: { dir: "asc" | "desc" | null }) {
  // Filled = active sort column, outlined = sortable but inactive
  return (
    <svg
      className={`shrink-0 ${dir === "asc" ? "rotate-180" : ""}`}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill={dir ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M2 3.5h8L6 9.5z" />
    </svg>
  )
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  )
}

// `filterable` adds the lookup-attribute filter, pagination and column sorting of the full Event history page
interface EventsTableProps {
  events: TrailEvent[]
  filterable?: boolean
  // Shown in place of the rows while the events are loading
  status?: React.ReactNode
}

export default function EventsTable({ events, filterable = false, status }: EventsTableProps) {
  const [attribute, setAttribute] = useState<Attribute>("name")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "time", dir: "desc" })

  const q = query.trim().toLowerCase()
  const rows = filterable
    ? events
        .filter((e) => e[attribute].toLowerCase().includes(q))
        .sort((a, b) => a[sort.key].localeCompare(b[sort.key]) * (sort.dir === "asc" ? 1 : -1))
    : events

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }))

  const attributeLabel = ATTRIBUTES.find((a) => a.key === attribute)?.label ?? ""

  return (
    <>
      {filterable && (
        <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
          <div className="flex-1 flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select
                value={attribute}
                onChange={(e) => setAttribute(e.target.value as Attribute)}
                aria-label="Lookup attribute"
                className="h-8 pl-3 pr-9 border border-line-strong rounded-lg bg-surface text-sm appearance-none outline-none cursor-pointer"
              >
                {ATTRIBUTES.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.label}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-body"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
              >
                <path d="M1 3h8L5 8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-[200px] max-w-[455px] flex items-center gap-2 h-8 px-3 border border-line-strong rounded-lg bg-surface">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-body)" strokeWidth="2.5">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-5-5" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Enter ${attributeLabel.toLowerCase()}`}
                aria-label={`Filter by ${attributeLabel.toLowerCase()}`}
                className="flex-1 min-w-0 text-sm placeholder:italic placeholder-ink-muted outline-none bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear filter" className="text-ink-body">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 5l14 14M19 5 5 19" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-ink-body">
            <span className="text-ink-disabled">
              <Chevron dir="left" />
            </span>
            <span className="font-bold text-ink">1</span>
            <span className="text-ink-disabled">
              <Chevron dir="right" />
            </span>
            <span className="w-px h-8 bg-line" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line">
              {COLUMNS.map((col, i) => {
                const inner = `flex items-center justify-between gap-2 py-0.5 whitespace-nowrap font-bold ${
                  i === 0 ? "pr-4" : "px-4 border-l border-line"
                }`
                return (
                  <th key={col.key} className="text-left py-1.5 font-bold text-ink-body">
                    {filterable ? (
                      <button onClick={() => toggleSort(col.key)} className={`w-full ${inner}`}>
                        {col.label}
                        <SortIcon dir={sort.key === col.key ? sort.dir : null} />
                      </button>
                    ) : (
                      <span className={inner}>{col.label}</span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((event) => (
              <tr key={event.id} className="border-b border-line-subtle last:border-b-0">
                <td className="pr-4 py-3">
                  <Link href={`/iam/users/${event.trailId}`} className="text-link underline underline-offset-4">
                    {event.name}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(event.time)}</td>
                <td className="px-4 py-3">{event.userName}</td>
                <td className="px-4 py-3">{event.source}</td>
                <td className="px-4 py-3 whitespace-nowrap">{event.region}</td>
              </tr>
            ))}
            {status && (
              <tr>
                <td colSpan={COLUMNS.length}>{status}</td>
              </tr>
            )}
            {!status && rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="py-8 text-center text-ink-body">
                  <p className="font-bold">No events</p>
                  <p className="mt-1">No events to display</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
