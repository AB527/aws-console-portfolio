"use client"

import { useState } from "react"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

type Tab = "recent" | "user-configured" | "ab-managed"

function relativeTime(dateStr: string): string {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return "1 week ago"
  if (diffDays < 21) return "2 weeks ago"
  if (diffDays < 28) return "3 weeks ago"
  if (diffDays < 60) return "1 month ago"
  const months = Math.floor(diffDays / 30)
  return `${months} months ago`
}

function HealthIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-gray-300 shrink-0 mt-0.5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M6 10h3l1.5-3 2 6 1.5-3H18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.18V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 7.3 19.4l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 13.7H4.5a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 6.3 8.6l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 12 4.6a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.18l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 11h.1a2 2 0 1 1 0 4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClipboardIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="shrink-0">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 10h6M9 14h6" strokeLinecap="round" />
    </svg>
  )
}

export default function NotificationsDropdown() {
  const [activeTab, setActiveTab] = useState<Tab>("recent")

  const { data: notificationsData, error, reload } = useData("notifications")
  const allItems = notificationsData?.items ?? []
  // The three newest, whatever their age
  const recentItems = [...allItems].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  const abManagedItems = allItems.filter((n) => n.type === "ab-managed")

  const displayItems =
    activeTab === "recent"
      ? recentItems
      : activeTab === "ab-managed"
        ? abManagedItems
        : []

  const tabs: { id: Tab; label: string; icon?: React.ReactNode }[] = [
    { id: "recent", label: "Most recent" },
    { id: "user-configured", label: "User configured", icon: <GearIcon /> },
    { id: "ab-managed", label: "AB managed", icon: <ClipboardIcon /> },
  ]

  return (
    <div className="absolute right-0 top-full w-[600px] max-w-[92vw] max-md:fixed max-md:left-2 max-md:right-2 max-md:top-[56px] max-md:w-auto max-md:max-w-none bg-[#1a2332] text-white rounded-b-xl overflow-hidden shadow-2xl z-50 flex flex-col max-h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-[#2d3f52] shrink-0">
        <h3 className="text-[18px] font-semibold text-white">Notifications</h3>
        <button className="text-[13px] text-[#539fe5] hover:underline">Notification centre</button>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 border-b border-[#2d3f52] shrink-0">
        {tabs.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-[14px] border-b-2 transition-colors ${
                active
                  ? "text-white font-semibold border-white"
                  : "text-gray-400 border-transparent hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!notificationsData ? (
          <DataStatus label="notifications" error={error} onRetry={reload} className="py-8 text-sm text-gray-400" />
        ) : displayItems.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No notifications to display.
          </div>
        ) : (
          <div className="divide-y divide-[#2d3f52]">
            {displayItems.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-7 py-4 hover:bg-[#243447] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <HealthIcon />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[14px] font-semibold text-white">{item.title}</span>
                      <span className="text-[13px] text-gray-400 shrink-0 whitespace-nowrap">
                        {relativeTime(item.date)}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-300 mt-1 leading-snug">
                      {item.message}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
