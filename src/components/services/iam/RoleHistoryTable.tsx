"use client"

import Link from "next/link"
import ResourceTable, { type Column } from "./ResourceTable"
import StatusBadge from "@/components/ui/StatusBadge"
import { formatPeriod } from "@/lib/formatDate"
import iamUsers from "@/data/iam-users.json"
import iamGroups from "@/data/iam-groups.json"
import iamConsole from "@/data/iam-console.json"

type User = (typeof iamUsers.users)[number]

const groupById = Object.fromEntries(iamGroups.groups.map((g) => [g.id, g]))

export default function RoleHistoryTable() {
  const page = iamConsole.pages.roles
  const columns: Column<User>[] = [
    {
      header: page.columns.role,
      sortValue: (u) => u.description,
      render: (u) => (
        <Link href={`/iam/users/${u.id}`} className="text-[#0073bb] hover:underline">
          {u.description}
        </Link>
      ),
    },
    { header: page.columns.organization, sortValue: (u) => u.displayName, render: (u) => u.displayName },
    {
      header: page.columns.groups,
      render: (u) => (
        <div className="flex flex-wrap gap-1">
          {u.groups.map((gId) => (
            <span
              key={gId}
              className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: groupById[gId]?.color ?? "#6b7280" }}
            >
              {groupById[gId]?.label ?? gId}
            </span>
          ))}
        </div>
      ),
    },
    { header: page.columns.status, sortValue: (u) => u.status, render: (u) => <StatusBadge status={u.status} /> },
    {
      header: page.columns.period,
      sortValue: (u) => u.periodFrom,
      render: (u) => <span className="whitespace-nowrap">{formatPeriod(u.periodFrom, u.periodTo)}</span>,
    },
  ]

  return (
    <ResourceTable
      title={page.title}
      description={page.description}
      columns={columns}
      rows={iamUsers.users}
      rowKey={(u) => u.id}
      searchText={(u) => `${u.description} ${u.displayName} ${u.username}`}
      searchPlaceholder={page.searchPlaceholder}
      createLabel={page.createLabel}
      emptyText={page.emptyText}
    />
  )
}
