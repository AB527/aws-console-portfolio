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
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`block pl-7 pr-4 py-1.5 text-[14px] leading-5 transition-colors ${
        active ? "text-[#006ce0] font-bold" : "text-[#424650] hover:text-[#006ce0]"
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
  const isInstanceTypes = view === "instance-types" || view === "instance-type-finder"

  const region = searchParams.get("region") ?? ""
  const regionParam = region ? `?region=${region}` : ""

  return (
    <aside className="w-[280px] shrink-0 bg-white border-r border-[#c6c6cd] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto flex flex-col text-[#0f141a]">
      {/* Service header */}
      <div className="flex items-center justify-between pl-7 pr-4 pt-5 pb-3">
        <span className="text-[20px] leading-6 font-bold">{serviceTitle("ec2")}</span>
        <Link href={`/${regionParam}`} className={SIDEBAR_CLOSE_BUTTON_CLASS} title="Back to console" aria-label="Back to console">
          <SidebarChevron direction="left" />
        </Link>
      </div>

      <nav className="flex-1 py-2">
        {/* Dashboard */}
        <NavLink href={`/ec2/home${regionParam}`} label="Dashboard" active={isDashboard} />

        {/* Spacer */}
        <div className="my-3" />

        {/* Projects section */}
        <button
          onClick={() => setInstancesOpen((o) => !o)}
          className="w-full flex items-center gap-3 pl-4 pr-4 py-1.5 text-[16px] leading-5 font-bold hover:text-[#006ce0] transition-colors"
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
            />
            <NavLink
              href={`/ec2/home?view=instance-types${region ? `&region=${region}` : ""}`}
              label="Project types"
              active={isInstanceTypes}
            />
          </>
        )}
      </nav>
    </aside>
  )
}
