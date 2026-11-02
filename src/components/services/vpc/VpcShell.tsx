"use client"

import { usePathname } from "next/navigation"
import { serviceTitle } from "@/lib/serviceTitle"
import { openSans } from "@/lib/awsFont"
import ServiceSidebar, { sidebarNav } from "@/components/layout/ServiceSidebar"
import ServiceTopBar from "@/components/layout/ServiceTopBar"
import { useData } from "@/hooks/useData"

// The resource pages, i.e. everything in the sidebar except the dashboard
const NAV = (sidebarNav("vpc").sections ?? []).flatMap((s) => s.items)

export default function VpcShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const current = NAV.find((n) => pathname.startsWith(n.href))
  const vpcData = useData("vpc").data

  return (
    <div
      className={`${openSans.className} bg-[#f9f9fa] min-h-[calc(100vh-56px)] flex flex-col text-[14px] leading-5 text-[#0f141a]`}
    >
      <ServiceTopBar
        items={[
          { label: serviceTitle("vpc"), href: current ? "/vpc/home" : undefined },
          ...(current ? [{ label: current.label }] : []),
        ]}
      />

      <div className="flex flex-1">
        <ServiceSidebar serviceId="vpc">
          {/* Filter by Connect */}
          <div className="relative mx-5 mt-3 mb-3">
            <span className="absolute -top-2.5 left-3 px-1 bg-white text-xs font-bold">Filter by Connect:</span>
            <div className="flex items-center justify-between h-10 px-3 border border-[#8c8c94] rounded-lg">
              <span>{vpcData?.vpc.name ?? "–"}</span>
              <svg className="text-[#006ce0]" width="12" height="12" viewBox="0 0 10 10" fill="currentColor">
                <path d="M1 3h8L5 8z" />
              </svg>
            </div>
          </div>
        </ServiceSidebar>
        <main className="flex-1 min-w-0 px-4 lg:px-6 py-5">{children}</main>
      </div>
    </div>
  )
}
