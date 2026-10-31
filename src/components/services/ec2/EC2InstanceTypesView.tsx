"use client"

import { useState } from "react"
import { useConsoleStore } from "@/store/useConsoleStore"
import ec2Data from "@/data/ec2-projects.json"

const COLS = [
  "Project type",
  "Open Source",
  "Production Grade",
  "Tech Stack",
  "Users Served",
  "Hours Spent",
  "Scale",
]

function SortIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 10 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40 shrink-0">
      <path d="M5 1v10M1 7l4 4 4-4M1 5l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function YesNoBadge({ value }: { value: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
      value ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-500 border border-gray-200"
    }`}>
      {value ? "Yes" : "No"}
    </span>
  )
}

export default function EC2InstanceTypesView() {
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)
  const [search, setSearch] = useState("")

  const regionInstances = ec2Data.instances.filter((i) => i.region === selectedRegion)
  const typesInRegion = new Set(regionInstances.map((i) => i.instanceType))

  const visibleTypes = ec2Data.instanceTypeDetails.filter((t) => typesInRegion.has(t.id))

  const enriched = visibleTypes.map((t) => {
    const matching = regionInstances.filter((i) => i.instanceType === t.id)
    return {
      ...t,
      usersServed: matching.reduce((s, i) => s + i.metrics.usersServed, 0),
      hoursSpent: matching.reduce((s, i) => s + i.metrics.hoursSpent, 0),
      projectCount: matching.length,
    }
  })

  const filtered = enriched.filter((t) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      t.id.toLowerCase().includes(q) ||
      t.techStack.toLowerCase().includes(q) ||
      t.scale.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-[18px] font-light text-gray-900">
          Project types{" "}
          <span className="text-[15px] text-gray-500">({filtered.length})</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Last updated just now
          </div>
          <button className="flex items-center gap-1.5 border border-[#0073bb] text-[#0073bb] rounded-full px-3 py-1.5 text-[13px] hover:bg-[#eaf4fb] transition-colors">
            Project type finder
          </button>
          <button className="flex items-center gap-1.5 bg-[#ff9900] hover:bg-[#e88a00] text-white rounded-full px-3 py-1.5 text-[13px] transition-colors font-medium">
            Actions
            <svg width="9" height="6" viewBox="0 0 10 6" fill="currentColor">
              <path d="M1 1l4 4 4-4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search + pagination */}
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 h-8 w-72 shadow-sm">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="text-gray-400 shrink-0">
            <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.75" />
            <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Find project type by attribute"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[13px] flex-1 focus:outline-none bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-1 text-[13px] text-[#0073bb]">
          <button className="px-2 py-0.5 hover:bg-gray-100 rounded-md text-gray-400">‹</button>
          <button className="px-2 py-0.5 bg-white border border-[#0073bb] rounded-md font-medium">1</button>
          <button className="px-2 py-0.5 hover:bg-gray-100 rounded-md text-gray-400">›</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-8 px-3 py-2.5">
                <input type="checkbox" className="rounded" />
              </th>
              {COLS.map((col) => (
                <th key={col} className="text-left px-3 py-2.5 text-[12px] font-semibold text-gray-600 whitespace-nowrap">
                  <span className="flex items-center gap-1">{col}<SortIcon /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-3 py-2.5">
                  <div className="text-[#0073bb] font-medium">{t.id}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{t.description}</div>
                </td>
                <td className="px-3 py-2.5"><YesNoBadge value={t.openSource} /></td>
                <td className="px-3 py-2.5"><YesNoBadge value={t.productionGrade} /></td>
                <td className="px-3 py-2.5 text-gray-700 max-w-[200px]">
                  <span className="leading-snug block">{t.techStack}</span>
                </td>
                <td className="px-3 py-2.5 text-gray-800 font-medium">
                  {t.usersServed >= 1000
                    ? `${(t.usersServed / 1000).toFixed(0)}k`
                    : t.usersServed.toLocaleString()}
                </td>
                <td className="px-3 py-2.5 text-gray-700">{t.hoursSpent}h</td>
                <td className="px-3 py-2.5">
                  <span className="text-[12px] text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                    {t.scale}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                  {ec2Data.instances.filter((i) => i.region === selectedRegion).length === 0
                    ? `No projects in the selected region (${selectedRegion}).`
                    : "No project types match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
