import type { Metadata } from "next"
import ConsoleHomeShell from "@/components/home/ConsoleHomeShell"
import AllServicesGrid from "@/components/services/AllServicesGrid"
import { openSans } from "@/lib/awsFont"
import sidebars from "@data/sidebars.json"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.allServices }

export default function AllServicesPage() {
  const title = site.pageTitles.allServices

  return (
    <div className={`${openSans.className} min-h-screen bg-[#f9f9fa] text-[14px] leading-5 text-[#0f141a]`}>
      <ConsoleHomeShell
        help={false}
        breadcrumb={[{ label: sidebars.navs.console.title, href: "/console/home" }, { label: title }]}
      >
        <div className="max-w-[1520px] mx-auto px-4 lg:px-6 py-5">
          <h1 className="text-[24px] leading-[30px] font-bold mb-5">{title}</h1>
          <AllServicesGrid />
        </div>
      </ConsoleHomeShell>
    </div>
  )
}
