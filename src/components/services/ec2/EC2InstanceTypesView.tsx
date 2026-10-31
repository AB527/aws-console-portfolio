"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import ec2Data from "@/data/ec2-projects.json"
import EC2SplitPanel, { splitPanelPadding } from "./EC2SplitPanel"

type SortKey = "id" | "openSource" | "productionGrade" | "techStack" | "usersServed" | "hoursSpent" | "scale"
const COLS: { key: SortKey; label: string }[] = [
  { key: "id", label: "Project type" },
  { key: "openSource", label: "Open source" },
  { key: "productionGrade", label: "Production grade" },
  { key: "techStack", label: "Tech stack" },
  { key: "usersServed", label: "Users served" },
  { key: "hoursSpent", label: "Hours spent" },
  { key: "scale", label: "Scale" },
]

const TABS = ["Details", "Projects"]

const OUTLINE_BTN =
  "h-8 px-5 flex items-center gap-2 rounded-full border-2 border-[#006ce0] text-sm font-bold text-[#006ce0] hover:bg-[#f0fbff] whitespace-nowrap"
const LINK = "text-[#006ce0] underline underline-offset-4"

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

function CopyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-bold">{label}</dt>
      <dd className="flex items-start gap-2 mt-0.5">
        <button
          onClick={() => navigator.clipboard?.writeText(value)}
          aria-label={`Copy ${label}`}
          className="shrink-0 mt-0.5 text-[#006ce0] hover:text-[#002b66]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="8" y="8" width="13" height="13" />
            <path d="M16 8V3H3v13h5" />
          </svg>
        </button>
        <span className="break-words min-w-0">{value}</span>
      </dd>
    </div>
  )
}

export default function EC2InstanceTypesView({ activeType }: { activeType: string | null }) {
  const router = useRouter()
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(activeType)
  const [panelId, setPanelId] = useState<string | null>(activeType)
  const [panelHeight, setPanelHeight] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "id", dir: "asc" })
  const [spinning, setSpinning] = useState(false)

  const regionInstances = ec2Data.instances.filter((i) => i.region === selectedRegion)
  const typesInRegion = new Set(regionInstances.map((i) => i.instanceType))

  const enriched = ec2Data.instanceTypeDetails
    .filter((t) => typesInRegion.has(t.id))
    .map((t) => {
      const projects = regionInstances.filter((i) => i.instanceType === t.id)
      return {
        ...t,
        projects,
        usersServed: projects.reduce((s, i) => s + i.metrics.usersServed, 0),
        hoursSpent: projects.reduce((s, i) => s + i.metrics.hoursSpent, 0),
      }
    })

  const q = search.trim().toLowerCase()
  const filtered = enriched
    .filter((t) => [t.id, t.techStack, t.scale, t.description].some((v) => v.toLowerCase().includes(q)))
    .sort((a, b) => {
      const x = a[sort.key]
      const y = b[sort.key]
      const order = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))
      return order * (sort.dir === "asc" ? 1 : -1)
    })

  const selected = enriched.find((t) => t.id === selectedId) ?? null
  // Keep showing the last project type while the panel slides away
  const panelType = selected ?? enriched.find((t) => t.id === panelId) ?? null

  const select = (id: string | null) => {
    setSelectedId(id)
    if (id) setPanelId(id)
  }

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }))

  const handleRefresh = () => {
    setSpinning(true)
    router.refresh()
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <div
      className="px-6 py-5 text-[14px] leading-5 text-[#0f141a]"
      style={selected ? { paddingBottom: splitPanelPadding(panelHeight) } : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-[24px] leading-[30px] font-bold">
          Project types{" "}
          <span className="font-normal text-[#656871]">
            ({selected ? `1/${enriched.length}` : enriched.length})
          </span>
        </h1>
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
          <Link href={`/ec2/home?view=instance-type-finder&region=${selectedRegion}`} className={OUTLINE_BTN}>
            Project type finder
          </Link>
          <button className={OUTLINE_BTN}>
            Actions
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M1 3h8L5 8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search + pagination */}
      <div className="flex items-center justify-between gap-4 mt-3 mb-2">
        <div className="flex-1 max-w-[915px] flex items-center gap-2 h-8 px-3 border border-[#8c8c94] rounded-lg bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424650" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-5-5" />
          </svg>
          <input
            type="text"
            placeholder="Find project type by attribute"
            aria-label="Find project type by attribute"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 text-sm placeholder:italic placeholder-[#656871] outline-none bg-transparent"
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c6c6cd]">
              <th className="w-12 px-4 py-1.5">
                <span className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => select(selected ? null : filtered[0]?.id ?? null)}
                    aria-label="Toggle selection"
                    className="block w-4 h-4 m-0 accent-[#006ce0]"
                  />
                </span>
              </th>
              {COLS.map((col) => (
                <th key={col.key} className="text-left py-1.5 font-bold text-[#424650]">
                  <button
                    onClick={() => toggleSort(col.key)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-0.5 border-l border-[#c6c6cd] font-bold whitespace-nowrap"
                  >
                    {col.label}
                    <SortIcon dir={sort.key === col.key ? sort.dir : null} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const isSelected = t.id === selected?.id
              return (
                <tr
                  key={t.id}
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
                        onChange={() => select(isSelected ? null : t.id)}
                        aria-label={`Select ${t.id}`}
                        className="block w-4 h-4 m-0 accent-[#006ce0]"
                      />
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <button onClick={() => select(t.id)} className={LINK}>
                      {t.id}
                    </button>
                  </td>
                  <td className="px-4 py-2.5">{String(t.openSource)}</td>
                  <td className="px-4 py-2.5">{String(t.productionGrade)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{t.techStack}</td>
                  <td className="px-4 py-2.5">{t.usersServed.toLocaleString("en-US")}</td>
                  <td className="px-4 py-2.5">{t.hoursSpent.toLocaleString("en-US")}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{t.scale}</td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={COLS.length + 1} className="px-4 py-10 text-center font-bold text-[#424650]">
                  {regionInstances.length === 0
                    ? `No projects in the selected region (${selectedRegion}).`
                    : "No project types match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {panelType && (
        <EC2SplitPanel
          title={`Project type: ${panelType.id}`}
          open={!!selected}
          height={panelHeight}
          onResize={setPanelHeight}
          onClose={() => select(null)}
        >
          <div className="flex flex-wrap border-b border-[#c6c6cd] mb-5">
            {TABS.map((tab, i) => (
              <div key={tab} className="flex items-center">
                {i > 0 && <span className="w-px h-6 bg-[#c6c6cd]" />}
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-3 text-[16px] leading-5 font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab ? "text-[#006ce0]" : "text-[#424650] hover:text-[#006ce0]"
                  }`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute left-0 right-0 bottom-0 h-1 rounded-t bg-[#006ce0]" />}
                </button>
              </div>
            ))}
          </div>

          {activeTab === "Details" ? (
            <dl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-6">
              {[
                { label: "Project type", value: panelType.id },
                { label: "Project family", value: panelType.id.split(".")[0] },
                { label: "Project size", value: panelType.id.split(".")[1] ?? "–" },
                { label: "Scale", value: panelType.scale },
                { label: "Description", value: panelType.description },
                { label: "Tech stack", value: panelType.techStack },
                { label: "Open source", value: String(panelType.openSource) },
                { label: "Production grade", value: String(panelType.productionGrade) },
                { label: "Projects", value: String(panelType.projects.length) },
                { label: "Users served", value: panelType.usersServed.toLocaleString("en-US") },
                { label: "Hours spent", value: panelType.hoursSpent.toLocaleString("en-US") },
              ].map((field, i) => (
                <div key={field.label} className={`pr-5 ${i % 4 === 0 ? "" : "xl:pl-5 xl:border-l border-[#c6c6cd]"}`}>
                  <CopyField label={field.label} value={field.value} />
                </div>
              ))}
            </dl>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#c6c6cd]">
                  <th className="text-left py-1.5 pr-4 font-bold text-[#424650]">Name</th>
                  {["Project state", "Users served", "Hours spent"].map((col) => (
                    <th key={col} className="text-left py-1.5 font-bold text-[#424650]">
                      <span className="block px-4 border-l border-[#c6c6cd] whitespace-nowrap">{col}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {panelType.projects.map((p) => (
                  <tr key={p.id} className="border-b border-[#ebebf0] last:border-b-0">
                    <td className="py-2.5 pr-4">
                      <Link href={`/ec2/home?view=instances&project=${p.id}&region=${selectedRegion}`} className={LINK}>
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 capitalize">{p.status}</td>
                    <td className="px-4 py-2.5">{p.metrics.usersServed.toLocaleString("en-US")}</td>
                    <td className="px-4 py-2.5">{p.metrics.hoursSpent.toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </EC2SplitPanel>
      )}
    </div>
  )
}
