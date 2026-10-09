import type { Metadata } from "next"
import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"
import VpcDashboard from "@/components/services/vpc/VpcDashboard"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.vpc }

export default function VpcPage() {
  return (
    <>
      <ServiceVisitor serviceId="vpc" />
      <VpcDashboard />
    </>
  )
}
