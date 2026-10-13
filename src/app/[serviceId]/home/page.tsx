import type { Metadata } from "next"
import { notFound } from "next/navigation"
import services from "@data/services.json"
import GenericServicePage from "@/components/services/GenericServicePage"
import ServiceVisitor from "./ServiceVisitor"

interface Props {
  params: Promise<{ serviceId: string }>
  searchParams: Promise<{ region?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params
  const service = services.find((s) => s.id === serviceId)
  return service ? { title: service.title } : {}
}

export default async function ServicePage({ params, searchParams }: Props) {
  const { serviceId } = await params
  const { region = "ap-south-1" } = await searchParams

  const service = services.find((s) => s.id === serviceId)
  if (!service) notFound()

  const validRegion = region === "ap-south-17" ? "ap-south-17" : "ap-south-1"

  return (
    <>
      <ServiceVisitor serviceId={serviceId} />
      <GenericServicePage service={service} region={validRegion} />
    </>
  )
}
