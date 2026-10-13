"use client"

import { useState } from "react"
import Link from "next/link"
import DataStatus from "@/components/ui/DataStatus"
import StatusBadge from "@/components/ui/StatusBadge"
import { useData } from "@/hooks/useData"
import { formatPeriod } from "@/lib/formatDate"
import iamConsole from "@data/iam-console.json"
import { CARD, LINK, ROW, TD, TD_INNER, TH, TH_INNER, SummaryGrid, TableCard, Tabs } from "./DetailParts"

const LEVEL_RANK: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }

interface GroupDetailProps {
  groupId: string
}

export default function GroupDetail({ groupId }: GroupDetailProps) {
  const [activeTab, setActiveTab] = useState<"skills" | "roles">("skills")
  const groups = useData("iam-groups")
  const users = useData("iam-users")
  const iamGroups = groups.data
  const iamUsers = users.data
  const copy = iamConsole.detail.group

  if (!iamGroups || !iamUsers) {
    return (
      <div className={CARD}>
        <DataStatus
          label={copy.label}
          error={groups.error || users.error}
          onRetry={() => {
            groups.reload()
            users.reload()
          }}
        />
      </div>
    )
  }

  const group = iamGroups.groups.find((g) => g.id === groupId)
  if (!group) return <p className="text-sm font-bold text-gray-500 dark:text-ink-muted">{iamConsole.detail.notFound}</p>

  const usersInGroup = iamUsers.users.filter((u) => u.groups.includes(groupId))
  const topLevel = group.skills.reduce(
    (best, s) => ((LEVEL_RANK[s.level] ?? 0) > (LEVEL_RANK[best] ?? 0) ? s.level : best),
    ""
  )

  return (
    <div>
      <h1 className="text-[24px] leading-[30px] font-bold text-gray-900 dark:text-ink mb-4">{group.label}</h1>

      <SummaryGrid
        items={[
          {
            label: copy.name,
            value: (
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
                {group.label}
              </span>
            ),
          },
          { label: copy.skills, value: group.skills.length },
          { label: copy.roles, value: usersInGroup.length },
          { label: copy.topLevel, value: topLevel ? <StatusBadge status={topLevel} /> : "–" },
        ]}
      />

      <Tabs
        tabs={[
          { id: "skills", label: `${copy.skillsTab} (${group.skills.length})` },
          { id: "roles", label: `${copy.rolesTab} (${usersInGroup.length})` },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "skills" ? (
        <TableCard title={copy.skillsTab} count={group.skills.length}>
          <thead>
            <tr className="border-b border-gray-300 dark:border-line">
              <th className={`${TH} pl-5`}>{copy.skillColumns.name}</th>
              <th className={TH}>
                <span className={TH_INNER}>{copy.skillColumns.level}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {group.skills.map((skill) => (
              <tr key={skill.name} className={ROW}>
                <td className={`${TD} pl-5`}>{skill.name}</td>
                <td className={TD}>
                  <div className={TD_INNER}>
                    <StatusBadge status={skill.level} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      ) : (
        <TableCard title={copy.rolesTab} count={usersInGroup.length}>
          <thead>
            <tr className="border-b border-gray-300 dark:border-line">
              <th className={`${TH} pl-5`}>{copy.roleColumns.role}</th>
              <th className={TH}>
                <span className={TH_INNER}>{copy.roleColumns.organization}</span>
              </th>
              <th className={TH}>
                <span className={TH_INNER}>{copy.roleColumns.status}</span>
              </th>
              <th className={TH}>
                <span className={TH_INNER}>{copy.roleColumns.period}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {usersInGroup.map((user) => (
              <tr key={user.id} className={ROW}>
                <td className={`${TD} pl-5`}>
                  <Link href={`/iam/users/${user.id}`} className={LINK}>
                    {user.description}
                  </Link>
                </td>
                <td className={TD}>
                  <div className={TD_INNER}>{user.displayName}</div>
                </td>
                <td className={TD}>
                  <div className={TD_INNER}>
                    <StatusBadge status={user.status} />
                  </div>
                </td>
                <td className={`${TD} whitespace-nowrap`}>
                  <div className={TD_INNER}>{formatPeriod(user.periodFrom, user.periodTo)}</div>
                </td>
              </tr>
            ))}
            {usersInGroup.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm font-bold text-gray-500 dark:text-ink-muted">
                  {copy.emptyRoles}
                </td>
              </tr>
            )}
          </tbody>
        </TableCard>
      )}
    </div>
  )
}
