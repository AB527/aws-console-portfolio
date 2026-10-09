"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/formatDate"
import { GITHUB_REPO_URL } from "@/lib/constants"

type S3Object = {
  key: string
  size: string
  lastModified: string
  type: string
  storageClass: string
  url: string
}

type Bucket = {
  id: string
  name: string
  region: string
  createdDate: string
  objects: S3Object[]
}

const TABS = ["Objects"]

function fileExt(key: string): string {
  const dot = key.lastIndexOf(".")
  return dot > -1 ? key.slice(dot + 1) : ""
}

// Convert a Google Drive share/view link into a direct-download link
function driveDownloadUrl(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/) ?? url.match(/[?&]id=([^&]+)/)
  return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : url
}

function SortIcon() {
  return (
    <svg className="inline-block ml-1 text-gray-400" width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
      <path d="M5 0L8 4H2L5 0Z" />
      <path d="M5 12L2 8H8L5 12Z" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg className="shrink-0 text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  )
}

export default function BucketDetail({ bucket }: { bucket: Bucket }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Objects")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [spinning, setSpinning] = useState(false)

  const objects = bucket.objects.filter((o) =>
    o.key.toLowerCase().includes(query.trim().toLowerCase())
  )

  const selectedKeys = Object.keys(selected).filter((k) => selected[k])
  const selectedObj =
    selectedKeys.length === 1 ? bucket.objects.find((o) => o.key === selectedKeys[0]) ?? null : null
  const oneSelected = !!selectedObj
  const allSelected = objects.length > 0 && objects.every((o) => selected[o.key])

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? Object.fromEntries(objects.map((o) => [o.key, true])) : {})

  const handleRefresh = () => {
    setSpinning(true)
    setSelected({})
    setQuery("")
    router.refresh()
    setTimeout(() => setSpinning(false), 600)
  }

  const handleCopyUrl = () => {
    if (selectedObj?.url) navigator.clipboard?.writeText(selectedObj.url)
  }

  const handleOpen = () => {
    if (selectedObj?.url) window.open(selectedObj.url, "_blank", "noopener,noreferrer")
  }

  const handleDownload = () => {
    if (selectedObj?.url) window.open(driveDownloadUrl(selectedObj.url), "_blank", "noopener,noreferrer")
  }

  const disabledBtn =
    "h-8 px-3 flex items-center gap-1 rounded-full border border-gray-300 text-sm text-gray-400 cursor-not-allowed"
  const activeBtn =
    "h-8 px-3 flex items-center gap-1 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"

  return (
    <div className="px-6 py-5 [&_*]:font-bold">
      <div className="flex items-center gap-2 mb-5">
        <h1 className="text-2xl font-semibold text-gray-900 break-all">{bucket.name}</h1>
        <a className="text-xs text-[#0073bb] hover:underline cursor-pointer">Info</a>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-[3px] -mb-px transition-colors ${
              activeTab === tab
                ? "border-[#0073bb] text-gray-900"
                : "border-transparent text-[#0073bb] hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Objects" ? (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="px-4 pt-4">
            <div className="flex items-baseline gap-2">
              <h2 className="text-base font-bold text-gray-900">
                Objects <span className="font-normal text-gray-500">({objects.length})</span>
              </h2>
              <a className="text-xs text-[#0073bb] hover:underline cursor-pointer">Info</a>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <button
                onClick={handleRefresh}
                aria-label="Refresh"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <svg
                  className={spinning ? "animate-spin" : ""}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                  <path d="M21 4v5h-5" />
                </svg>
              </button>
              <button disabled className={disabledBtn}>
                Copy S3 URI
              </button>
              <button onClick={handleCopyUrl} disabled={!oneSelected} className={oneSelected ? activeBtn : disabledBtn}>
                Copy URL
              </button>
              <button onClick={handleDownload} disabled={!oneSelected} className={oneSelected ? activeBtn : disabledBtn}>
                Download
              </button>
              <button onClick={handleOpen} disabled={!oneSelected} className={oneSelected ? activeBtn : disabledBtn}>
                Open
              </button>
              <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className={activeBtn}>
                Create folder
              </a>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 flex items-center gap-1.5 rounded-full bg-[#ff9900] text-sm font-medium text-gray-900 hover:bg-[#ec8c00]"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                Upload
              </a>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              Objects are the fundamental entities stored in Amazon S3. You can use{" "}
              <a className="text-[#0073bb] hover:underline cursor-pointer">Amazon S3 inventory ↗</a> to get a list of
              all objects in your bucket. For others to access your objects, you&apos;ll need to explicitly grant them
              permissions. <a className="text-[#0073bb] hover:underline cursor-pointer">Learn more ↗</a>
            </p>

            {/* Search + pagination */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 flex items-center gap-2 h-9 px-3 border border-gray-300 rounded-lg bg-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#687078" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find objects by prefix"
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
              <button className="w-8 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <span className="text-sm text-gray-700 px-1">1</span>
              <button className="w-8 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <button className="w-8 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-gray-200 bg-white">
                  <th className="px-4 py-2.5 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left px-2 py-2.5 text-xs font-bold text-gray-700">
                    Name <SortIcon />
                  </th>
                  <th className="text-left px-2 py-2.5 text-xs font-bold text-gray-700">
                    Type <SortIcon />
                  </th>
                  <th className="text-left px-2 py-2.5 text-xs font-bold text-gray-700">
                    Last modified <SortIcon />
                  </th>
                  <th className="text-left px-2 py-2.5 text-xs font-bold text-gray-700">
                    Size <SortIcon />
                  </th>
                  <th className="text-left px-2 py-2.5 text-xs font-bold text-gray-700">
                    Storage class <SortIcon />
                  </th>
                </tr>
              </thead>
              <tbody className="[&_*]:!font-normal">
                {objects.map((obj) => (
                  <tr key={obj.key} className="border-b border-gray-100 hover:bg-[#f1faff] transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={!!selected[obj.key]}
                        onChange={(e) => setSelected((p) => ({ ...p, [obj.key]: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <FileIcon />
                        <Link
                          href={`/s3/buckets/${bucket.id}/${encodeURIComponent(obj.key)}`}
                          className="text-[#0073bb] hover:underline"
                        >
                          {obj.key}
                        </Link>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-gray-700">{fileExt(obj.key)}</td>
                    <td className="px-2 py-3 text-gray-700">
                      {formatDate(obj.lastModified)}, 19:14:11 (UTC+05:30)
                    </td>
                    <td className="px-2 py-3 text-gray-700">{obj.size}</td>
                    <td className="px-2 py-3 text-gray-700">{obj.storageClass}</td>
                  </tr>
                ))}
                {objects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                      No objects match &ldquo;{query}&rdquo;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          {activeTab} — Coming soon
        </div>
      )}
    </div>
  )
}
