"use client"

import Link from "next/link"
import ResourceSplitView, { DetailsCard, LINK, RoutesCard } from "@/components/services/vpc/ResourceSplitView"
import { StateBadge } from "@/components/services/vpc/VpcTable"
import { connect, ownerId, routeTableForSubnet, routesFor, subnetArn, subnets, type Subnet } from "@/lib/vpc"

function BlockPublicAccessOff() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[#656871]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
      </svg>
      Off
    </span>
  )
}

function RouteTableLink({ subnet }: { subnet: Subnet }) {
  const routeTable = routeTableForSubnet(subnet.id)
  if (!routeTable) return <>–</>
  return (
    <Link href={`/vpc/route-tables?id=${routeTable.id}`} className={LINK}>
      {routeTable.id}
    </Link>
  )
}

export default function SubnetsView({ initialId }: { initialId?: string }) {
  return (
    <ResourceSplitView
      title="Subnets"
      createLabel="Create subnet"
      searchPlaceholder="Find subnets by attribute or tag"
      items={subnets}
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
          cell: () => (
            <Link href={`/vpc/connects/${connect.id}`} className={LINK}>
              {connect.id}
            </Link>
          ),
        },
        { label: "IPv4 CIDR", cell: (s) => s.cidr },
        { label: "Route table", cell: (s) => <RouteTableLink subnet={s} /> },
      ]}
      tabs={[
        {
          label: "Details",
          render: (s) => (
            <DetailsCard
              fields={[
                { label: "Subnet ID", value: s.id, copy: s.id },
                { label: "Subnet ARN", value: subnetArn(s), copy: subnetArn(s) },
                { label: "State", value: <StateBadge state={s.state} /> },
                { label: "Block Public Access", value: <BlockPublicAccessOff /> },
                { label: "Name", value: s.name },
                { label: "IPv4 CIDR", value: s.cidr },
                { label: "Route table", value: <RouteTableLink subnet={s} /> },
                { label: "Owner", value: ownerId, copy: ownerId },
              ]}
            />
          ),
        },
        {
          label: "Route table",
          render: (s) => {
            const routeTable = routeTableForSubnet(s.id)
            // key resets the route filter when another subnet is selected
            return <RoutesCard key={s.id} routes={routeTable ? routesFor(routeTable) : []} />
          },
        },
      ]}
    />
  )
}
