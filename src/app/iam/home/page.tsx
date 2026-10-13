import type { Metadata } from "next"
import IAMHome from "@/components/services/iam/IAMHome"
import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.iam }

export default async function IAMHomePage() {
  return (
    <>
      <ServiceVisitor serviceId="iam" />
      <div className="px-4 lg:px-6 py-6">
        <IAMHome />
      </div>
    </>
  )
}
