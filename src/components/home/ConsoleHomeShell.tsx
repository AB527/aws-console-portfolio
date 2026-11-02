"use client"

import { useState } from "react"
import { NavToggleButton } from "@/components/layout/MobileNavToggle"
import { SidebarPanel } from "@/components/layout/ServiceSidebar"
import { mobileDrawerClass } from "@/components/ui/SidebarIcons"

// Top bar with the navigation toggle, the side navigation it opens, and the page beside it
export default function ConsoleHomeShell({ children }: { children: React.ReactNode }) {
  // Closed until asked for, so the dashboard keeps its full width
  const [navOpen, setNavOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 bg-white border-b border-[#c6c6cd] text-[#424650]">
        {/* The negative margin keeps the bar the height of the bare icon */}
        <NavToggleButton open={navOpen} onClick={() => setNavOpen((o) => !o)} className="-m-2" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 11v6M12 7v.5" />
        </svg>
      </div>

      <div className="flex">
        {navOpen && (
          <>
            <SidebarPanel id="console" onClose={() => setNavOpen(false)} className={mobileDrawerClass(true)} />
            <div
              onClick={() => setNavOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 top-[56px] bg-black/40 z-40 lg:hidden"
            />
          </>
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </>
  )
}
