"use client"

import { useState } from "react"
import { formatPeriod } from "@/lib/formatDate"
import ec2Data from "@/data/ec2-projects.json"
import { useConsoleStore } from "@/store/useConsoleStore"
import EC2HomeView from "./EC2HomeView"
import EC2InstanceTypesView from "./EC2InstanceTypesView"

type Instance = typeof ec2Data.instances[number]

interface EC2DashboardProps {
  view?: string | null
  activeProject?: string | null
}

export default function EC2Dashboard({ view, activeProject }: EC2DashboardProps) {
  if (!view && !activeProject) return <EC2HomeView />
  if (view === "instance-types") return <EC2InstanceTypesView />
  return <EC2InstancesView activeProject={activeProject ?? null} />
}

function EC2InstancesView({ activeProject }: { activeProject: string | null }) {
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(activeProject)
  const [panelId, setPanelId] = useState<string | null>(activeProject)
  const [panelHeight, setPanelHeight] = useState<number | null>(null)

  const filtered = ec2Data.instances.filter((inst) => {
    const matchRegion = inst.region === selectedRegion
    const matchSearch =
      !search ||
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchProject = !activeProject || inst.id === activeProject
    return matchRegion && matchSearch && matchProject
  })

  const selected = filtered.find((i) => i.id === selectedId) ?? null
  // Keep showing the last project while the panel slides away
  const panelInst = selected ?? ec2Data.instances.find((i) => i.id === panelId) ?? null

  const toggleSelect = (id: string) => {
    setSelectedId((cur) => (cur === id ? null : id))
    setPanelId(id)
  }

  return (
    <div
      className="p-5"
      style={selected ? { paddingBottom: panelHeight ? panelHeight + 20 : "calc(45vh + 20px)" } : undefined}
    >
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">
            {activeProject ? (filtered[0]?.name ?? "Project") : "Projects"}{" "}
            <span className="font-normal text-gray-500">
              ({selected ? `1/${filtered.length}` : filtered.length})
            </span>{" "}
            <span className="text-xs font-bold text-[#0073bb] align-middle">Info</span>
          </h1>
          <p className="text-[12px] text-gray-500 mt-0.5">Production systems and shipped code</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={selected?.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!selected}
            onClick={(e) => { if (!selected) e.preventDefault() }}
            className={`h-9 px-5 flex items-center gap-1.5 rounded-full border-2 text-sm font-bold transition-colors ${
              selected
                ? "border-[#0073bb] text-[#0073bb] hover:bg-[#f1faff]"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            Connect
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M9 2h5v5M14 2 7 9M12 9.5V14H2V4h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button className="h-9 px-5 flex items-center gap-2 rounded-full border-2 border-[#0073bb] text-sm font-bold text-[#0073bb] hover:bg-[#f1faff]">
            Actions
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M0 2h10L5 9z" />
            </svg>
          </button>
          <button className="h-9 px-5 rounded-full bg-[#ff9900] hover:bg-[#ec8c00] text-sm font-bold text-gray-900 transition-colors"
            onClick={() => { window.location.href = "mailto:atharvabedekar527@gmail.com?subject=Project%20Proposal&body=Hi%20Atharva%2C%20want%20to%20start%20a%20project." }}>
            Launch project
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 max-w-[60%] flex items-center gap-2 bg-white border border-gray-400 rounded-lg px-3 h-9">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#414d5c" strokeWidth="2.2" className="shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Find project by name or tag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm flex-1 focus:outline-none bg-transparent text-gray-800 placeholder-gray-500 placeholder:italic"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="w-10 pl-3 pr-2 py-3">
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => setSelectedId(null)}
                  disabled={!selected}
                  className="w-4 h-4 accent-[#0073bb] align-middle"
                />
              </th>
              {["Name", "Project ID", "Project state", "Project type", "Users served", "Period"].map((h) => (
                <th key={h} className="text-left px-3 py-3 font-bold text-gray-900 whitespace-nowrap">
                  <span className="block border-l border-gray-300 pl-3">{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((inst) => {
              const isSelected = inst.id === selectedId
              return (
                <tr
                  key={inst.id}
                  onClick={() => toggleSelect(inst.id)}
                  className={`border-b border-gray-200 cursor-pointer transition-colors ${
                    isSelected ? "bg-[#f1faff] outline outline-2 -outline-offset-2 outline-[#0073bb]" : "hover:bg-[#f1faff]/60"
                  }`}
                >
                  <td className="pl-3 pr-2 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(inst.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 accent-[#0073bb] align-middle"
                    />
                  </td>
                  <td className="px-3 py-3 text-gray-900"><span className="block pl-3">{inst.name}</span></td>
                  <td className="px-3 py-3"><span className="block pl-3 text-[#0073bb] hover:underline">{inst.id}</span></td>
                  <td className="px-3 py-3"><span className="block pl-3"><StateValue status={inst.status} /></span></td>
                  <td className="px-3 py-3 text-gray-900"><span className="block pl-3">{inst.instanceType}</span></td>
                  <td className="px-3 py-3 text-gray-900"><span className="block pl-3">{inst.metrics.usersServed.toLocaleString()}</span></td>
                  <td className="px-3 py-3 text-gray-900 whitespace-nowrap"><span className="block pl-3">{formatPeriod(inst.periodFrom, inst.periodTo)}</span></td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500 font-bold text-sm">
                  {ec2Data.instances.filter((i) => i.region === selectedRegion).length === 0
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
        onClose={() => setSelectedId(null)}
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
    <span className={`inline-flex items-center gap-1.5 ${running ? "text-[#1a7f37]" : "text-gray-500"}`}>
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

const PANEL_DEFAULT_VH = 0.45
const PANEL_MIN_HEIGHT = 120

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

  // Drag the handle to resize: new height = starting height + distance dragged upward
  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = e.currentTarget.parentElement?.getBoundingClientRect().height ?? 0
    const max = window.innerHeight * PANEL_DEFAULT_VH
    const onMove = (ev: PointerEvent) => {
      const next = startHeight + (startY - ev.clientY)
      onResize(Math.min(max, Math.max(PANEL_MIN_HEIGHT, next)))
    }
    const onUp = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    document.body.style.cursor = "row-resize"
    document.body.style.userSelect = "none"
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  return (
    <section
      aria-hidden={!open}
      style={{ height: height ?? "45vh" }}
      className={`fixed left-[240px] right-0 bottom-[32px] z-20 bg-white border-t border-gray-300 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex flex-col transition-transform duration-300 ease-out ${
        open ? "translate-y-0" : "translate-y-[calc(100%+32px)]"
      }`}
    >
      {/* Resize handle */}
      <div
        onPointerDown={startResize}
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize panel"
        className="group flex justify-center pt-2 pb-1 cursor-row-resize touch-none"
      >
        <span className="w-8 h-1 rounded-full bg-gray-700 group-hover:bg-[#0073bb] transition-colors" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-3 pb-2">
        <h2 className="text-[20px] font-bold text-gray-900 truncate">
          {inst.id} ({inst.name})
        </h2>
        <div className="flex items-center gap-3 text-gray-700 shrink-0">
          <a href={inst.link} target="_blank" rel="noopener noreferrer" title="Open project" className="p-1 rounded-full hover:bg-gray-100">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M9 2h5v5M14 2 7 9M12 9.5V14H2V4h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <span className="w-px h-6 bg-gray-300" />
          <button onClick={onClose} title="Close" className="p-1 rounded-full hover:bg-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <button
          onClick={() => setSummaryOpen((o) => !o)}
          className="flex items-center gap-2 py-2 text-[18px] font-bold text-gray-900"
          aria-expanded={summaryOpen}
        >
          <svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor" className={`transition-transform ${summaryOpen ? "" : "-rotate-90"}`}>
            <path d="M0 2h10L5 9z" />
          </svg>
          Project summary
          <span className="text-xs font-bold text-[#0073bb]">Info</span>
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
      </div>
    </section>
  )
}
