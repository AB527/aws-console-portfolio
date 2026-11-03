"use client"

import Link from "next/link"
import ResourceSplitView, {
  DetailsCard,
  LINK,
  RoutesCard,
  SimpleTable,
} from "@/components/services/vpc/ResourceSplitView"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import { routesFor, subnetForRouteTable, type RouteTable, type VpcData } from "@/lib/vpc"

function SubnetLink({ vpc, routeTable }: { vpc: VpcData; routeTable: RouteTable }) {
  const subnet = subnetForRouteTable(vpc, routeTable)
  if (!subnet) return <>–</>
  return (
    <Link href={`/vpc/subnets?id=${subnet.id}`} className={LINK}>
      {subnet.id} / {subnet.name}
    </Link>
  )
}

function ConnectLink({ vpc }: { vpc: VpcData }) {
  return (
    <Link href={`/vpc/connects/${vpc.vpc.id}`} className={LINK}>
      {vpc.vpc.id} | {vpc.vpc.name}
    </Link>
  )
}

export default function RouteTablesView({ initialId }: { initialId?: string }) {
  const { data: vpc, error, reload } = useData("vpc")

  // Rows only exist once `vpc` has loaded, so the cells below never run without it
  return (
    <ResourceSplitView
      // Remount when the data arrives so the first row gets selected
      key={vpc ? "ready" : "loading"}
      title="Route tables"
      infoTopic="vpc-route-tables"
      createLabel="Create route table"
      searchPlaceholder="Find route tables by attribute or tag"
      items={vpc?.routeTables ?? []}
      status={vpc ? undefined : <DataStatus label="route tables" error={error} onRetry={reload} />}
      initialId={initialId}
      searchText={(rt) => `${rt.name} ${rt.id} ${rt.routes.map((r) => `${r.destination} ${r.target}`).join(" ")}`}
      columns={[
        { label: "Name", cell: (rt) => rt.name },
        {
          label: "Route table ID",
          cell: (rt, select) => (
            <button onClick={select} className={LINK}>
              {rt.id}
            </button>
          ),
        },
        { label: "Explicit subnet associations", cell: (rt) => vpc && <SubnetLink vpc={vpc} routeTable={rt} /> },
        { label: "Edge associations", cell: () => "–" },
        { label: "Main", cell: () => "No" },
        { label: "Connect", cell: () => vpc && <ConnectLink vpc={vpc} /> },
      ]}
      tabs={[
        {
          label: "Details",
          render: (rt) =>
            vpc && (
              <DetailsCard
                fields={[
                  { label: "Route table ID", value: rt.id, copy: rt.id },
                  { label: "Main", value: "No" },
                  { label: "Explicit subnet associations", value: <SubnetLink vpc={vpc} routeTable={rt} /> },
                  { label: "Edge associations", value: "–" },
                  { label: "Connect", value: <ConnectLink vpc={vpc} /> },
                  { label: "Owner ID", value: vpc.ownerId, copy: vpc.ownerId },
                ]}
              />
            ),
        },
        {
          label: "Routes",
          // key resets the route filter when another table is selected
          render: (rt) => <RoutesCard key={rt.id} routes={vpc ? routesFor(vpc, rt) : []} />,
        },
        {
          label: "Subnet associations",
          render: (rt) => {
            const subnet = vpc ? subnetForRouteTable(vpc, rt) : undefined
            return (
              <div className="bg-surface rounded-2xl border border-line px-5 py-4">
                <h3 className="text-[20px] leading-6 font-bold mb-3">
                  Explicit subnet associations <span className="font-normal text-ink-muted">({subnet ? 1 : 0})</span>
                </h3>
                <SimpleTable columns={["Name", "Subnet ID", "IPv4 CIDR"]} empty="No subnet associations">
                  {subnet
                    ? [
                        <tr key={subnet.id}>
                          <td className="pr-4 py-2">{subnet.name}</td>
                          <td className="px-4 py-2">
                            <Link href={`/vpc/subnets?id=${subnet.id}`} className={LINK}>
                              {subnet.id}
                            </Link>
                          </td>
                          <td className="px-4 py-2">{subnet.cidr}</td>
                        </tr>,
                      ]
                    : []}
                </SimpleTable>
              </div>
            )
          },
        },
      ]}
    />
  )
}
