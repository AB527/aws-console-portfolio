import type { Metadata } from "next"
import SubnetsView from "@/components/services/vpc/SubnetsView"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.vpcSubnets }

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function SubnetsPage({ searchParams }: Props) {
  const { id } = await searchParams
  // key remounts the view so a link to another subnet selects it
  return <SubnetsView key={id} initialId={id} />
}
