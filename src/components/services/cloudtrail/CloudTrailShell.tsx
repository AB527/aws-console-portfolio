"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { serviceTitle } from "@/lib/serviceTitle"
import { openSans } from "@/lib/awsFont"
import { SidebarChevron, SIDEBAR_CLOSE_BUTTON_CLASS, mobileDrawerClass } from "@/components/ui/SidebarIcons"
import { useConsoleStore } from "@/store/useConsoleStore"
import MobileNavToggle from "@/components/layout/MobileNavToggle"

const NAV = [
  { href: "/cloudtrail/home", label: "Dashboard" },
  { href: "/cloudtrail/events", label: "Event history" },
  { href: "/cloudtrail/trails", label: "Trails" },
]

export default function CloudTrailShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const mobileNavOpen = useConsoleStore((s) => s.mobileNavOpen)
  const title = serviceTitle("cloudtrail")
  const current = NAV.find((n) => n.href === pathname) ?? NAV[0]

  return (
    <div
      className={`${openSans.className} bg-[#f9f9fa] min-h-[calc(100vh-56px)] flex flex-col text-[14px] leading-5 text-[#0f141a]`}
    >
      {/* Breadcrumb bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-[#c6c6cd] text-[16px]">
        <MobileNavToggle />
        <Link href="/cloudtrail/home" className="text-[#006ce0] underline underline-offset-4">
          {title}
        </Link>
        <svg className="text-[#656871]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span className="font-bold text-[#424650]">{current.label}</span>
      </div>

      <div className="flex flex-1">
        {collapsed ? (
          <aside className="w-[44px] shrink-0 bg-white border-r border-[#c6c6cd] hidden lg:flex flex-col items-center pt-3">
            <button onClick={() => setCollapsed(false)} aria-label="Expand sidebar" className={SIDEBAR_CLOSE_BUTTON_CLASS}>
              <SidebarChevron direction="right" />
            </button>
          </aside>
        ) : (
          <aside className={`w-[280px] shrink-0 bg-white border-r border-[#c6c6cd] ${mobileDrawerClass(mobileNavOpen)}`}>
            <div className="flex items-center justify-between pl-7 pr-4 pt-5 pb-3">
              <span className="text-[20px] leading-6 font-bold">{title}</span>
              <button onClick={() => setCollapsed(true)} aria-label="Collapse sidebar" className={SIDEBAR_CLOSE_BUTTON_CLASS}>
                <SidebarChevron direction="left" />
              </button>
            </div>
            <nav className="pb-4 mx-5 border-b border-[#c6c6cd]">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-2 py-1.5 ${
                    item.href === current.href ? "font-bold text-[#006ce0]" : "text-[#424650] hover:text-[#006ce0]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        )}
        <main className="flex-1 min-w-0 px-4 lg:px-6 py-5">{children}</main>
      </div>
    </div>
  )
}
