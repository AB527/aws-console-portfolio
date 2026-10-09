"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import s3Data from "@/data/s3.json"
import { serviceTitle } from "@/lib/serviceTitle"

function SidebarSection({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
    </div>
  )
}

function SidebarItem({
  href,
  label,
  active,
  indent = false,
  sub,
}: {
  href: string
  label: string
  active: boolean
  indent?: boolean
  sub?: string
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col py-1.5 text-[13px] transition-colors border-l-2 ${
        active
          ? "border-[#ff9900] bg-[#16212e] text-white"
          : "border-transparent text-gray-300 hover:bg-[#2d3e50] hover:text-white"
      } ${indent ? "pl-7 pr-4" : "px-4"}`}
    >
      <span className="truncate">{label}</span>
      {sub && <span className="text-[11px] text-gray-500 mt-0.5">{sub}</span>}
    </Link>
  )
}

export default function S3Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] shrink-0 bg-[#232f3e] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto flex flex-col">
      {/* Service header */}
      <div className="px-4 py-3 border-b border-[#3d4f61]">
        <p className="text-base text-white font-bold">{serviceTitle("s3")}</p>
      </div>

      <nav className="flex-1 py-2">
        <SidebarItem href="/s3/home" label="Overview" active={pathname === "/s3/home"} />

        <SidebarSection label="General Purpose Buckets" />
        {s3Data.buckets.map((bucket) => (
          <SidebarItem
            key={bucket.id}
            href={`/s3/home/${bucket.id}`}
            label={bucket.name}
            active={pathname === `/s3/home/${bucket.id}` || pathname.startsWith(`/s3/home/${bucket.id}/`)}
            indent
            sub={`${bucket.objects.length} object${bucket.objects.length !== 1 ? "s" : ""}`}
          />
        ))}
      </nav>
    </aside>
  )
}
