"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/formatDate"
import { fileExt } from "@/lib/fileExt"
import { GITHUB_REPO_URL } from "@/lib/constants"
import { openSans } from "@/lib/awsFont"

type S3Object = {
  id: string
  key: string
  size: string
  lastModified: string
  type: string
  storageClass: string
  etag: string
  url: string
}

type Bucket = {
  id: string
  name: string
  region: string
  createdDate: string
  objects: S3Object[]
}

type SortKey = "key" | "type" | "lastModified" | "size" | "storageClass"
const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "key", label: "Name" },
  { key: "type", label: "Type" },
  { key: "lastModified", label: "Last modified" },
  { key: "size", label: "Size" },
  { key: "storageClass", label: "Storage class" },
]

const SIZE_UNITS: Record<string, number> = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 }

// "245 KB" → bytes, so sizes sort numerically
function sizeBytes(size: string): number {
  const [value, unit] = size.split(" ")
  return parseFloat(value) * (SIZE_UNITS[unit] ?? 1)
}

function compare(a: S3Object, b: S3Object, key: SortKey): number {
  if (key === "size") return sizeBytes(a.size) - sizeBytes(b.size)
  if (key === "type") return fileExt(a.key).localeCompare(fileExt(b.key))
  return a[key].localeCompare(b[key])
}

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

function FileIcon() {
  return (
    <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M14 2H5v20h14V7z" />
      <path d="M14 2v5h5" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="8" y="8" width="13" height="13" />
      <path d="M16 8V3H3v13h5" />
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

export default function BucketDetail({ bucket }: { bucket: Bucket }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [spinning, setSpinning] = useState(false)
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "key", dir: "asc" })

  const objects = bucket.objects
    .filter((o) => o.key.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => compare(a, b, sort.key) * (sort.dir === "asc" ? 1 : -1))

  const selectedKeys = Object.keys(selected).filter((k) => selected[k])
  const selectedObj =
    selectedKeys.length === 1 ? bucket.objects.find((o) => o.key === selectedKeys[0]) ?? null : null
  const oneSelected = !!selectedObj
  const hasFile = !!selectedObj?.url
  const allSelected = objects.length > 0 && objects.every((o) => selected[o.key])

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? Object.fromEntries(objects.map((o) => [o.key, true])) : {})

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }))

  const handleRefresh = () => {
    setSpinning(true)
    setSelected({})
    setQuery("")
    router.refresh()
    setTimeout(() => setSpinning(false), 600)
  }

  const handleCopyS3Uri = () => {
    if (selectedObj) navigator.clipboard?.writeText(`s3://${bucket.name}/${selectedObj.key}`)
  }

  const handleCopyUrl = () => {
    if (selectedObj?.url) navigator.clipboard?.writeText(new URL(selectedObj.url, window.location.origin).href)
  }

  const handleOpen = () => {
    if (selectedObj?.url) window.open(selectedObj.url, "_blank", "noopener,noreferrer")
  }

  const handleDownload = () => {
    if (!selectedObj?.url) return
    const link = document.createElement("a")
    link.href = selectedObj.url
    link.download = selectedObj.key
    link.click()
  }

  const pillBtn = "h-8 px-5 flex items-center gap-2 rounded-full border-2 text-sm font-bold whitespace-nowrap"
  const disabledBtn = `${pillBtn} border-[#b4b4bb] text-[#8c8c94] cursor-not-allowed`
  const activeBtn = `${pillBtn} border-[#006ce0] text-[#006ce0] hover:bg-[#f0fbff]`

  return (
    <div className={`${openSans.className} px-6 py-5 text-[14px] leading-5 text-[#0f141a]`}>
      <div className="flex items-baseline gap-2 mb-3">
        <h1 className="text-[24px] leading-[30px] font-bold break-all">{bucket.name}</h1>
        <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#c6c6cd] mb-5">
        <span className="relative px-5 py-3 text-[16px] leading-5 font-bold text-[#006ce0]">
          Objects
          <span className="absolute left-0 right-0 bottom-0 h-1 rounded-t bg-[#006ce0]" />
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
        <h2 className="text-[20px] leading-6 font-bold">
          Objects <span className="font-normal text-[#656871]">({objects.length})</span>
        </h2>

        {/* Toolbar */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
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
          <button onClick={handleCopyS3Uri} disabled={!oneSelected} className={oneSelected ? activeBtn : disabledBtn}>
            <CopyIcon />
            Copy S3 URI
          </button>
          <button onClick={handleCopyUrl} disabled={!hasFile} className={hasFile ? activeBtn : disabledBtn}>
            <CopyIcon />
            Copy URL
          </button>
          <button onClick={handleDownload} disabled={!hasFile} className={hasFile ? activeBtn : disabledBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12M6 10l6 6 6-6M4 21h16" />
            </svg>
            Download
          </button>
          <button onClick={handleOpen} disabled={!hasFile} className={hasFile ? activeBtn : disabledBtn}>
            Open
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 3h7v7M21 3l-9 9M10 5H3v16h16v-7" />
            </svg>
          </button>
          <button disabled className={disabledBtn}>
            Delete
          </button>
          <button className={activeBtn}>
            Actions
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M1 3h8L5 8z" />
            </svg>
          </button>
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className={activeBtn}>
            Create folder
          </a>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-5 flex items-center gap-2 rounded-full bg-[#ff9900] text-sm font-bold text-[#0f141a] hover:bg-[#fa6f00] whitespace-nowrap"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 21V8M6 13l6-6 6 6M4 3h16" />
            </svg>
            Upload
          </a>
        </div>

        <p className="mt-2">
          Objects are the fundamental entities stored in Amazon S3. You can use{" "}
          <a className="text-[#006ce0] underline underline-offset-4 cursor-pointer">Amazon S3 inventory ↗</a> to get a
          list of all objects in your bucket. For others to access your objects, you&apos;ll need to explicitly grant
          them permissions. <a className="text-[#006ce0] underline underline-offset-4 cursor-pointer">Learn more ↗</a>
        </p>

        {/* Search + pagination */}
        <div className="flex items-center justify-between gap-4 mt-3">
          <div className="flex-1 max-w-[455px] flex items-center gap-2 h-8 px-3 border border-[#8c8c94] rounded-lg bg-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424650" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-5-5" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find objects by prefix"
              className="flex-1 text-sm placeholder:italic placeholder-[#656871] outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center gap-4 text-[#424650]">
            <span className="text-[#b4b4bb]">
              <Chevron dir="left" />
            </span>
            <span className="font-bold text-[#0f141a]">1</span>
            <span className="text-[#b4b4bb]">
              <Chevron dir="right" />
            </span>
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
                <th className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => toggleAll(e.target.checked)}
                    aria-label="Select all objects"
                    className="w-4 h-4 align-middle accent-[#006ce0]"
                  />
                </th>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="text-left py-1.5 font-bold text-[#424650]">
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-0.5 border-l border-[#c6c6cd] font-bold whitespace-nowrap"
                    >
                      {col.label}
                      <SortIcon dir={sort.key === col.key ? sort.dir : null} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {objects.map((obj) => (
                <tr key={obj.key} className="border-b border-[#ebebf0] last:border-b-0">
                  <td className="py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!selected[obj.key]}
                      onChange={(e) => setSelected((p) => ({ ...p, [obj.key]: e.target.checked }))}
                      aria-label={`Select ${obj.key}`}
                      className="w-4 h-4 align-middle accent-[#006ce0]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileIcon />
                      <Link
                        href={`/s3/buckets/${bucket.id}/${encodeURIComponent(obj.key)}`}
                        className="text-[#006ce0] underline underline-offset-4 break-all"
                      >
                        {obj.key}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">{fileExt(obj.key)}</td>
                  <td className="px-4 py-3">{formatDate(obj.lastModified)}, 19:14:11 (UTC+05:30)</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{obj.size}</td>
                  <td className="px-4 py-3">{obj.storageClass}</td>
                </tr>
              ))}
              {objects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#424650]">
                    No objects match &ldquo;{query}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
