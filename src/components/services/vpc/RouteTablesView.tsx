"use client"

import Link from "next/link"
import ResourceSplitView, {
  DetailsCard,
  LINK,
  RoutesCard,
  SimpleTable,
} from "@/components/services/vpc/ResourceSplitView"
import { connect, ownerId, routeTables, routesFor, subnetForRouteTable, type RouteTable } from "@/lib/vpc"

function SubnetLink({ routeTable }: { routeTable: RouteTable }) {
  const subnet = subnetForRouteTable(routeTable)
  if (!subnet) return <>–</>
  return (
    <Link href={`/vpc/subnets?id=${subnet.id}`} className={LINK}>
      {subnet.id} / {subnet.name}
    </Link>
  )
}

function ConnectLink() {
  return (
    <Link href={`/vpc/connects/${connect.id}`} className={LINK}>
      {connect.id} | {connect.name}
    </Link>
  )
}

export default function RouteTablesView({ initialId }: { initialId?: string }) {
  return (
    <ResourceSplitView
      title="Route tables"
      createLabel="Create route table"
      searchPlaceholder="Find route tables by attribute or tag"
      items={routeTables}
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
        { label: "Explicit subnet associations", cell: (rt) => <SubnetLink routeTable={rt} /> },
        { label: "Edge associations", cell: () => "–" },
        { label: "Main", cell: () => "No" },
        { label: "Connect", cell: () => <ConnectLink /> },
      ]}
      tabs={[
        {
          label: "Details",
          render: (rt) => (
            <DetailsCard
              fields={[
                { label: "Route table ID", value: rt.id, copy: rt.id },
                { label: "Main", value: "No" },
                { label: "Explicit subnet associations", value: <SubnetLink routeTable={rt} /> },
                { label: "Edge associations", value: "–" },
                { label: "Connect", value: <ConnectLink /> },
                { label: "Owner ID", value: ownerId, copy: ownerId },
              ]}
            />
          ),
        },
        {
          label: "Routes",
          // key resets the route filter when another table is selected
          render: (rt) => <RoutesCard key={rt.id} routes={routesFor(rt)} />,
        },
        {
          label: "Subnet associations",
          render: (rt) => {
            const subnet = subnetForRouteTable(rt)
            return (
              <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
                <h3 className="text-[20px] leading-6 font-bold mb-3">
                  Explicit subnet associations <span className="font-normal text-[#656871]">({subnet ? 1 : 0})</span>
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
