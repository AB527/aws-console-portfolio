"use client"

import { useState } from "react"
import { SectionCaret, SidebarChevron, SIDEBAR_CLOSE_BUTTON_CLASS } from "@/components/ui/SidebarIcons"

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
          className={SIDEBAR_CLOSE_BUTTON_CLASS}
        >
          <SidebarChevron direction="right" />
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
          className={SIDEBAR_CLOSE_BUTTON_CLASS}
        >
          <SidebarChevron direction="left" />
        </button>
      </div>
      <nav className="py-2 text-sm">
        {NAV_SECTIONS.map((section) => {
          const isOpen = openSections[section.heading]
          return (
            <div key={section.heading} className="mb-1">
              <button
                onClick={() => toggleSection(section.heading)}
                className="w-full flex items-center gap-2 px-4 py-1.5 text-[13px] font-bold text-gray-900 hover:bg-gray-50"
                aria-expanded={isOpen}
              >
                <SectionCaret open={!!isOpen} />
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
