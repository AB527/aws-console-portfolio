"use client"

import { usePathname } from "next/navigation"
import { serviceTitle } from "@/lib/serviceTitle"
import { openSans } from "@/lib/font"
import ServiceSidebar, { sidebarLinks } from "@/components/layout/ServiceSidebar"
import ServiceTopBar from "@/components/layout/ServiceTopBar"
import HelpPanel from "@/components/layout/HelpPanel"

const NAV = sidebarLinks("cloudtrail")

export default function CloudTrailShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const current = NAV.find((n) => n.href === pathname) ?? NAV[0]

  return (
    <div
      className={`${openSans.className} bg-page min-h-[calc(100vh-53px)] flex flex-col text-[14px] leading-5 text-ink`}
    >
      <ServiceTopBar items={[{ label: serviceTitle("cloudtrail"), href: "/cloudtrail/home" }, { label: current.label }]} />

      <div className="flex flex-1">
        <ServiceSidebar serviceId="cloudtrail" />
        <main className="flex-1 min-w-0 px-4 lg:px-6 py-5">{children}</main>
        <HelpPanel />
      </div>
    </div>
  )
}
