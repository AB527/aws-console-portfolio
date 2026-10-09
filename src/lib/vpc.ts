import vpcData from "@/data/vpc.json"

export type Route = { destination: string; target: string; url?: string }
export type Subnet = (typeof vpcData.subnets)[number]
export type RouteTable = (typeof vpcData.routeTables)[number]

export const connect = vpcData.vpc
export const ownerId = vpcData.ownerId
export const subnets = vpcData.subnets
export const routeTables = vpcData.routeTables

// Every route that leads to a real contact link
export const endpointCount = routeTables.reduce((n, rt) => n + rt.routes.length, 0)

export function routeTableForSubnet(subnetId: string): RouteTable | undefined {
  return routeTables.find((rt) => rt.subnetId === subnetId)
}

export function subnetForRouteTable(routeTable: RouteTable): Subnet | undefined {
  return subnets.find((s) => s.id === routeTable.subnetId)
}

// Like AWS, each table starts with the local route for the Connect's own range
export function routesFor(routeTable: RouteTable): Route[] {
  return [{ destination: connect.cidr, target: "local" }, ...routeTable.routes]
}

export function subnetArn(subnet: Subnet): string {
  return `arn:aws:ec2:${vpcData.region}:${ownerId}:subnet/${subnet.id}`
}
