"use client"

import Link from "next/link"
import ResourceTable, { type Column } from "./ResourceTable"
import StatusBadge from "@/components/ui/StatusBadge"
import DataStatus from "@/components/ui/DataStatus"
import { useData, type ContentData } from "@/hooks/useData"
import iamConsole from "@data/iam-console.json"

const LEVEL_RANK: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }

type Group = ContentData["iam-groups"]["groups"][number]

interface GroupRow {
  group: Group
  roleCount: number
  topLevel: string
}

export default function SkillGroupsTable() {
  const groups = useData("iam-groups")
  const users = useData("iam-users")
  const iamGroups = groups.data
  const iamUsers = users.data
  const loaded = iamGroups !== null && iamUsers !== null

  const rows: GroupRow[] = loaded
    ? iamGroups.groups.map((group) => ({
        group,
        roleCount: iamUsers.users.filter((u) => u.groups.includes(group.id)).length,
        topLevel: group.skills.reduce(
          (best, s) => ((LEVEL_RANK[s.level] ?? 0) > (LEVEL_RANK[best] ?? 0) ? s.level : best),
          ""
        ),
      }))
    : []

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
      infoTopic="iam-groups"
      description={page.description}
      columns={columns}
      rows={rows}
      status={
        loaded ? undefined : (
          <DataStatus
            label="skill groups"
            error={groups.error || users.error}
            onRetry={() => {
              groups.reload()
              users.reload()
            }}
          />
        )
      }
      rowKey={(r) => r.group.id}
      searchText={(r) => r.group.label}
      searchPlaceholder={page.searchPlaceholder}
      createLabel={page.createLabel}
      emptyText={page.emptyText}
    />
  )
}
