import Link from "next/link"
import StatusBadge from "@/components/ui/StatusBadge"
import Breadcrumb from "@/components/layout/Breadcrumb"
import { formatPeriod } from "@/lib/formatDate"
import iamGroups from "@/data/iam-groups.json"
import iamUsers from "@/data/iam-users.json"
import { serviceTitle } from "@/lib/serviceTitle"
import iamConsole from "@/data/iam-console.json"

interface GroupDetailProps {
  groupId: string
}

export default function GroupDetail({ groupId }: GroupDetailProps) {
  const group = iamGroups.groups.find((g) => g.id === groupId)
  if (!group) return <p className="text-sm text-gray-500">Group not found.</p>

  const usersInGroup = iamUsers.users.filter((u) => u.groups.includes(groupId))

  return (
    <div>
      <Breadcrumb
        items={[
          { label: serviceTitle("iam"), href: "/iam/home" },
          { label: iamConsole.pages.groups.breadcrumb, href: "/iam/groups" },
          { label: group.label },
        ]}
      />

      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-3 h-8 rounded-full shrink-0"
          style={{ backgroundColor: group.color }}
        />
        <h1 className="text-xl font-semibold text-gray-900">{group.label}</h1>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
          <h2 className="text-sm font-semibold text-gray-700">
            Skills ({group.skills.length})
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                Skill
              </th>
              <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                Level
              </th>
            </tr>
          </thead>
          <tbody>
            {group.skills.map((skill) => (
              <tr key={skill.name} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 text-gray-800">{skill.name}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={skill.level} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users in group */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
          <h2 className="text-sm font-semibold text-gray-700">
            Experience / Roles in this group ({usersInGroup.length})
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                Name
              </th>
              <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden md:table-cell">
                Period
              </th>
            </tr>
          </thead>
          <tbody>
            {usersInGroup.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="px-4 py-2.5">
                  <Link href={`/iam/users/${user.id}`} className="text-[#0073bb] hover:underline font-medium">
                    {user.displayName}
                  </Link>
                  <p className="text-xs text-gray-500">{user.description}</p>
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-500 hidden md:table-cell">
                  {formatPeriod(user.periodFrom, user.periodTo)}
                </td>
              </tr>
            ))}
            {usersInGroup.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400 text-sm">
                  No roles in this group.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
