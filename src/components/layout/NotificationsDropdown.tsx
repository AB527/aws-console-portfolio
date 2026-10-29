"use client"

import { useState } from "react"
import notificationsData from "@/data/notifications.json"

type Tab = "recent" | "ab-managed"

function relativeTime(dateStr: string): string {
  const now = new Date("2026-06-13")
  const then = new Date(dateStr)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return "1 week ago"
  if (diffDays < 21) return "2 weeks ago"
  if (diffDays < 28) return "3 weeks ago"
  return "1 month ago"
}

function isWithinLastMonth(dateStr: string): boolean {
  const now = new Date("2026-06-13")
  const then = new Date(dateStr)
  const diffMs = now.getTime() - then.getTime()
  return diffMs <= 30 * 24 * 60 * 60 * 1000
}

function ABManagedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-[#4db8ff] shrink-0">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  )
}

export default function NotificationsDropdown() {
  const [activeTab, setActiveTab] = useState<Tab>("recent")

  const allItems = notificationsData.items
  const recentItems = allItems.filter((n) => isWithinLastMonth(n.date))
  const abManagedItems = allItems.filter((n) => n.type === "ab-managed")

  const displayItems = activeTab === "recent" ? recentItems : abManagedItems

  return (
    <div className="absolute right-0 top-full mt-0 w-[480px] bg-[#1a2332] text-white shadow-2xl z-50 border border-[#2d3f52] flex flex-col max-h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d3f52] shrink-0">
        <h3 className="text-[15px] font-semibold text-white">Notifications</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2d3f52] shrink-0">
        <button
          onClick={() => setActiveTab("recent")}
          className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
            activeTab === "recent"
              ? "text-[#4db8ff] border-[#4db8ff]"
              : "text-gray-400 border-transparent hover:text-gray-200"
          }`}
        >
          Most recent
        </button>
        <div className="w-px bg-[#2d3f52] my-2" />
        <button
          onClick={() => setActiveTab("ab-managed")}
          className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "ab-managed"
              ? "text-[#4db8ff] border-[#4db8ff]"
              : "text-gray-400 border-transparent hover:text-gray-200"
          }`}
        >
          <ABManagedIcon />
          AB managed
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {displayItems.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No notifications in the last month.
          </div>
        ) : (
          <div className="divide-y divide-[#2d3f52]">
            {displayItems.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-4 hover:bg-[#243447] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <ABManagedIcon />
                    <span className="text-[13px] font-semibold text-white">{item.title}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0 whitespace-nowrap">
                    {relativeTime(item.date)}
                  </span>
                </div>
                <p className="text-[13px] text-gray-300 mt-1.5 leading-snug pl-[22px]">
                  {item.message}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
