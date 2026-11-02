"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/formatDate"
import { GITHUB_REPO_URL } from "@/lib/constants"
import { openSans } from "@/lib/awsFont"
import { DataStatusRow } from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

const REGION_NAMES: Record<string, string> = {
  "ap-south-1": "Asia Pacific (Mumbai) ap-south-1",
  "ap-south-17": "Asia Pacific (Raipur) ap-south-17",
}

function regionLabel(region: string): string {
  return REGION_NAMES[region] ?? region
}

const TABS = ["General purpose buckets", "Directory buckets"]

type SortKey = "name" | "region" | "createdDate"
const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "region", label: "AB Region" },
  { key: "createdDate", label: "Creation date" },
]

function SortIcon({ dir }: { dir: "asc" | "desc" | null }) {
  // Filled = active sort column, outlined = sortable but inactive
  return (
    <svg
      className={dir === "desc" ? "" : dir === "asc" ? "rotate-180" : ""}
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

export default function BucketsList() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "name", dir: "asc" })

  const { data: s3Data, error, reload } = useData("s3")

  const buckets = (s3Data?.buckets ?? [])
    .filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => a[sort.key].localeCompare(b[sort.key]) * (sort.dir === "asc" ? 1 : -1))

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }))

  const handleRefresh = () => {
    setSpinning(true)
    setSelected(null)
    setQuery("")
    router.refresh()
    setTimeout(() => setSpinning(false), 600)
  }

  const handleCopyArn = () => {
    if (!selected) return
    navigator.clipboard?.writeText(`arn:aws:s3:::${selected}`)
  }

  const pillBtn = "h-8 px-5 flex items-center gap-2 rounded-full border-2 text-sm font-bold whitespace-nowrap"
  const disabledBtn = `${pillBtn} border-[#b4b4bb] text-[#8c8c94] cursor-not-allowed`
  const activeBtn = `${pillBtn} border-[#006ce0] text-[#006ce0] hover:bg-[#f0fbff]`

  return (
    <div className={`${openSans.className} text-[14px] leading-5 text-[#0f141a]`}>
      <h1 className="text-[24px] leading-[30px] font-bold mb-2">Buckets</h1>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-[#c6c6cd] mb-5">
        {TABS.map((tab, i) => (
          <div key={tab} className="flex items-center">
            {i > 0 && <span className="w-px h-6 bg-[#c6c6cd]" />}
            <button
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-3 px-5 py-3 text-[16px] leading-5 font-bold whitespace-nowrap transition-colors ${
                activeTab === tab ? "text-[#006ce0]" : "text-[#424650] hover:text-[#006ce0]"
              }`}
            >
              {tab}
              {i === 0 && (
                <span className="text-[12px] leading-4 font-normal text-white bg-[#424650] rounded px-2 py-0.5">
                  All AB Regions
                </span>
              )}
              {activeTab === tab && <span className="absolute left-0 right-0 bottom-0 h-1 rounded-t bg-[#006ce0]" />}
            </button>
          </div>
        ))}
      </div>

      {activeTab === TABS[0] ? (
        <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
          {/* Card header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-[20px] leading-6 font-bold">
                  General purpose buckets <span className="font-normal text-[#656871]">({s3Data ? buckets.length : "–"})</span>
                </h2>
                <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
              </div>
              <p className="mt-1">Buckets are containers for data stored in Documents.</p>
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
              <button onClick={handleCopyArn} disabled={!selected} className={selected ? activeBtn : disabledBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="8" y="8" width="13" height="13" />
                  <path d="M16 8V3H3v13h5" />
                </svg>
                Copy ARN
              </button>
              <button disabled className={disabledBtn}>
                Empty
              </button>
              <button disabled className={disabledBtn}>
                Delete
              </button>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-5 flex items-center rounded-full bg-[#ff9900] text-sm font-bold text-[#0f141a] hover:bg-[#fa6f00] whitespace-nowrap"
              >
                Create bucket
              </a>
            </div>
          </div>

          {/* Search + pagination */}
          <div className="flex items-center justify-between gap-4 mt-3">
            <div className="flex-1 max-w-[745px] flex items-center gap-2 h-8 px-3 border border-[#8c8c94] rounded-lg bg-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424650" strokeWidth="2.5">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-5-5" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find buckets by name"
                className="flex-1 text-sm placeholder:italic placeholder-[#656871] outline-none bg-transparent"
              />
            </div>
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
          </div>

          {/* Table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#c6c6cd]">
                  <th className="w-12"></th>
                  {COLUMNS.map((col) => (
                    <th key={col.key} className="text-left py-1.5 font-bold text-[#424650]">
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-0.5 border-l border-[#c6c6cd] font-bold"
                      >
                        {col.label}
                        <SortIcon dir={sort.key === col.key ? sort.dir : null} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buckets.map((bucket) => (
                  <tr key={bucket.id} className="border-b border-[#ebebf0] last:border-b-0">
                    <td className="py-3 text-center">
                      <input
                        type="radio"
                        name="bucket"
                        checked={selected === bucket.id}
                        onChange={() => setSelected(bucket.id)}
                        className="w-4 h-4 align-middle accent-[#006ce0]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/s3/buckets/${bucket.id}`} className="text-[#006ce0] underline underline-offset-4">
                        {bucket.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{regionLabel(bucket.region)}</td>
                    <td className="px-4 py-3">{formatDate(bucket.createdDate)}, 01:47:56 (UTC+05:30)</td>
                  </tr>
                ))}
                {!s3Data && <DataStatusRow colSpan={4} label="buckets" error={error} onRetry={reload} />}
                {s3Data && buckets.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[#424650]">
                      No buckets match &ldquo;{query}&rdquo;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
          <h2 className="text-[20px] leading-6 font-bold">
            Directory buckets <span className="font-normal text-[#656871]">(0)</span>
          </h2>
          <div className="py-8 text-center text-[#424650]">
            <p className="font-bold">No directory buckets</p>
            <p className="mt-1">You don&apos;t have any directory buckets.</p>
          </div>
        </div>
      )}
    </div>
  )
}
