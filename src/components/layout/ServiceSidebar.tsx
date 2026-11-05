"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import sidebars from "@data/sidebars.json"
import { openSans } from "@/lib/font"
import { serviceTitle } from "@/lib/serviceTitle"
import { SectionCaret, SidebarChevron, SIDEBAR_CLOSE_BUTTON_CLASS, mobileDrawerClass } from "@/components/ui/SidebarIcons"
import { useConsoleStore } from "@/store/useConsoleStore"

export interface SidebarItem {
  label: string
  href: string
  // `?view=` values that also count as this item, when it covers more than its own
  activeViews?: string[]
  // Path prefix that marks this item active, when it covers more than its own href
  match?: string
}

export interface SidebarSection {
  id: string
  label: string
  items: SidebarItem[]
}

export interface SidebarData {
  // Defaults to the service's title
  title?: string
  items?: SidebarItem[]
  sections?: SidebarSection[]
}

const NAVS: Record<string, SidebarData | undefined> = sidebars.navs
const ASIDE_CLASS = "w-[280px] shrink-0 bg-surface border-r border-line text-[14px] leading-5 text-ink"

// What a sidebar shows for `id`: its entry in sidebars.json, or the default one for any other service
export function sidebarNav(id: string): SidebarData & { title: string } {
  const nav = NAVS[id]
  if (nav) return { ...nav, title: nav.title ?? serviceTitle(id) }
  const fallback = NAVS.default ?? {}
  return {
    title: serviceTitle(id),
    items: fallback.items?.map((item) => ({ ...item, href: item.href.replace("%s", id) })),
  }
}

// Every link in a sidebar, top-level items first
export function sidebarLinks(id: string): SidebarItem[] {
  const nav = sidebarNav(id)
  return [...(nav.items ?? []), ...(nav.sections ?? []).flatMap((s) => s.items)]
}

function isActive(item: SidebarItem, pathname: string, view: string | null): boolean {
  if (item.match) return pathname.startsWith(item.match)
  const [path, query = ""] = item.href.split("?")
  const itemView = new URLSearchParams(query).get("view")
  if (itemView) return pathname === path && (item.activeViews ?? [itemView]).includes(view ?? "")
  return (pathname === path || pathname.startsWith(`${path}/`)) && !view
}

interface SidebarPanelProps {
  id: string
  onClose: () => void
  className?: string
  // Extra content between the title and the links
  children?: React.ReactNode
}

function PanelInner({ id, onClose, className = "", children }: SidebarPanelProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = searchParams.get("view")
  const region = searchParams.get("region")
  const nav = sidebarNav(id)
  const [closed, setClosed] = useState<Record<string, boolean>>({})

  // Links keep the region the visitor is browsing in
  const withRegion = (href: string) => (region ? `${href}${href.includes("?") ? "&" : "?"}region=${region}` : href)

  const link = (item: SidebarItem) => (
    <Link
      key={item.href}
      href={withRegion(item.href)}
      className={`block pl-7 pr-4 py-1.5 transition-colors ${
        isActive(item, pathname, view) ? "font-bold text-link" : "text-ink-body hover:text-link"
      }`}
    >
      {item.label}
    </Link>
  )

  return (
    <aside className={`${openSans.className} ${ASIDE_CLASS} sticky top-[53px] h-[calc(100vh-53px)] overflow-y-auto ${className}`}>
      <div className="flex items-center justify-between pl-7 pr-4 pt-5 pb-3">
        <span className="text-[20px] leading-6 font-bold">{nav.title}</span>
        <button onClick={onClose} aria-label={sidebars.labels.collapse} className={SIDEBAR_CLOSE_BUTTON_CLASS}>
          <SidebarChevron direction="left" />
        </button>
      </div>

      {children}

      <nav className="py-2">
        {nav.items?.map(link)}
        {nav.sections?.map((section) => {
          const open = !closed[section.id]
          return (
            <div key={section.id} className="mt-3">
              <button
                onClick={() => setClosed((c) => ({ ...c, [section.id]: open }))}
                aria-expanded={open}
                className="w-full flex items-center gap-3 px-4 py-1.5 text-[16px] font-bold hover:text-link transition-colors"
              >
                <SectionCaret open={open} />
                {section.label}
              </button>
              {open && section.items.map(link)}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

// The sidebar itself: title, close button and links, all taken from sidebars.json
export function SidebarPanel(props: SidebarPanelProps) {
  return (
    <Suspense
      fallback={
        <aside className={`${openSans.className} ${ASIDE_CLASS} hidden lg:block`}>
          <div className="pl-7 pr-4 pt-5 pb-3">
            <span className="text-[20px] leading-6 font-bold">{sidebarNav(props.id).title}</span>
          </div>
        </aside>
      }
    >
      <PanelInner {...props} />
    </Suspense>
  )
}

// Sidebar for a service page. Its close button and MobileNavToggle share the store state:
// from lg up it collapses to a thin rail, below lg it is a slide-in drawer.
export default function ServiceSidebar({ serviceId, children }: { serviceId: string; children?: React.ReactNode }) {
  const collapsed = useConsoleStore((s) => s.sidebarCollapsed)
  const setCollapsed = useConsoleStore((s) => s.setSidebarCollapsed)
  const mobileNavOpen = useConsoleStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useConsoleStore((s) => s.setMobileNavOpen)

  if (collapsed) {
    return (
      <aside className="w-[44px] shrink-0 bg-surface border-r border-line hidden lg:flex flex-col items-center pt-3">
        <button onClick={() => setCollapsed(false)} aria-label={sidebars.labels.expand} className={SIDEBAR_CLOSE_BUTTON_CLASS}>
          <SidebarChevron direction="right" />
        </button>
      </aside>
    )
  }

  function close() {
    if (window.matchMedia("(min-width: 1024px)").matches) setCollapsed(true)
    else setMobileNavOpen(false)
  }

  return (
    <SidebarPanel id={serviceId} onClose={close} className={mobileDrawerClass(mobileNavOpen)}>
      {children}
    </SidebarPanel>
  )
}
