"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { serviceTitle } from "@/lib/serviceTitle"
import { openSans } from "@/lib/awsFont"
import { SectionCaret, SidebarChevron, SIDEBAR_CLOSE_BUTTON_CLASS, mobileDrawerClass } from "@/components/ui/SidebarIcons"
import { useConsoleStore } from "@/store/useConsoleStore"
import ServiceTopBar from "@/components/layout/ServiceTopBar"
import vpcData from "@/data/vpc.json"

const NAV = [
  { href: "/vpc/connects", label: "Your Connects" },
  { href: "/vpc/subnets", label: "Subnets" },
  { href: "/vpc/route-tables", label: "Route tables" },
]

export default function VpcShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const collapsed = useConsoleStore((s) => s.sidebarCollapsed)
  const setCollapsed = useConsoleStore((s) => s.setSidebarCollapsed)
  const [sectionOpen, setSectionOpen] = useState(true)
  const mobileNavOpen = useConsoleStore((s) => s.mobileNavOpen)
  const current = NAV.find((n) => pathname.startsWith(n.href))

  return (
    <div
      className={`${openSans.className} bg-[#f9f9fa] min-h-[calc(100vh-56px)] flex flex-col text-[14px] leading-5 text-[#0f141a]`}
    >
      <ServiceTopBar
        items={[
          { label: serviceTitle("vpc"), href: current ? "/vpc/home" : undefined },
          ...(current ? [{ label: current.label }] : []),
        ]}
      />

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
              <Link
                href="/vpc/home"
                className={`text-[20px] leading-6 font-bold ${pathname === "/vpc/home" ? "" : "hover:text-[#006ce0]"}`}
              >
                {serviceTitle("vpc")} dashboard
              </Link>
              <button onClick={() => setCollapsed(true)} aria-label="Collapse sidebar" className={SIDEBAR_CLOSE_BUTTON_CLASS}>
                <SidebarChevron direction="left" />
              </button>
            </div>

            {/* Filter by Connect */}
            <div className="relative mx-5 mt-3 mb-5">
              <span className="absolute -top-2.5 left-3 px-1 bg-white text-xs font-bold">Filter by Connect:</span>
              <div className="flex items-center justify-between h-10 px-3 border border-[#8c8c94] rounded-lg">
                <span>{vpcData.vpc.name}</span>
                <svg className="text-[#006ce0]" width="12" height="12" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M1 3h8L5 8z" />
                </svg>
              </div>
            </div>

            <nav className="pb-4">
              <button
                onClick={() => setSectionOpen((o) => !o)}
                aria-expanded={sectionOpen}
                className="flex items-center gap-3 pl-4 py-1.5 text-[16px] font-bold"
              >
                <SectionCaret open={sectionOpen} />
                Connect
              </button>
              {sectionOpen &&
                NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block pl-7 pr-4 py-1.5 ${
                      pathname.startsWith(item.href) ? "font-bold text-[#006ce0]" : "text-[#424650] hover:text-[#006ce0]"
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
