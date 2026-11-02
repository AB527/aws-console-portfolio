import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ConnectDetail from "@/components/services/vpc/ConnectDetail"
import site from "@data/site.json"
import vpcData from "@data/vpc.json"

interface Props {
  params: Promise<{ connectId: string }>
}

export function generateStaticParams() {
  return [{ connectId: vpcData.vpc.id }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { connectId } = await params
  return connectId === vpcData.vpc.id ? { title: site.detailTitles.vpc.replace("%s", vpcData.vpc.name) } : {}
}

export default async function ConnectPage({ params }: Props) {
  const { connectId } = await params
  if (connectId !== vpcData.vpc.id) notFound()

  return <ConnectDetail connectId={connectId} />
}
