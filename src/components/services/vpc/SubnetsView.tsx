"use client"

import Link from "next/link"
import ResourceSplitView, { DetailsCard, LINK, RoutesCard } from "@/components/services/vpc/ResourceSplitView"
import { StateBadge } from "@/components/services/vpc/VpcTable"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import { routeTableForSubnet, routesFor, subnetArn, type Subnet, type VpcData } from "@/lib/vpc"

function BlockPublicAccessOff() {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-muted">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
      </svg>
      Off
    </span>
  )
}

function RouteTableLink({ vpc, subnet }: { vpc: VpcData; subnet: Subnet }) {
  const routeTable = routeTableForSubnet(vpc, subnet.id)
  if (!routeTable) return <>–</>
  return (
    <Link href={`/vpc/route-tables?id=${routeTable.id}`} className={LINK}>
      {routeTable.id}
    </Link>
  )
}

export default function SubnetsView({ initialId }: { initialId?: string }) {
  const { data: vpc, error, reload } = useData("vpc")

  // Rows only exist once `vpc` has loaded, so the cells below never run without it
  return (
    <ResourceSplitView
      // Remount when the data arrives so the first row gets selected
      key={vpc ? "ready" : "loading"}
      title="Subnets"
      infoTopic="vpc-subnets"
      createLabel="Create subnet"
      searchPlaceholder="Find subnets by attribute or tag"
      items={vpc?.subnets ?? []}
      status={vpc ? undefined : <DataStatus label="subnets" error={error} onRetry={reload} />}
      initialId={initialId}
      searchText={(s) => `${s.name} ${s.id} ${s.cidr}`}
      columns={[
        { label: "Name", cell: (s) => s.name },
        {
          label: "Subnet ID",
          cell: (s, select) => (
            <button onClick={select} className={LINK}>
              {s.id}
            </button>
          ),
        },
        { label: "State", cell: (s) => <StateBadge state={s.state} /> },
        {
          label: "Connect",
          cell: () =>
            vpc && (
              <Link href={`/vpc/connects/${vpc.vpc.id}`} className={LINK}>
                {vpc.vpc.id}
              </Link>
            ),
        },
        { label: "IPv4 CIDR", cell: (s) => s.cidr },
        { label: "Route table", cell: (s) => vpc && <RouteTableLink vpc={vpc} subnet={s} /> },
      ]}
      tabs={[
        {
          label: "Details",
          render: (s) =>
            vpc && (
              <DetailsCard
                fields={[
                  { label: "Subnet ID", value: s.id, copy: s.id },
                  { label: "Subnet ARN", value: subnetArn(vpc, s), copy: subnetArn(vpc, s) },
                  { label: "State", value: <StateBadge state={s.state} /> },
                  { label: "Block Public Access", value: <BlockPublicAccessOff /> },
                  { label: "Name", value: s.name },
                  { label: "IPv4 CIDR", value: s.cidr },
                  { label: "Route table", value: <RouteTableLink vpc={vpc} subnet={s} /> },
                  { label: "Owner", value: vpc.ownerId, copy: vpc.ownerId },
                ]}
              />
            ),
        },
        {
          label: "Route table",
          render: (s) => {
            const routeTable = vpc && routeTableForSubnet(vpc, s.id)
            // key resets the route filter when another subnet is selected
            return <RoutesCard key={s.id} routes={vpc && routeTable ? routesFor(vpc, routeTable) : []} />
          },
        },
      ]}
    />
  )
}
