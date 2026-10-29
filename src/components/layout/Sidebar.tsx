"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import ServiceIcon from "@/components/ui/ServiceIcon"
import services from "@/data/services.json"

export default function Sidebar() {
  const pathname = usePathname()
  const visitService = useConsoleStore((s) => s.visitService)

  return (
    <aside className="fixed top-[48px] left-0 w-[220px] h-[calc(100vh-48px)] bg-[#232f3e] overflow-y-auto z-30">
      <nav className="py-2">
        {services.map((service) => {
          const href = `/${service.id}/home`
          const isActive = pathname.startsWith(`/${service.id}`)
          return (
            <Link
              key={service.id}
              href={href}
              onClick={() => visitService(service.id)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#16212e] text-white border-l-2 border-[#ff9900]"
                  : "text-gray-300 hover:bg-[#37475a] hover:text-white"
              }`}
            >
              <ServiceIcon iconId={service.iconId} color={service.color} size="sm" />
              <span>{service.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
