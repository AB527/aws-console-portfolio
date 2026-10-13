"use client"

import { useState } from "react"
import StatusBadge from "@/components/ui/StatusBadge"
import { formatPeriod } from "@/lib/formatDate"
import { useData, type ContentData } from "@/hooks/useData"

type Instance = ContentData["ec2-projects"]["instances"][number]

export default function ProjectsList() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const instances = useData("ec2-projects").data?.instances ?? []

  const filtered = instances.filter((inst) => {
    const matchSearch =
      search === "" ||
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === "all" || inst.status === statusFilter
    return matchSearch && matchStatus
  })

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search instances..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-line rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-[#0073bb] dark:focus:border-link"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 dark:border-line rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#0073bb] dark:focus:border-link"
        >
          <option value="all">All statuses</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-gray-200 dark:border-line shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-surface-subtle border-b border-gray-200 dark:border-line">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-ink-muted uppercase tracking-wide">
                Name
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-ink-muted uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-ink-muted uppercase tracking-wide hidden md:table-cell">
                Type
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-ink-muted uppercase tracking-wide hidden lg:table-cell">
                Region
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-ink-muted uppercase tracking-wide hidden lg:table-cell">
                Period
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inst) => (
              <>
                <tr
                  key={inst.id}
                  onClick={() => toggleRow(inst.id)}
                  className="border-b border-gray-100 dark:border-line-subtle hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          inst.status === "running" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <span className="font-medium text-[#0073bb] dark:text-link">{inst.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-ink-muted mt-0.5 ml-4">{inst.description}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={inst.status} />
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell">
                    <code className="text-xs font-mono bg-gray-50 dark:bg-surface-subtle border border-gray-200 dark:border-line rounded-md px-1.5 py-0.5 text-gray-700 dark:text-ink-body">{inst.instanceType}</code>
                  </td>
                  <td className="px-4 py-2.5 hidden lg:table-cell text-gray-600 dark:text-ink-body text-xs">{inst.region}</td>
                  <td className="px-4 py-2.5 hidden lg:table-cell text-gray-600 dark:text-ink-body text-xs">
                    {formatPeriod(inst.periodFrom, inst.periodTo)}
                  </td>
                </tr>
                {expandedId === inst.id && (
                  <tr key={`${inst.id}-detail`} className="bg-blue-50 border-b border-blue-100">
                    <td colSpan={5} className="px-6 py-4">
                      <InstanceDrawer inst={inst} />
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-ink-muted text-sm">
                  No instances match your filters.
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-xs text-gray-500 dark:text-ink-muted mb-1 font-semibold uppercase tracking-wide">Details</p>
        <p className="text-gray-700 dark:text-ink-body">{inst.details}</p>
        <p className="text-xs text-gray-500 dark:text-ink-muted mt-2">
          <span className="font-medium">Period:</span>{" "}
          {formatPeriod(inst.periodFrom, inst.periodTo)}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-ink-muted mb-2 font-semibold uppercase tracking-wide">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {inst.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 dark:bg-surface-subtle text-gray-700 dark:text-ink-body text-xs px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <a
          href={inst.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs text-white bg-[#ff9900] hover:bg-[#e68900] px-3 py-1.5 rounded-full font-medium transition-colors"
        >
          Open Project →
        </a>
      </div>
    </div>
  )
}
