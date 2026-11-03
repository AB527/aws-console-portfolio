"use client"

import { useState } from "react"
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb"
import HelpPanel from "@/components/layout/HelpPanel"
import HelpToggle from "@/components/layout/HelpToggle"
import { NavToggleButton } from "@/components/layout/MobileNavToggle"
import { SidebarPanel } from "@/components/layout/ServiceSidebar"
import { TopBarCrumbs } from "@/components/layout/ServiceTopBar"
import { mobileDrawerClass } from "@/components/ui/SidebarIcons"

const HELP_TOPIC = "console-home"

interface ConsoleHomeShellProps {
  children: React.ReactNode
  // Shown next to the navigation toggle
  breadcrumb?: BreadcrumbItem[]
  // Info icon and the help panel it opens
  help?: boolean
}

// Top bar with the navigation toggle, the side navigation it opens, and the page beside it
export default function ConsoleHomeShell({ children, breadcrumb, help: showHelp = true }: ConsoleHomeShellProps) {
  // Closed until asked for, so the dashboard keeps its full width
  const [navOpen, setNavOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 py-3 bg-surface border-b border-line text-ink-body">
        <div className="flex items-center gap-6 min-w-0">
          {/* The negative margin keeps the bar the height of the bare icon */}
          <NavToggleButton open={navOpen} onClick={() => setNavOpen((o) => !o)} className="-m-2" />
          {breadcrumb && <TopBarCrumbs items={breadcrumb} />}
        </div>
        {/* The negative margin keeps the bar the height of the bare icon */}
        {showHelp && <HelpToggle topic={HELP_TOPIC} className="-m-2" />}
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
        {showHelp && <HelpPanel />}
      </div>
    </>
  )
}
