"use client"

import { useMemo, useState } from "react"
import StatusBadge from "@/components/ui/StatusBadge"
import exploreData from "@/data/explore.json"

const PAGE_SIZE = 4
const COLS = "grid grid-cols-[1.7fr_1.2fr_0.9fr]"

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
}

type Achievement = {
  title: string
  reward: string
  status: string
  link: string
}

function SortIcon() {
  return (
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" className="text-gray-500 shrink-0">
      <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AchievementsWidget() {
  const items = exploreData.items as Achievement[]
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)

  const statuses = useMemo(() => Array.from(new Set(items.map((i) => i.status))), [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((i) => {
      const matchesQuery =
        !q || i.title.toLowerCase().includes(q) || i.reward.toLowerCase().includes(q)
      const matchesStatus = statusFilter === "all" || i.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [items, query, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="-m-3 flex flex-col h-full">
      {/* Controls: filter + search */}
      <div className="flex items-stretch gap-3 px-4 pt-3">
        <div className="relative border border-gray-400 rounded-lg px-3 pt-2.5 pb-1.5 shrink-0">
          <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-gray-700">
            Filter by status
          </span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="appearance-none bg-transparent text-[13px] text-gray-800 pr-6 outline-none cursor-pointer"
          >
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] ?? s}
              </option>
            ))}
          </select>
          <svg
            width="11"
            height="7"
            viewBox="0 0 11 7"
            fill="none"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <path d="M1 1l4.5 4.5L10 1" stroke="#0073bb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex-1 flex items-center gap-2 border border-gray-400 rounded-lg px-3 min-w-0">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-gray-500 shrink-0">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Find achievements"
            className="flex-1 min-w-0 py-2 text-[13px] outline-none bg-transparent placeholder:italic placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-3 px-4 pt-3 text-gray-500">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="disabled:opacity-30 hover:text-gray-800"
          aria-label="Previous page"
        >
          <svg width="7" height="11" viewBox="0 0 8 12" fill="none">
            <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-[13px] font-bold text-gray-800">{currentPage}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="disabled:opacity-30 hover:text-gray-800"
          aria-label="Next page"
        >
          <svg width="7" height="11" viewBox="0 0 8 12" fill="none">
            <path d="M2 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-4 pt-1">
        <div className={`${COLS} border-b border-gray-300 pb-2`}>
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-800">
            Name <SortIcon />
          </div>
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-800 border-l border-gray-200 pl-3">
            Issuer <SortIcon />
          </div>
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-800 border-l border-gray-200 pl-3">
            Status <SortIcon />
          </div>
        </div>

        {pageItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8 gap-1">
            <span className="text-[14px] font-bold text-gray-700">No achievements</span>
            <span className="text-[13px] text-gray-500">Try a different search or filter.</span>
          </div>
        ) : (
          pageItems.map((item, i) => (
            <div key={i} className={`${COLS} items-center py-2.5 border-b border-gray-100`}>
              <div className="pr-2 min-w-0">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-semibold text-[#0073bb] hover:underline"
                  >
                    {item.title}
                  </a>
                ) : (
                  <span className="text-[13px] font-semibold text-gray-800">{item.title}</span>
                )}
              </div>
              <div className="text-[13px] text-gray-600 pl-3 min-w-0 truncate">{item.reward}</div>
              <div className="pl-3">
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 shrink-0">
        <a
          href={exploreData.footer.href}
          className="block text-center text-[13px] font-medium text-[#0073bb] hover:underline py-3"
        >
          {exploreData.footer.label}
        </a>
      </div>
    </div>
  )
}
