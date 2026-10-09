import Link from "next/link"
import StatusBadge from "@/components/ui/StatusBadge"
import { formatPeriod } from "@/lib/formatDate"
import iamGroups from "@/data/iam-groups.json"
import iamUsers from "@/data/iam-users.json"

export default function IAMHome() {
  const previewGroups = iamGroups.groups.slice(0, 3)
  const previewUsers = iamUsers.users.slice(0, 5)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Groups */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Skill Groups</h2>
          <Link href="/iam/groups" className="text-xs text-[#0073bb] hover:underline">
            View all groups →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {previewGroups.map((group) => (
            <Link
              key={group.id}
              href={`/iam/groups/${group.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-full min-h-[16px] rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-sm font-medium text-[#0073bb]">{group.label}</span>
              </div>
              <span className="text-xs text-gray-500">{group.skills.length} skills</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Users */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Experience / Roles</h2>
          <Link href="/iam/users" className="text-xs text-[#0073bb] hover:underline">
            View all users →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden lg:table-cell">
                  Period
                </th>
              </tr>
            </thead>
            <tbody>
              {previewUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2.5">
                    <Link href={`/iam/users/${user.id}`} className="text-[#0073bb] hover:underline text-sm font-medium">
                      {user.displayName}
                    </Link>
                    <p className="text-xs text-gray-500">{user.description}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 hidden lg:table-cell">
                    {formatPeriod(user.periodFrom, user.periodTo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
