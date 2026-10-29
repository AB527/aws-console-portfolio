"use client"

import { usePathname } from "next/navigation"
import services from "@/data/services.json"
import ServiceIcon from "@/components/ui/ServiceIcon"

function GenericServiceSidebar({ serviceId }: { serviceId: string }) {
  const service = services.find((s) => s.id === serviceId)
  if (!service) return null

  return (
    <aside className="w-[220px] shrink-0 bg-[#232f3e] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto flex flex-col">
      <div className="px-4 py-3 border-b border-[#3d4f61] flex items-center gap-2">
        <ServiceIcon iconId={service.iconId} color={service.color} size="sm" />
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">{service.iconId.toUpperCase()}</p>
          <p className="text-sm text-white font-medium">{service.title}</p>
        </div>
      </div>
      <nav className="py-2">
        <a
          href={`/${serviceId}/home`}
          className="flex items-center px-4 py-2 text-[13px] text-gray-300 hover:bg-[#2d3e50] hover:text-white border-l-2 border-[#ff9900] bg-[#16212e] text-white"
        >
          Overview
        </a>
      </nav>
    </aside>
  )
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const serviceId = pathname.split("/")[1] ?? ""

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <GenericServiceSidebar serviceId={serviceId} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
