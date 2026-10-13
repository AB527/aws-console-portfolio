"use client"

import Link from "next/link"
import ResourceTable, { type Column } from "./ResourceTable"
import StatusBadge from "@/components/ui/StatusBadge"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import iamConsole from "@data/iam-console.json"

const LEVEL_RANK: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }

interface SkillRow {
  name: string
  level: string
  groupId: string
  groupLabel: string
  groupColor: string
}

export default function SkillsTable() {
  const { data: iamGroups, error, reload } = useData("iam-groups")
  const rows: SkillRow[] = (iamGroups?.groups ?? []).flatMap((g) =>
    g.skills.map((s) => ({ name: s.name, level: s.level, groupId: g.id, groupLabel: g.label, groupColor: g.color }))
  )

  const page = iamConsole.pages.skills
  const columns: Column<SkillRow>[] = [
    { header: page.columns.name, sortValue: (r) => r.name, render: (r) => <span className="text-gray-900 dark:text-ink">{r.name}</span> },
    {
      header: page.columns.group,
      sortValue: (r) => r.groupLabel,
      render: (r) => (
        <Link href={`/iam/groups/${r.groupId}`} className="inline-flex items-center gap-2 text-[#0073bb] dark:text-link hover:underline">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.groupColor }} />
          {r.groupLabel}
        </Link>
      ),
    },
    { header: page.columns.level, sortValue: (r) => LEVEL_RANK[r.level] ?? 0, render: (r) => <StatusBadge status={r.level} /> },
  ]

  return (
    <ResourceTable
      title={page.title}
      infoTopic="iam-skills"
      description={page.description}
      columns={columns}
      rows={rows}
      status={iamGroups ? undefined : <DataStatus label="skills" error={error} onRetry={reload} />}
      rowKey={(r) => `${r.groupId}:${r.name}`}
      searchText={(r) => `${r.name} ${r.groupLabel}`}
      searchPlaceholder={page.searchPlaceholder}
      createLabel={page.createLabel}
      emptyText={page.emptyText}
    />
  )
}
