import Link from "next/link"
import iamGroups from "@/data/iam-groups.json"

export default function GroupsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {iamGroups.groups.map((group) => {
        const preview = group.skills.slice(0, 3)
        const remaining = group.skills.length - preview.length
        return (
          <Link
            key={group.id}
            href={`/iam/groups/${group.id}`}
            className="bg-white rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: group.color }}
            />
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">{group.label}</h2>
              <div className="flex flex-wrap gap-1.5">
                {preview.map((skill) => (
                  <span
                    key={skill.name}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                  >
                    {skill.name}
                  </span>
                ))}
                {remaining > 0 && (
                  <span className="text-xs text-gray-400 px-1">+{remaining} more</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3">{group.skills.length} skills</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
