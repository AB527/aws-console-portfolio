import type { Metadata } from "next"
import Breadcrumb from "@/components/layout/Breadcrumb"
import AllServicesGrid from "@/components/services/AllServicesGrid"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.allServices }

export default function AllServicesPage() {
  return (
    <div className="p-6">
      <Breadcrumb
        items={[{ label: "Console home", href: "/console/home" }, { label: "All services" }]}
      />

      <h1 className="text-[28px] font-light text-gray-900 mb-4">All services</h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <AllServicesGrid />
      </div>
    </div>
  )
}
