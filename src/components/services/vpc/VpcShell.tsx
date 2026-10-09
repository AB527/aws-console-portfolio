"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { serviceTitle } from "@/lib/serviceTitle"
import { openSans } from "@/lib/awsFont"
import { SectionCaret, SidebarChevron, SIDEBAR_CLOSE_BUTTON_CLASS } from "@/components/ui/SidebarIcons"
import vpcData from "@/data/vpc.json"

const NAV = [
  { href: "/vpc/connects", label: "Your Connects" },
  { href: "/vpc/subnets", label: "Subnets" },
  { href: "/vpc/route-tables", label: "Route tables" },
]

export default function VpcShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [sectionOpen, setSectionOpen] = useState(true)
  const current = NAV.find((n) => pathname.startsWith(n.href))

  return (
    <div
      className={`${openSans.className} bg-[#f9f9fa] min-h-[calc(100vh-56px)] flex flex-col text-[14px] leading-5 text-[#0f141a]`}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-[#c6c6cd] text-[16px]">
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#006ce0] text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </span>
        {current && (
          <>
            <Link href="/vpc/home" className="text-[#006ce0] underline underline-offset-4">
              {serviceTitle("vpc")}
            </Link>
            <svg className="text-[#656871]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="font-bold text-[#424650]">{current.label}</span>
          </>
        )}
      </div>

      <div className="flex flex-1">
        {collapsed ? (
          <aside className="w-[44px] shrink-0 bg-white border-r border-[#c6c6cd] hidden lg:flex flex-col items-center pt-3">
            <button onClick={() => setCollapsed(false)} aria-label="Expand sidebar" className={SIDEBAR_CLOSE_BUTTON_CLASS}>
              <SidebarChevron direction="right" />
            </button>
          </aside>
        ) : (
          <aside className="w-[280px] shrink-0 bg-white border-r border-[#c6c6cd] hidden lg:block">
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
        <main className="flex-1 min-w-0 px-6 py-5">{children}</main>
      </div>
    </div>
  )
}
