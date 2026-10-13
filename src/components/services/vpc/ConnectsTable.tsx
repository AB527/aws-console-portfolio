"use client"

import Link from "next/link"
import VpcTable, { StateBadge } from "@/components/services/vpc/VpcTable"
import { DataStatusRow } from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

const COLUMNS = ["Name", "Connect ID", "State", "IPv4 CIDR", "Subnets"]

export default function ConnectsTable() {
  const { data, error, reload } = useData("vpc")

  return (
    <VpcTable
      title="Your Connects"
      infoTopic="vpc-connects"
      count={data ? 1 : "–"}
      description="One Connect holds every way to get in touch."
      columns={COLUMNS}
    >
      {data ? (
        <tr>
          <td className="pr-4 py-3">{data.vpc.name}</td>
          <td className="px-4 py-3 whitespace-nowrap">
            <Link href={`/vpc/connects/${data.vpc.id}`} className="text-[#006ce0] underline underline-offset-4">
              {data.vpc.id}
            </Link>
          </td>
          <td className="px-4 py-3">
            <StateBadge state={data.vpc.state} />
          </td>
          <td className="px-4 py-3 whitespace-nowrap">{data.vpc.cidr}</td>
          <td className="px-4 py-3">{data.subnets.length}</td>
        </tr>
      ) : (
        <DataStatusRow colSpan={COLUMNS.length} label="Connects" error={error} onRetry={reload} />
      )}
    </VpcTable>
  )
}
