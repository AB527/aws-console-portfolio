"use client"

import Link from "next/link"
import ResourceTable, { type Column } from "./ResourceTable"
import StatusBadge from "@/components/ui/StatusBadge"
import iamGroups from "@/data/iam-groups.json"
import iamUsers from "@/data/iam-users.json"
import iamConsole from "@/data/iam-console.json"

const LEVEL_RANK: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }

type Group = (typeof iamGroups.groups)[number]

interface GroupRow {
  group: Group
  roleCount: number
  topLevel: string
}

const rows: GroupRow[] = iamGroups.groups.map((group) => ({
  group,
  roleCount: iamUsers.users.filter((u) => u.groups.includes(group.id)).length,
  topLevel: group.skills.reduce(
    (best, s) => ((LEVEL_RANK[s.level] ?? 0) > (LEVEL_RANK[best] ?? 0) ? s.level : best),
    ""
  ),
}))

export default function SkillGroupsTable() {
  const page = iamConsole.pages.groups
  const columns: Column<GroupRow>[] = [
    {
      header: page.columns.name,
      sortValue: (r) => r.group.label,
      render: (r) => (
        <Link href={`/iam/groups/${r.group.id}`} className="inline-flex items-center gap-2 text-[#0073bb] hover:underline">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.group.color }} />
          {r.group.label}
        </Link>
      ),
    },
    { header: page.columns.skills, sortValue: (r) => r.group.skills.length, render: (r) => r.group.skills.length },
    { header: page.columns.roles, sortValue: (r) => r.roleCount, render: (r) => r.roleCount },
    {
      header: page.columns.topLevel,
      sortValue: (r) => LEVEL_RANK[r.topLevel] ?? 0,
      render: (r) => (r.topLevel ? <StatusBadge status={r.topLevel} /> : "—"),
    },
  ]

  return (
    <ResourceTable
      title={page.title}
      description={page.description}
      columns={columns}
      rows={rows}
      rowKey={(r) => r.group.id}
      searchText={(r) => r.group.label}
      searchPlaceholder={page.searchPlaceholder}
      createLabel={page.createLabel}
      emptyText={page.emptyText}
    />
  )
}
