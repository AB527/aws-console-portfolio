import type { Metadata } from "next"
import RouteTablesView from "@/components/services/vpc/RouteTablesView"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.vpcRouteTables }

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function RouteTablesPage({ searchParams }: Props) {
  const { id } = await searchParams
  // key remounts the view so a link to another route table selects it
  return <RouteTablesView key={id} initialId={id} />
}
