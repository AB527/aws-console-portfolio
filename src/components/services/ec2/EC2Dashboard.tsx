"use client"

import { useState } from "react"
import StatusBadge from "@/components/ui/StatusBadge"
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
  const [expandedId, setExpandedId] = useState<string | null>(activeProject)

  const filtered = ec2Data.instances.filter((inst) => {
    const matchRegion = inst.region === selectedRegion
    const matchSearch =
      !search ||
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchProject = !activeProject || inst.id === activeProject
    return matchRegion && matchSearch && matchProject
  })

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[18px] font-light text-gray-900">
            {activeProject ? (filtered[0]?.name ?? "Instance") : "Instances"}
            <span className="text-[15px] text-gray-500 ml-2">({filtered.length})</span>
          </h1>
          <p className="text-[12px] text-gray-500 mt-0.5">Production systems and shipped code</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="border border-gray-200 rounded px-3 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50 flex items-center gap-1">
            Actions
            <svg width="9" height="6" viewBox="0 0 10 6" fill="currentColor" className="opacity-60">
              <path d="M1 1l4 4 4-4" strokeLinecap="round" />
            </svg>
          </button>
          <button className="bg-[#ff9900] hover:bg-[#e88a00] text-white rounded px-3 py-1.5 text-[13px] font-medium transition-colors"
            onClick={() => { window.location.href = "mailto:atharvabedekar527@gmail.com?subject=Project%20Proposal&body=Hi%20Atharva%2C%20want%20to%20start%20a%20project." }}>
            Launch project
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 h-8 w-72 shadow-sm">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="text-gray-400 shrink-0">
            <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.75" />
            <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Find instance by name or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[13px] flex-1 focus:outline-none bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-8 px-3 py-2.5"><input type="checkbox" className="rounded" /></th>
              {["Name / ID", "Instance state", "Instance type", "Users served", "Period"].map((h) => (
                <th key={h} className="text-left px-3 py-2.5 text-[12px] font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((inst) => (
              <>
                <tr
                  key={inst.id}
                  onClick={() => setExpandedId((p) => (p === inst.id ? null : inst.id))}
                  className="border-b border-gray-100 hover:bg-blue-50/60 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2.5"><input type="checkbox" className="rounded" onClick={(e) => e.stopPropagation()} /></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${inst.status === "running" ? "bg-green-500" : "bg-gray-400"}`} />
                      <span className="text-[#0073bb] font-medium text-[13px] hover:underline">{inst.name}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 ml-4 mt-0.5">{inst.id}</p>
                  </td>
                  <td className="px-3 py-2.5"><StatusBadge status={inst.status} /></td>
                  <td className="px-3 py-2.5">
                    <code className="text-[11px] font-mono bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-gray-700">{inst.instanceType}</code>
                  </td>
                  <td className="px-3 py-2.5 text-[13px] text-gray-700">{inst.metrics.usersServed.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-[12px] text-gray-500">{formatPeriod(inst.periodFrom, inst.periodTo)}</td>
                </tr>
                {expandedId === inst.id && (
                  <tr key={`${inst.id}-drawer`}>
                    <td colSpan={6} className="bg-[#f8fafc] border-b border-blue-100">
                      <InstanceDrawer inst={inst} />
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                  {ec2Data.instances.filter((i) => i.region === selectedRegion).length === 0
                    ? `No projects in the selected region (${selectedRegion}).`
                    : "No instances match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InstanceDrawer({ inst }: { inst: Instance }) {
  return (
    <div className="px-8 py-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Instance Details</p>
        <dl className="space-y-1.5">
          {[
            ["Instance ID", inst.id],
            ["Instance Type", inst.instanceType],
            ["Tech Stack", inst.techStack],
            ["Region", inst.region],
            ["Scale", inst.metrics.scale],
            ["Hours Spent", `${inst.metrics.hoursSpent}h`],
            ["Period", formatPeriod(inst.periodFrom, inst.periodTo)],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3">
              <dt className="w-28 text-xs text-gray-500 shrink-0">{k}</dt>
              <dd className="text-xs text-gray-800 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Description</p>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{inst.details}</p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tags</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {inst.tags.map((tag) => (
            <span key={tag} className="bg-[#eaf4fb] text-[#0073bb] text-xs px-2 py-0.5 rounded border border-[#b3d9f0]">{tag}</span>
          ))}
        </div>
        <a
          href={inst.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-white bg-[#ff9900] hover:bg-[#e68900] px-3.5 py-2 rounded font-medium transition-colors shadow-sm"
        >
          Open Project
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path d="M3 13 L13 3 M6 3 H13 V10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  )
}
