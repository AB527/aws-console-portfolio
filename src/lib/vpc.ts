import type vpcData from "@data/vpc.json"

export type VpcData = typeof vpcData
export type Route = { destination: string; target: string; url?: string }
export type Subnet = VpcData["subnets"][number]
export type RouteTable = VpcData["routeTables"][number]

// Every route that leads to a real contact link
export function endpointCount(vpc: VpcData): number {
  return vpc.routeTables.reduce((n, rt) => n + rt.routes.length, 0)
}

export function routeTableForSubnet(vpc: VpcData, subnetId: string): RouteTable | undefined {
  return vpc.routeTables.find((rt) => rt.subnetId === subnetId)
}

export function subnetForRouteTable(vpc: VpcData, routeTable: RouteTable): Subnet | undefined {
  return vpc.subnets.find((s) => s.id === routeTable.subnetId)
}

// Like AWS, each table starts with the local route for the Connect's own range
export function routesFor(vpc: VpcData, routeTable: RouteTable): Route[] {
  return [{ destination: vpc.vpc.cidr, target: "local" }, ...routeTable.routes]
}

export function subnetArn(vpc: VpcData, subnet: Subnet): string {
  return `arn:aws:ec2:${vpc.region}:${vpc.ownerId}:subnet/${subnet.id}`
}
