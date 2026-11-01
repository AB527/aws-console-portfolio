"use client"

import Link from "next/link"
import { useConsoleStore } from "@/store/useConsoleStore"
import ServiceIcon from "@/components/ui/ServiceIcon"
import FavoriteStar from "@/components/ui/FavoriteStar"
import services from "@/data/services.json"
import menu from "@/data/services-menu.json"

const EMPTY_TEXT = menu.sections.find((s) => s.id === "favourites")?.empty

export default function FavouritesWidget() {
  const favorites = useConsoleStore((s) => s.favorites)
  const favoriteServices = favorites
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as typeof services

  if (favoriteServices.length === 0) {
    return <p className="text-[#656871] py-4 text-center">{EMPTY_TEXT}</p>
  }

  return (
    <div className="grid grid-cols-2 gap-x-10 content-start">
      {favoriteServices.map((service) => (
        <div key={service.id} className="flex items-center gap-3 py-2.5 border-b border-[#c6c6cd]">
          <ServiceIcon iconId={service.iconId} color={service.color} size="sm" />
          <Link href={`/${service.id}/home`} className="flex-1 min-w-0 text-[#006ce0] hover:underline truncate">
            {service.title}
          </Link>
          <FavoriteStar serviceId={service.id} size={16} />
        </div>
      ))}
    </div>
  )
}
