"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GITHUB_REPO_URL } from "@/lib/constants"
import type { Route } from "@/lib/vpc"

const CARD = "bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4"
export const LINK = "text-[#006ce0] underline underline-offset-4"

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex-1 max-w-[970px] flex items-center gap-2 h-8 px-3 border border-[#8c8c94] rounded-lg bg-white">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424650" strokeWidth="2.5">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-5-5" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="flex-1 min-w-0 text-sm placeholder:italic placeholder-[#656871] outline-none bg-transparent"
      />
    </div>
  )
}

function Pager() {
  return (
    <div className="flex items-center gap-4 text-[#424650]">
      <svg className="text-[#b4b4bb]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span className="font-bold text-[#0f141a]">1</span>
      <svg className="text-[#b4b4bb]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="m9 18 6-6-6-6" />
      </svg>
      <span className="w-px h-8 bg-[#c6c6cd]" />
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </div>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(text)}
      aria-label={`Copy ${label}`}
      className="inline-flex align-middle mr-1.5 text-[#006ce0] hover:text-[#002b66]"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="8" width="13" height="13" />
        <path d="M16 8V3H3v13h5" />
      </svg>
    </button>
  )
}

export type DetailField = { label: string; value: React.ReactNode; copy?: string }

// "Details" card of a detail panel: fields flow into four divided columns
export function DetailsCard({ fields }: { fields: DetailField[] }) {
  return (
    <div className={CARD}>
      <h3 className="text-[20px] leading-6 font-bold mb-4">Details</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-4">
        {fields.map((field, i) => (
          <div key={field.label} className={`pr-5 ${i % 4 === 0 ? "" : "xl:pl-5 xl:border-l border-[#c6c6cd]"}`}>
            <dt className="font-bold">{field.label}</dt>
            <dd className="break-all mt-0.5">
              {field.copy && <CopyButton text={field.copy} label={field.label} />}
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// "Routes (n)" card: where the subnet's traffic ends up
export function RoutesCard({ routes }: { routes: Route[] }) {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()
  const rows = routes.filter((r) => r.destination.toLowerCase().includes(q) || r.target.toLowerCase().includes(q))

  return (
    <div className={CARD}>
      <h3 className="text-[20px] leading-6 font-bold">
        Routes <span className="font-normal text-[#656871]">({rows.length})</span>
      </h3>
      <div className="flex items-center justify-between gap-4 mt-2 mb-2">
        <SearchBox value={query} onChange={setQuery} placeholder="Filter routes" />
        <Pager />
      </div>
      <SimpleTable columns={["Destination", "Target"]} empty="No routes">
        {rows.map((route) => (
          <tr key={route.destination} className="border-b border-[#ebebf0] last:border-b-0">
            <td className="pr-4 py-2">{route.destination}</td>
            <td className="px-4 py-2">
              {route.url ? (
                <a href={route.url} target="_blank" rel="noopener noreferrer" className={`${LINK} break-all`}>
                  {route.target}
                </a>
              ) : (
                route.target
              )}
            </td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  )
}

export function SimpleTable({ columns, empty, children }: { columns: string[]; empty: string; children: React.ReactNode[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#c6c6cd]">
            {columns.map((col, i) => (
              <th key={col} className="text-left py-1.5 font-bold text-[#424650]">
                <span className={`block py-0.5 whitespace-nowrap ${i === 0 ? "pr-4" : "px-4 border-l border-[#c6c6cd]"}`}>
                  {col}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
          {children.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-6 text-center font-bold text-[#424650]">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

interface ResourceSplitViewProps<T extends { id: string }> {
  title: string
  createLabel: string
  searchPlaceholder: string
  items: T[]
  // Shown in place of the rows while the items are loading
  status?: React.ReactNode
  initialId?: string
  searchText: (item: T) => string
  columns: { label: string; cell: (item: T, select: () => void) => React.ReactNode }[]
  tabs: { label: string; render: (item: T) => React.ReactNode }[]
}

// List on top, detail panel for the selected row below — the layout of the AWS Subnets and Route tables pages
export default function ResourceSplitView<T extends { id: string }>({
  title,
  createLabel,
  searchPlaceholder,
  items,
  status,
  initialId,
  searchText,
  columns,
  tabs,
}: ResourceSplitViewProps<T>) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(
    items.some((i) => i.id === initialId) ? initialId ?? null : items[0]?.id ?? null
  )
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState(tabs[0].label)
  const [spinning, setSpinning] = useState(false)

  const rows = items.filter((i) => searchText(i).toLowerCase().includes(query.trim().toLowerCase()))
  const selected = items.find((i) => i.id === selectedId) ?? null
  const tab = tabs.find((t) => t.label === activeTab) ?? tabs[0]

  const handleRefresh = () => {
    setSpinning(true)
    router.refresh()
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <div>
      {/* List */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[24px] leading-[30px] font-bold">
            {title}{" "}
            <span className="font-normal text-[#656871]">
              ({status ? "–" : selected ? `1/${items.length}` : items.length})
            </span>
          </h1>
          <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRefresh}
            aria-label="Refresh"
            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#006ce0] text-[#006ce0] hover:bg-[#f0fbff]"
          >
            <svg
              className={spinning ? "animate-spin" : ""}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 4v5h-5" />
            </svg>
          </button>
          <button className="h-8 px-5 flex items-center gap-2 rounded-full border-2 border-[#006ce0] text-sm font-bold text-[#006ce0] hover:bg-[#f0fbff] whitespace-nowrap">
            Actions
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M1 3h8L5 8z" />
            </svg>
          </button>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-5 flex items-center rounded-full bg-[#ff9900] text-sm font-bold text-[#0f141a] hover:bg-[#fa6f00] whitespace-nowrap"
          >
            {createLabel}
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-3 mb-2">
        <SearchBox value={query} onChange={setQuery} placeholder={searchPlaceholder} />
        <Pager />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c6c6cd]">
              <th className="w-12 px-4 py-1.5">
                <span className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => setSelectedId(selected ? null : rows[0]?.id ?? null)}
                    aria-label="Toggle selection"
                    className="block w-4 h-4 m-0 accent-[#006ce0]"
                  />
                </span>
              </th>
              {columns.map((col) => (
                <th key={col.label} className="text-left py-1.5 font-bold text-[#424650]">
                  <span className="block px-4 py-0.5 border-l border-[#c6c6cd] whitespace-nowrap">{col.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const isSelected = item.id === selectedId
              const select = () => setSelectedId(item.id)
              return (
                <tr
                  key={item.id}
                  className={
                    isSelected
                      ? "bg-[#f0fbff] outline outline-2 -outline-offset-2 outline-[#006ce0]"
                      : "border-b border-[#ebebf0]"
                  }
                >
                  <td className="w-12 px-4 py-2.5">
                    <span className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => setSelectedId(isSelected ? null : item.id)}
                        aria-label={`Select ${item.id}`}
                        className="block w-4 h-4 m-0 accent-[#006ce0]"
                      />
                    </span>
                  </td>
                  {columns.map((col) => (
                    <td key={col.label} className="px-4 py-2.5 whitespace-nowrap align-middle">
                      {col.cell(item, select)}
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
            {!status && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center font-bold text-[#424650]">
                  No matches for &ldquo;{query}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="mt-8 -mx-4 px-4 lg:-mx-6 lg:px-6 pt-5 border-t border-[#c6c6cd]">
          <h2 className="text-[18px] leading-6 font-bold break-all">{selected.id}</h2>
          <div className="flex flex-wrap border-b border-[#c6c6cd] mt-4 mb-5">
            {tabs.map((t, i) => (
              <div key={t.label} className="flex items-center">
                {i > 0 && <span className="w-px h-6 bg-[#c6c6cd]" />}
                <button
                  onClick={() => setActiveTab(t.label)}
                  className={`relative px-5 py-3 text-[16px] leading-5 font-bold whitespace-nowrap transition-colors ${
                    tab.label === t.label ? "text-[#006ce0]" : "text-[#424650] hover:text-[#006ce0]"
                  }`}
                >
                  {t.label}
                  {tab.label === t.label && (
                    <span className="absolute left-0 right-0 bottom-0 h-1 rounded-t bg-[#006ce0]" />
                  )}
                </button>
              </div>
            ))}
          </div>
          {tab.render(selected)}
        </div>
      )}
    </div>
  )
}
