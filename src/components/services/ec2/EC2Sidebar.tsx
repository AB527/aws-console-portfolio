"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
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
      className={`block py-1.5 text-[13px] transition-colors ${indent ? "pl-8 pr-4" : "px-4"} ${
        active
          ? "text-[#0073bb] font-medium"
          : "text-gray-700 hover:text-[#0073bb]"
      }`}
    >
      {label}
    </Link>
  )
}

export default function EC2Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = searchParams.get("view")
  const [instancesOpen, setInstancesOpen] = useState(true)

  const isDashboard = pathname === "/ec2/home" && !view
  const isInstances = view === "instances"
  const isInstanceTypes = view === "instance-types"

  const region = searchParams.get("region") ?? ""
  const regionParam = region ? `?region=${region}` : ""

  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-gray-200 sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto flex flex-col">
      {/* Service header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[16px] font-bold text-gray-900">{serviceTitle("ec2")}</span>
        <Link href={`/${regionParam}`} className={SIDEBAR_CLOSE_BUTTON_CLASS} title="Back to console" aria-label="Back to console">
          <SidebarChevron direction="left" />
        </Link>
      </div>

      <nav className="flex-1 py-2">
        {/* Dashboard */}
        <NavLink href={`/ec2/home${regionParam}`} label="Dashboard" active={isDashboard} />

        {/* Spacer */}
        <div className="my-2" />

        {/* Projects section */}
        <button
          onClick={() => setInstancesOpen((o) => !o)}
          className="w-full flex items-center gap-2 px-4 py-1.5 text-[13px] font-bold text-gray-900 hover:bg-gray-50 transition-colors"
          aria-expanded={instancesOpen}
        >
          <SectionCaret open={instancesOpen} />
          Projects
        </button>

        {instancesOpen && (
          <>
            <NavLink
              href={`/ec2/home?view=instances${region ? `&region=${region}` : ""}`}
              label="Projects"
              active={isInstances}
              indent
            />
            <NavLink
              href={`/ec2/home?view=instance-types${region ? `&region=${region}` : ""}`}
              label="Project types"
              active={isInstanceTypes}
              indent
            />
          </>
        )}
      </nav>
    </aside>
  )
}
