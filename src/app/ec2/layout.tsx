import { Suspense } from "react"
import EC2Breadcrumb from "@/components/services/ec2/EC2Breadcrumb"
import ServiceSidebar from "@/components/layout/ServiceSidebar"
import ServiceTopBar from "@/components/layout/ServiceTopBar"
import { openSans } from "@/lib/font"
import HelpPanel from "@/components/layout/HelpPanel"

export default function EC2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${openSans.className} bg-page min-h-[calc(100vh-53px)] flex flex-col`}>
      {/* Top bar */}
      <ServiceTopBar>
        <Suspense fallback={null}>
          <EC2Breadcrumb />
        </Suspense>
      </ServiceTopBar>
      <div className="flex flex-1">
        <ServiceSidebar serviceId="ec2" />
        <main className="flex-1 min-w-0">{children}</main>
        <HelpPanel />
      </div>
    </div>
  )
}
