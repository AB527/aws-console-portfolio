"use client"

import Link from "next/link"
import { useConsoleStore } from "@/store/useConsoleStore"
import ServiceIcon from "@/components/ui/ServiceIcon"
import services from "@data/services.json"

export default function RecentlyVisitedWidget() {
  const recentlyVisited = useConsoleStore((s) => s.recentlyVisited)
  const visitedServices = recentlyVisited
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as typeof services

  if (visitedServices.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <p className="text-ink-muted py-4 text-center flex-1">
          No recently visited services.
        </p>
        <div className="border-t border-line pt-3 text-center">
          <Link href="/console/services" className="text-link hover:underline">
            View all services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="grid grid-cols-2 gap-x-10 content-start">
        {visitedServices.map((service, i) => {
          const lastRowStart =
            visitedServices.length - (visitedServices.length % 2 === 0 ? 2 : 1)
          const inLastRow = i >= lastRowStart
          return (
          <Link
            key={service.id}
            href={`/${service.id}/home`}
            className={`flex items-center gap-3 py-2.5 group/item ${
              inLastRow ? "" : "border-b border-line"
            }`}
          >
            <ServiceIcon iconId={service.iconId} color={service.color} size="sm" />
            <span className="text-link group-hover/item:underline truncate">
              {service.title}
            </span>
          </Link>
          )
        })}
      </div>
      <div className="mt-auto border-t border-line pt-3 text-center">
        <Link href="/console/services" className="text-link hover:underline">
          View all services
        </Link>
      </div>
    </div>
  )
}
