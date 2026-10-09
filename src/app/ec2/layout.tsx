import { Suspense } from "react"
import EC2Sidebar from "@/components/services/ec2/EC2Sidebar"
import EC2Breadcrumb from "@/components/services/ec2/EC2Breadcrumb"
import { serviceTitle } from "@/lib/serviceTitle"
import { openSans } from "@/lib/awsFont"

function SidebarFallback() {
  return (
    <aside className="w-[280px] shrink-0 bg-white border-r border-[#c6c6cd]">
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
      <div className="flex items-center px-4 py-2.5 bg-white border-b border-[#c6c6cd]">
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#006ce0] text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </span>
        <Suspense fallback={null}>
          <EC2Breadcrumb />
        </Suspense>
      </div>
      <div className="flex flex-1">
        <Suspense fallback={<SidebarFallback />}>
          <EC2Sidebar />
        </Suspense>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
