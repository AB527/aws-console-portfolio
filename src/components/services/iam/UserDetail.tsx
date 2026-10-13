"use client"

import { useState } from "react"
import Link from "next/link"
import StatusBadge from "@/components/ui/StatusBadge"
import PolicyTag from "@/components/ui/PolicyTag"
import { formatPeriod } from "@/lib/formatDate"
import { regionFull } from "@/lib/cloudtrail"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import iamConsole from "@data/iam-console.json"
import { CARD, LINK, ROW, TD, TD_INNER, TH, TH_INNER, SummaryGrid, TableCard, Tabs } from "./DetailParts"

interface UserDetailProps {
  userId: string
}

export default function UserDetail({ userId }: UserDetailProps) {
  const [activeTab, setActiveTab] = useState<"permissions" | "groups">("permissions")

  const users = useData("iam-users")
  const groups = useData("iam-groups")
  const iamUsers = users.data
  const iamGroups = groups.data
  const copy = iamConsole.detail.role

  if (!iamUsers || !iamGroups) {
    return (
      <div className={CARD}>
        <DataStatus
          label={copy.label}
          error={users.error || groups.error}
          onRetry={() => {
            users.reload()
            groups.reload()
          }}
        />
      </div>
    )
  }

  const user = iamUsers.users.find((u) => u.id === userId)
  if (!user) return <p className="text-sm font-bold text-gray-500">{iamConsole.detail.notFound}</p>

  const userGroups = iamGroups.groups.filter((g) => user.groups.includes(g.id))

  return (
    <div>
      <h1 className="text-[24px] leading-[30px] font-bold text-gray-900 mb-4">{user.displayName}</h1>

      <SummaryGrid
        items={[
          { label: copy.organization, value: user.displayName },
          { label: copy.role, value: user.description },
          { label: copy.status, value: <StatusBadge status={user.status} /> },
          { label: copy.period, value: formatPeriod(user.periodFrom, user.periodTo) },
          { label: copy.region, value: regionFull(user.region) },
          {
            label: copy.groups,
            value: (
              <span className="flex flex-col gap-1">
                {userGroups.map((g) => (
                  <Link key={g.id} href={`/iam/groups/${g.id}`} className={`inline-flex items-center gap-2 ${LINK}`}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                    {g.label}
                  </Link>
                ))}
              </span>
            ),
          },
        ]}
      />

      <Tabs
        tabs={[
          { id: "permissions", label: `${copy.permissionsTab} (${user.policies.length})` },
          { id: "groups", label: `${copy.groupsTab} (${userGroups.length})` },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "permissions" ? (
        <TableCard title={copy.permissionsTab} count={user.policies.length}>
          <thead>
            <tr className="border-b border-gray-300">
              <th className={`${TH} pl-5`}>{copy.permissionColumns.name}</th>
              <th className={TH}>
                <span className={TH_INNER}>{copy.permissionColumns.effect}</span>
              </th>
              <th className={TH}>
                <span className={TH_INNER}>{copy.permissionColumns.type}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {user.policies.map((policy) => (
              <tr key={policy.name} className={ROW}>
                <td className={`${TD} pl-5`}>
                  <PolicyTag name={policy.name} />
                </td>
                <td className={TD}>
                  <div className={TD_INNER}>
                    <StatusBadge status={policy.effect} />
                  </div>
                </td>
                <td className={TD}>
                  <div className={TD_INNER}>{copy.policyType}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      ) : (
        <TableCard title={copy.groupsTab} count={userGroups.length}>
          <thead>
            <tr className="border-b border-gray-300">
              <th className={`${TH} pl-5`}>{copy.groupColumns.name}</th>
              <th className={TH}>
                <span className={TH_INNER}>{copy.groupColumns.skills}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {userGroups.map((g) => (
              <tr key={g.id} className={ROW}>
                <td className={`${TD} pl-5`}>
                  <Link href={`/iam/groups/${g.id}`} className={`inline-flex items-center gap-2 ${LINK}`}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                    {g.label}
                  </Link>
                </td>
                <td className={TD}>
                  <div className={TD_INNER}>{g.skills.length}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      )}
    </div>
  )
}
