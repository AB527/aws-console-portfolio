"use client"

import { useState } from "react"

const NAV_SECTIONS = [
  {
    heading: "Buckets",
    items: ["General purpose buckets"],
    active: "General purpose buckets",
  },
]

export default function S3SubSidebar({ title }: { title?: string }) {
  const [collapsed, setCollapsed] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(NAV_SECTIONS.map((s) => [s.heading, true]))
  )

  const toggleSection = (heading: string) =>
    setOpenSections((prev) => ({ ...prev, [heading]: !prev[heading] }))

  if (collapsed) {
    return (
      <aside className="w-[44px] shrink-0 bg-white border-r border-gray-200 hidden lg:flex flex-col items-center pt-3">
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </aside>
    )
  }

  return (
    <aside className="w-[232px] shrink-0 bg-white border-r border-gray-200 hidden lg:block">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-gray-900">{title}</span>
        <button
          onClick={() => setCollapsed(true)}
          aria-label="Collapse sidebar"
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>
      <nav className="py-2 text-sm">
        {NAV_SECTIONS.map((section) => {
          const isOpen = openSections[section.heading]
          return (
            <div key={section.heading} className="mb-1">
              <button
                onClick={() => toggleSection(section.heading)}
                className="w-full flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold text-gray-900 hover:bg-gray-50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`text-gray-700 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
                {section.heading}
              </button>
              {isOpen &&
                section.items.map((item) => {
                  const isActive = section.active === item
                  return (
                    <a
                      key={item}
                      className={`block pl-7 pr-4 py-1.5 cursor-pointer text-[#0073bb] hover:underline ${
                        isActive ? "font-semibold" : ""
                      }`}
                    >
                      {item}
                    </a>
                  )
                })}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
