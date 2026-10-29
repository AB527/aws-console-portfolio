"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

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
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-[16px] font-bold text-gray-900">EC2</span>
        <Link href={`/${regionParam}`} className="text-gray-400 hover:text-gray-600 p-1" title="Back to console">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <nav className="flex-1 py-2">
        {/* Dashboard */}
        <NavLink href={`/ec2/home${regionParam}`} label="Dashboard" active={isDashboard} />

        {/* Spacer */}
        <div className="my-2" />

        {/* Instances section */}
        <button
          onClick={() => setInstancesOpen((o) => !o)}
          className="w-full flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 6"
            fill="currentColor"
            className={`transition-transform duration-150 ${instancesOpen ? "rotate-0" : "-rotate-90"}`}
          >
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          Instances
        </button>

        {instancesOpen && (
          <>
            <NavLink
              href={`/ec2/home?view=instances${region ? `&region=${region}` : ""}`}
              label="Instances"
              active={isInstances}
              indent
            />
            <NavLink
              href={`/ec2/home?view=instance-types${region ? `&region=${region}` : ""}`}
              label="Instance Types"
              active={isInstanceTypes}
              indent
            />
          </>
        )}
      </nav>
    </aside>
  )
}
