"use client"

import { useState } from "react"
import Link from "next/link"
import StatusBadge from "@/components/ui/StatusBadge"
import { formatPeriod } from "@/lib/formatDate"
import iamUsers from "@/data/iam-users.json"
import iamGroups from "@/data/iam-groups.json"

export default function UsersList() {
  const [search, setSearch] = useState("")

  const groupColorMap: Record<string, string> = Object.fromEntries(
    iamGroups.groups.map((g) => [g.id, g.color])
  )
  const groupLabelMap: Record<string, string> = Object.fromEntries(
    iamGroups.groups.map((g) => [g.id, g.label])
  )

  const filtered = iamUsers.users.filter((u) => {
    const q = search.toLowerCase()
    return (
      search === "" ||
      u.username.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-[#0073bb]"
        />
      </div>

      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Username
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                Display name
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                Groups
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                Period
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="px-4 py-2.5">
                  <Link href={`/iam/users/${user.id}`} className="text-[#0073bb] hover:underline font-medium">
                    {user.username}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-gray-700 hidden md:table-cell">{user.displayName}</td>
                <td className="px-4 py-2.5 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {user.groups.map((gId) => (
                      <span
                        key={gId}
                        className="text-xs px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: groupColorMap[gId] ?? "#6b7280" }}
                      >
                        {groupLabelMap[gId] ?? gId}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-500 hidden lg:table-cell">
                  {formatPeriod(user.periodFrom, user.periodTo)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
