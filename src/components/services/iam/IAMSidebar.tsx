"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import iamConsole from "@/data/iam-console.json"
import { serviceTitle } from "@/lib/serviceTitle"
import { SectionCaret, SidebarChevron, SIDEBAR_CLOSE_BUTTON_CLASS } from "@/components/ui/SidebarIcons"

function NavLink({
  href,
  label,
  active,
  indent = false,
}: {
  href: string
  label: string
  active: boolean
  indent?: boolean
}) {
  return (
    <Link
      href={href}
      className={`block py-1.5 text-[14px] transition-colors ${indent ? "pl-9 pr-4" : "px-4"} ${
        active ? "text-[#0073bb] font-semibold" : "text-gray-700 hover:text-[#0073bb]"
      }`}
    >
      {label}
    </Link>
  )
}

export default function IAMSidebar() {
  const pathname = usePathname()
  const { nav } = iamConsole
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(nav.sections.map((s) => [s.id, true]))
  )

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-gray-200 sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto flex flex-col">
      {/* Service header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-5 pb-3">
        <span className="text-[20px] leading-tight font-bold text-gray-900">{serviceTitle("iam")}</span>
        <Link href="/console/home" className={SIDEBAR_CLOSE_BUTTON_CLASS} title={nav.backLabel} aria-label={nav.backLabel}>
          <SidebarChevron direction="left" />
        </Link>
      </div>

      <nav className="flex-1 pb-4">
        <NavLink href={nav.dashboard.href} label={nav.dashboard.label} active={pathname === nav.dashboard.href} />

        {nav.sections.map((section) => (
          <div key={section.id} className="mt-3">
            <button
              onClick={() => setOpen((o) => ({ ...o, [section.id]: !o[section.id] }))}
              className="w-full flex items-center gap-2 px-4 py-1.5 text-[14px] font-bold text-gray-900 hover:bg-gray-50 transition-colors"
              aria-expanded={open[section.id]}
            >
              <SectionCaret open={!!open[section.id]} />
              {section.label}
            </button>
            {open[section.id] &&
              section.items.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} indent />
              ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
