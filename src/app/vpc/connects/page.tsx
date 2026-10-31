import type { Metadata } from "next"
import Link from "next/link"
import VpcTable, { StateBadge } from "@/components/services/vpc/VpcTable"
import site from "@/data/site.json"
import vpcData from "@/data/vpc.json"

export const metadata: Metadata = { title: site.pageTitles.vpcVpcs }

export default function ConnectsPage() {
  const { vpc, subnets } = vpcData
  return (
    <VpcTable
      title="Your Connects"
      count={1}
      description="One Connect holds every way to get in touch."
      columns={["Name", "Connect ID", "State", "IPv4 CIDR", "Subnets"]}
    >
      <tr>
        <td className="pr-4 py-3">{vpc.name}</td>
        <td className="px-4 py-3 whitespace-nowrap">
          <Link href={`/vpc/connects/${vpc.id}`} className="text-[#006ce0] underline underline-offset-4">
            {vpc.id}
          </Link>
        </td>
        <td className="px-4 py-3">
          <StateBadge state={vpc.state} />
        </td>
        <td className="px-4 py-3 whitespace-nowrap">{vpc.cidr}</td>
        <td className="px-4 py-3">{subnets.length}</td>
      </tr>
    </VpcTable>
  )
}
