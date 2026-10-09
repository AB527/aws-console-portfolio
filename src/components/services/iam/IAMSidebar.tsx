"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import iamGroups from "@/data/iam-groups.json"
import iamUsers from "@/data/iam-users.json"

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
  dot,
}: {
  href: string
  label: string
  active: boolean
  indent?: boolean
  dot?: string
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 py-1.5 text-[13px] transition-colors border-l-2 truncate ${
        active
          ? "border-[#ff9900] bg-[#16212e] text-white"
          : "border-transparent text-gray-300 hover:bg-[#2d3e50] hover:text-white"
      } ${indent ? "pl-7 pr-4" : "px-4"}`}
    >
      {dot && (
        <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: dot }} />
      )}
      <span className="truncate">{label}</span>
    </Link>
  )
}

export default function IAMSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] shrink-0 bg-[#232f3e] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto flex flex-col">
      {/* Service header */}
      <div className="px-4 py-3 border-b border-[#3d4f61]">
        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">IAM</p>
        <p className="text-sm text-white font-medium mt-0.5">Skills</p>
      </div>

      <nav className="flex-1 py-2">
        <SidebarItem href="/iam/home" label="Dashboard" active={pathname === "/iam/home"} />

        <SidebarSection label="Skill Groups" />
        {iamGroups.groups.map((group) => (
          <SidebarItem
            key={group.id}
            href={`/iam/groups/${group.id}`}
            label={group.label}
            active={pathname === `/iam/groups/${group.id}`}
            indent
            dot={group.color}
          />
        ))}

        <SidebarSection label="Experience / Roles" />
        {iamUsers.users.map((user) => (
          <SidebarItem
            key={user.id}
            href={`/iam/users/${user.id}`}
            label={user.displayName}
            active={pathname === `/iam/users/${user.id}`}
            indent
          />
        ))}
      </nav>
    </aside>
  )
}
