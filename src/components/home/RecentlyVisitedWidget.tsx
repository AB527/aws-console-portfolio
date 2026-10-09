"use client"

import Link from "next/link"
import { useConsoleStore } from "@/store/useConsoleStore"
import ServiceIcon from "@/components/ui/ServiceIcon"
import services from "@/data/services.json"

export default function RecentlyVisitedWidget() {
  const recentlyVisited = useConsoleStore((s) => s.recentlyVisited)
  const visitedServices = recentlyVisited
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as typeof services

  if (visitedServices.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <p className="text-[13px] font-medium text-gray-500 py-4 text-center flex-1">
          No recently visited services.
        </p>
        <div className="border-t border-gray-100 pt-2 text-center">
          <Link href="/getting-started" className="text-[13px] font-semibold text-[#0073bb] hover:underline">
            View all services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 content-start">
        {visitedServices.map((service, i) => {
          const lastRowStart =
            visitedServices.length - (visitedServices.length % 2 === 0 ? 2 : 1)
          const inLastRow = i >= lastRowStart
          return (
          <Link
            key={service.id}
            href={`/${service.id}/home`}
            className={`flex items-center gap-2 px-1 py-1 hover:bg-gray-50 transition-colors group ${
              inLastRow ? "" : "border-b border-gray-100"
            }`}
          >
            <ServiceIcon iconId={service.iconId} color={service.color} size="sm" />
            <span className="text-[13px] text-gray-700 group-hover:text-[#0073bb] group-hover:underline truncate leading-tight">
              {service.title}
            </span>
          </Link>
          )
        })}
      </div>
      <div className="mt-auto border-t border-gray-100 pt-2 text-center">
        <Link href="/getting-started" className="text-[13px] font-semibold text-[#0073bb] hover:underline">
          View all services
        </Link>
      </div>
    </div>
  )
}
