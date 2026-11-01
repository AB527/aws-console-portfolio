"use client"

import { useState } from "react"
import StatusBadge from "@/components/ui/StatusBadge"
import PolicyTag from "@/components/ui/PolicyTag"
import { formatPeriod } from "@/lib/formatDate"
import iamUsers from "@/data/iam-users.json"
import iamGroups from "@/data/iam-groups.json"

interface UserDetailProps {
  userId: string
}

export default function UserDetail({ userId }: UserDetailProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "permissions">("summary")

  const user = iamUsers.users.find((u) => u.id === userId)
  if (!user) return <p className="text-sm text-gray-500">User not found.</p>

  const groupColorMap: Record<string, string> = Object.fromEntries(
    iamGroups.groups.map((g) => [g.id, g.color])
  )
  const groupLabelMap: Record<string, string> = Object.fromEntries(
    iamGroups.groups.map((g) => [g.id, g.label])
  )

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "permissions", label: `Permissions (${user.policies.length})` },
  ] as const

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-[#0073bb] shrink-0">
          {user.avatar}
        </span>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{user.displayName}</h1>
          <p className="text-sm text-gray-500">{user.description}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={user.status} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? "border-[#0073bb] text-[#0073bb]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "summary" ? (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <dl className="divide-y divide-gray-100">
            {[
              { label: "Username", value: user.username },
              { label: "Display name", value: user.displayName },
              { label: "Description", value: user.description },
              { label: "Period", value: formatPeriod(user.periodFrom, user.periodTo) },
              { label: "Region", value: user.region },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-baseline px-4 py-3">
                <dt className="w-36 text-xs text-gray-500 font-medium shrink-0">{label}</dt>
                <dd className="text-sm text-gray-800">{value}</dd>
              </div>
            ))}
            <div className="flex items-start px-4 py-3">
              <dt className="w-36 text-xs text-gray-500 font-medium shrink-0 mt-0.5">Groups</dt>
              <dd className="flex flex-wrap gap-1.5">
                {user.groups.map((gId) => (
                  <span
                    key={gId}
                    className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: groupColorMap[gId] ?? "#6b7280" }}
                  >
                    {groupLabelMap[gId] ?? gId}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Policy name
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Effect
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {user.policies.map((policy) => (
                <tr key={policy.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <PolicyTag name={policy.name} />
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={policy.effect} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 hidden md:table-cell">
                    Inline
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
