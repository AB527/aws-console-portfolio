"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import FavoriteStar from "@/components/ui/FavoriteStar"
import services from "@data/services.json"
import menu from "@data/services-menu.json"
import { openSans } from "@/lib/font"

type Service = (typeof services)[number]

function byIds(ids: string[]): Service[] {
  return ids
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is Service => s !== undefined)
}

export default function ServicesMenu({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const recentlyVisited = useConsoleStore((s) => s.recentlyVisited)
  const favorites = useConsoleStore((s) => s.favorites)
  const visitService = useConsoleStore((s) => s.visitService)
  // Services hidden in Unified settings > Account settings
  const hiddenServices = useConsoleStore((s) => s.hiddenServices)
  const [sectionId, setSectionId] = useState(menu.sections[0].id)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const section = menu.sections.find((s) => s.id === sectionId) ?? menu.sections[0]
  const items = (
    section.id === "recent" ? byIds(recentlyVisited) : section.id === "favourites" ? byIds(favorites) : services
  ).filter((s) => !hiddenServices.includes(s.id))

  function navigate(serviceId: string) {
    visitService(serviceId)
    router.push(`/${serviceId}/home`)
    onClose()
  }

  return (
    <div
      className={`${openSans.className} absolute -left-1.5 top-full w-[620px] max-w-[calc(100vw-120px)] max-md:fixed max-md:inset-x-0 max-md:top-[53px] max-md:w-auto max-md:max-w-none h-[calc(100vh-53px)] bg-[#161d26] border border-[#424650] border-t-0 shadow-2xl z-50 flex overflow-hidden cursor-default select-text`}
    >
      {/* Left section list */}
      <div className="w-[176px] max-md:w-[140px] shrink-0 pt-5 pb-4 pl-4 md:pl-7 pr-3 border-r border-[#424650] overflow-y-auto">
        {menu.sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSectionId(s.id)}
            className={`block w-full text-left py-1 text-[14px] leading-5 transition-colors ${
              s.id === section.id ? "font-bold text-[#75b8ff]" : "text-[#dedee3] hover:text-[#75b8ff]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Right pane */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center justify-between gap-4 pl-5 md:pl-10 pr-5 md:pr-8 h-[60px] border-b border-[#424650] shrink-0">
          <h2 className="text-[18px] leading-[22px] font-bold text-white">{section.label}</h2>
          <button
            onClick={onClose}
            aria-label={menu.close}
            title={menu.close}
            className="text-white hover:text-[#75b8ff] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M2 2l14 14M16 2L2 16" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pl-1 md:pl-6 pr-5 md:pr-8 py-5">
          {items.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {items.map((service) => (
                <li key={service.id} className="group flex items-start gap-1">
                  <FavoriteStar
                    serviceId={service.id}
                    size={12}
                    className={`mt-1 ${favorites.includes(service.id) ? "" : "md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"}`}
                  />
                  <button onClick={() => navigate(service.id)} className="flex-1 min-w-0 text-left">
                    <p className="text-[16px] leading-5 font-bold text-white group-hover:text-[#75b8ff]">
                      {service.title}
                    </p>
                    <p className="text-[12px] leading-4 text-[#c6c6cd] mt-1.5">{service.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12px] leading-4 text-[#c6c6cd] pl-4">{section.empty}</p>
          )}
        </div>
      </div>
    </div>
  )
}
