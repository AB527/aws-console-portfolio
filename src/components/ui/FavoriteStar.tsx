"use client"

import { useConsoleStore } from "@/store/useConsoleStore"
import menu from "@data/services-menu.json"

interface FavoriteStarProps {
  serviceId: string
  size?: number
  className?: string
}

export default function FavoriteStar({ serviceId, size = 20, className = "" }: FavoriteStarProps) {
  const isFavorite = useConsoleStore((s) => s.favorites.includes(serviceId))
  const toggleFavorite = useConsoleStore((s) => s.toggleFavorite)
  const label = isFavorite ? menu.removeFromFavourites : menu.addToFavourites

  return (
    <button
      // Keep focus where it is so the search panel doesn't close on click
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => toggleFavorite(serviceId)}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      className={`shrink-0 transition-colors ${isFavorite ? "text-[#ffb400]" : "text-ink-disabled hover:text-[#ffb400]"} ${className}`}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3 6.5 7 .6-5.3 4.6 1.6 6.9L12 17.8 5.7 20.6l1.6-6.9L2 9.1l7-.6z" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
