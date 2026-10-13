"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatPeriod } from "@/lib/formatDate"
import regionsData from "@data/regions.json"
import { useConsoleStore } from "@/store/useConsoleStore"
import { DataStatusRow } from "@/components/ui/DataStatus"
import { useData, type ContentData } from "@/hooks/useData"
import EC2HomeView from "./EC2HomeView"
import EC2InstanceTypesView from "./EC2InstanceTypesView"
import EC2InstanceTypeFinderView from "./EC2InstanceTypeFinderView"
import EC2SplitPanel, { splitPanelPadding } from "./EC2SplitPanel"
import InfoLink from "@/components/ui/InfoLink"

type Instance = ContentData["ec2-projects"]["instances"][number]

type SortKey = "name" | "status" | "instanceType"
const COLS: { label: string; sortKey?: SortKey }[] = [
  { label: "Name", sortKey: "name" },
  { label: "Project ID" },
  { label: "Project state", sortKey: "status" },
  { label: "Project type", sortKey: "instanceType" },
  { label: "Status check" },
  { label: "Availability Zone" },
  { label: "Users served" },
  { label: "Period" },
]

const OUTLINE_BTN =
  "h-8 px-5 flex items-center gap-2 rounded-full border-2 border-[#006ce0] text-sm font-bold text-[#006ce0] hover:bg-[#f0fbff] whitespace-nowrap"

function Caret() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M1 3h8L5 8z" />
    </svg>
  )
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

function ZoomIcon({ out }: { out?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d={out ? "m21 21-5-5M8 11h6" : "m21 21-5-5M8 11h6M11 8v6"} />
    </svg>
  )
}

interface EC2DashboardProps {
  view?: string | null
  activeProject?: string | null
  activeType?: string | null
}

export default function EC2Dashboard({ view, activeProject, activeType }: EC2DashboardProps) {
  if (!view && !activeProject) return <EC2HomeView />
  if (view === "instance-types") return <EC2InstanceTypesView activeType={activeType ?? null} />
  if (view === "instance-type-finder") return <EC2InstanceTypeFinderView />
  return <EC2InstancesView activeProject={activeProject ?? null} />
}

function EC2InstancesView({ activeProject }: { activeProject: string | null }) {
  const router = useRouter()
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>(activeProject ? [activeProject] : [])
  const [panelId, setPanelId] = useState<string | null>(activeProject)
  const [panelHeight, setPanelHeight] = useState<number | null>(null)
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null)
  const [spinning, setSpinning] = useState(false)
  const { data: ec2Data, error, reload } = useData("ec2-projects")
  const instances = ec2Data?.instances ?? []

  const zone =
    regionsData.groups.flatMap((g) => g.regions).find((r) => r.id === selectedRegion)?.zones?.[0]?.name ?? selectedRegion

  const q = search.trim().toLowerCase()
  const filtered = instances
    .filter((inst) => {
      const matchRegion = inst.region === selectedRegion
      const matchSearch =
        !q || [inst.name, inst.id, inst.status, inst.instanceType, ...inst.tags].some((v) => v.toLowerCase().includes(q))
      const matchProject = !activeProject || inst.id === activeProject
      return matchRegion && matchSearch && matchProject
    })
    .sort((a, b) => (sort ? a[sort.key].localeCompare(b[sort.key]) * (sort.dir === "asc" ? 1 : -1) : 0))

  const selectedRows = filtered.filter((i) => selectedIds.includes(i.id))
  // The detail panel and Connect only apply when exactly one project is selected
  const selected = selectedRows.length === 1 ? selectedRows[0] : null
  const allSelected = filtered.length > 0 && selectedRows.length === filtered.length
  // Keep showing the last project while the panel slides away
  const panelInst = selected ?? instances.find((i) => i.id === panelId) ?? null

  const toggleSelect = (id: string) => {
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
    setPanelId(id)
  }

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s?.key === key && s.dir === "asc" ? "desc" : "asc" }))

  const handleRefresh = () => {
    setSpinning(true)
    router.refresh()
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <div
      className="px-4 lg:px-6 py-5 text-[14px] leading-5 text-[#0f141a]"
      style={selected ? { paddingBottom: splitPanelPadding(panelHeight) } : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-[24px] leading-[30px] font-bold">
          {activeProject ? (filtered[0]?.name ?? "Project") : "Projects"}{" "}
          <span className="font-normal text-[#656871]">
            ({!ec2Data ? "–" : selectedRows.length ? `${selectedRows.length}/${filtered.length}` : filtered.length})
          </span>{" "}
          <InfoLink topic="ec2-projects" className="text-xs font-bold text-[#006ce0] hover:underline align-middle" />
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-right text-[#424650] leading-[18px] mr-1">
            Last updated
            <br />
            less than a minute ago
          </p>
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
          <a
            href={selected?.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!selected}
            onClick={(e) => { if (!selected) e.preventDefault() }}
            className={
              selected
                ? OUTLINE_BTN
                : "h-8 px-5 flex items-center gap-2 rounded-full border-2 border-[#b4b4bb] text-sm font-bold text-[#8c8c94] cursor-not-allowed whitespace-nowrap"
            }
          >
            Connect
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M9 2h5v5M14 2 7 9M12 9.5V14H2V4h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button className={OUTLINE_BTN}>
            Project state
            <Caret />
          </button>
          <button className={OUTLINE_BTN}>
            Actions
            <Caret />
          </button>
          <button
            onClick={() => { window.location.href = "mailto:atharvabedekar527@gmail.com?subject=Project%20Proposal&body=Hi%20Atharva%2C%20want%20to%20start%20a%20project." }}
            className="h-8 flex items-stretch rounded-full bg-[#ff9900] hover:bg-[#fa6f00] text-sm font-bold text-[#0f141a] overflow-hidden transition-colors whitespace-nowrap"
          >
            <span className="flex items-center pl-5 pr-4">Launch project</span>
            <span className="flex items-center px-3 border-l-2 border-white">
              <Caret />
            </span>
          </button>
        </div>
      </div>

      {/* Filter sets + search + pagination */}
      <div className="flex items-end gap-4 mt-4 mb-2">
        <div className="relative shrink-0">
          <span className="absolute -top-2 left-3 px-1 bg-[#f9f9fa] text-[12px] leading-4 font-bold">Saved filter sets</span>
          <button className="h-8 px-3 flex items-center gap-3 border border-[#8c8c94] rounded-lg bg-white italic text-[#656871] whitespace-nowrap">
            Choose filter set
            <span className="text-[#006ce0]">
              <Caret />
            </span>
          </button>
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2 h-8 px-3 border border-[#8c8c94] rounded-lg bg-white">
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424650" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-5-5" />
          </svg>
          <input
            type="text"
            placeholder="Filter project by attribute or tag"
            aria-label="Filter project by attribute or tag"
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
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = selectedRows.length > 0 && !allSelected }}
                    onChange={() => setSelectedIds(selectedRows.length ? [] : filtered.map((i) => i.id))}
                    aria-label="Select all projects"
                    className="block w-4 h-4 m-0 accent-[#006ce0]"
                  />
                </span>
              </th>
              {COLS.map(({ label, sortKey }) => (
                <th key={label} className="text-left py-1.5 font-bold text-[#424650]">
                  {sortKey ? (
                    <button
                      onClick={() => toggleSort(sortKey)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-0.5 border-l border-[#c6c6cd] font-bold whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1.5">
                        {label}
                        {sortKey === "name" && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M4 20h4L20 8l-4-4L4 16v4z" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <SortIcon dir={sort?.key === sortKey ? sort.dir : null} />
                    </button>
                  ) : (
                    <span className="block px-4 py-0.5 border-l border-[#c6c6cd] whitespace-nowrap">{label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((inst) => {
              const isSelected = selectedIds.includes(inst.id)
              return (
                <tr
                  key={inst.id}
                  onClick={() => toggleSelect(inst.id)}
                  className={`cursor-pointer ${
                    isSelected
                      ? "bg-[#f0fbff] outline outline-2 -outline-offset-2 outline-[#006ce0]"
                      : "border-b border-[#ebebf0] hover:bg-[#f0fbff]/60"
                  }`}
                >
                  <td className="w-12 px-4 py-2.5">
                    <span className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(inst.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${inst.name}`}
                        className="block w-4 h-4 m-0 accent-[#006ce0]"
                      />
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{inst.name}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-[#006ce0]">{inst.id}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="flex items-center gap-3">
                      <StateValue status={inst.status} />
                      <span className="flex items-center gap-2 text-[#006ce0]">
                        <ZoomIcon />
                        <ZoomIcon out />
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{inst.instanceType}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {inst.status === "running" ? <span className="text-[#00802f]">2/2 checks passed</span> : "–"}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{zone}</td>
                  <td className="px-4 py-2.5">{inst.metrics.usersServed.toLocaleString("en-US")}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{formatPeriod(inst.periodFrom, inst.periodTo)}</td>
                </tr>
              )
            })}
            {!ec2Data && <DataStatusRow colSpan={COLS.length + 1} label="projects" error={error} onRetry={reload} />}
            {ec2Data && filtered.length === 0 && (
              <tr>
                <td colSpan={COLS.length + 1} className="px-4 py-10 text-center font-bold text-[#424650]">
                  {instances.filter((i) => i.region === selectedRegion).length === 0
                    ? `No projects in the selected region (${selectedRegion}).`
                    : "No projects match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProjectSummaryPanel
        inst={panelInst}
        open={!!selected}
        height={panelHeight}
        onResize={setPanelHeight}
        onClose={() => setSelectedIds([])}
      />
    </div>
  )
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      title={copied ? "Copied" : "Copy"}
      className="text-[#0073bb] hover:text-[#005f99] shrink-0"
    >
      {copied ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a7f37" strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="8" y="8" width="13" height="13" rx="1.5" />
          <path d="M4 16V4h12" />
        </svg>
      )}
    </button>
  )
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="inline-block ml-1 -mt-0.5">
      <path d="M9 2h5v5M14 2 7 9M12 9.5V14H2V4h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StateValue({ status }: { status: string }) {
  const running = status === "running"
  return (
    <span className={`inline-flex items-center gap-1.5 ${running ? "text-[#00802f]" : "text-[#656871]"}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="9.5" />
        {running ? <path d="m8 12.5 2.7 2.7L16.5 9.5" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M8 12h8" strokeLinecap="round" />}
      </svg>
      {running ? "Running" : "Stopped"}
    </span>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[14px] font-bold text-gray-900">{label}</p>
      <div className="mt-1 text-[14px] text-gray-700 break-words">{children}</div>
    </div>
  )
}

function ProjectSummaryPanel({
  inst,
  open,
  height,
  onResize,
  onClose,
}: {
  inst: Instance | null
  open: boolean
  height: number | null
  onResize: (height: number) => void
  onClose: () => void
}) {
  const [summaryOpen, setSummaryOpen] = useState(true)
  if (!inst) return null

  return (
    <EC2SplitPanel
      title={`${inst.id} (${inst.name})`}
      open={open}
      height={height}
      onResize={onResize}
      onClose={onClose}
      actions={
        <a href={inst.link} target="_blank" rel="noopener noreferrer" title="Open project" className="p-1 rounded-full hover:bg-gray-100">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M9 2h5v5M14 2 7 9M12 9.5V14H2V4h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      }
    >
        <button
          onClick={() => setSummaryOpen((o) => !o)}
          className="flex items-center gap-2 py-2 text-[18px] font-bold text-gray-900"
          aria-expanded={summaryOpen}
        >
          <svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor" className={`transition-transform ${summaryOpen ? "" : "-rotate-90"}`}>
            <path d="M0 2h10L5 9z" />
          </svg>
          Project summary
          <InfoLink topic="ec2-project-summary" inline className="text-xs font-bold text-[#0073bb] hover:underline" />
        </button>

        {summaryOpen && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 mt-2">
              <div className="space-y-5 md:pr-6">
                <Field label="Project ID">
                  <span className="inline-flex items-center gap-2"><CopyButton value={inst.id} />{inst.id}</span>
                </Field>
                <Field label="Project type">{inst.instanceType}</Field>
                <Field label="Tech stack">{inst.techStack}</Field>
              </div>
              <div className="space-y-5 md:px-6 md:border-l border-gray-200 mt-5 md:mt-0">
                <Field label="Project state"><StateValue status={inst.status} /></Field>
                <Field label="Period">{formatPeriod(inst.periodFrom, inst.periodTo)}</Field>
                <Field label="Users served">{inst.metrics.usersServed.toLocaleString()}</Field>
              </div>
              <div className="space-y-5 md:pl-6 md:border-l border-gray-200 mt-5 md:mt-0">
                <Field label="Project link">
                  <span className="inline-flex items-start gap-2">
                    <CopyButton value={inst.link} />
                    <span>
                      {inst.link.replace(/^https?:\/\//, "")} |{" "}
                      <a href={inst.link} target="_blank" rel="noopener noreferrer" className="text-[#0073bb] hover:underline">
                        open address<ExternalIcon />
                      </a>
                    </span>
                  </span>
                </Field>
                <Field label="Region">{inst.region}</Field>
                <Field label="Scale / Hours spent">{inst.metrics.scale} · {inst.metrics.hoursSpent}h</Field>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-200 space-y-4">
              <Field label="Description">
                <p className="leading-relaxed">{inst.details}</p>
              </Field>
              <Field label="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {inst.tags.map((tag) => (
                    <span key={tag} className="bg-[#eaf4fb] text-[#0073bb] text-xs px-2 py-0.5 rounded-full border border-[#b3d9f0]">{tag}</span>
                  ))}
                </div>
              </Field>
            </div>
          </>
        )}
    </EC2SplitPanel>
  )
}
