"use client"

import { usePathname } from "next/navigation"
import ServiceSidebar from "@/components/layout/ServiceSidebar"
import ServiceTopBar from "@/components/layout/ServiceTopBar"
import ServiceBreadcrumb from "@/components/layout/ServiceBreadcrumb"
import HelpPanel from "@/components/layout/HelpPanel"

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const serviceId = pathname.split("/")[1] ?? ""

  return (
    <>
      <ServiceTopBar>
        <ServiceBreadcrumb />
      </ServiceTopBar>
      <div className="flex min-h-[calc(100vh-56px)]">
        <ServiceSidebar serviceId={serviceId} />
        <main className="flex-1 min-w-0">{children}</main>
        <HelpPanel />
      </div>
    </>
  )
}
