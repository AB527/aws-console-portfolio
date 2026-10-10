import { Suspense } from "react"
import EC2Sidebar from "@/components/services/ec2/EC2Sidebar"
import EC2Breadcrumb from "@/components/services/ec2/EC2Breadcrumb"
import ServiceTopBar from "@/components/layout/ServiceTopBar"
import { serviceTitle } from "@/lib/serviceTitle"
import { openSans } from "@/lib/awsFont"

function SidebarFallback() {
  return (
    <aside className="w-[280px] shrink-0 bg-white border-r border-[#c6c6cd] hidden lg:block">
      <div className="pl-7 pr-4 pt-5 pb-3">
        <span className="text-[20px] leading-6 font-bold text-[#0f141a]">{serviceTitle("ec2")}</span>
      </div>
    </aside>
  )
}

export default function EC2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${openSans.className} bg-[#f9f9fa] min-h-[calc(100vh-56px)] flex flex-col`}>
      {/* Top bar */}
      <ServiceTopBar>
        <Suspense fallback={null}>
          <EC2Breadcrumb />
        </Suspense>
      </ServiceTopBar>
      <div className="flex flex-1">
        <Suspense fallback={<SidebarFallback />}>
          <EC2Sidebar />
        </Suspense>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
