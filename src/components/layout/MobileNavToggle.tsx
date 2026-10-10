"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"

const BUTTON_CLASS = "w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-[#006ce0] text-white"

function HamburgerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  )
}

function MobileNavToggleInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mobileNavOpen = useConsoleStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useConsoleStore((s) => s.setMobileNavOpen)

  const sidebarCollapsed = useConsoleStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useConsoleStore((s) => s.setSidebarCollapsed)

  // Close the drawer whenever navigation happens
  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname, searchParams, setMobileNavOpen])

  // Sidebars hide themselves from lg up through this attribute (see mobileDrawerClass)
  useEffect(() => {
    document.documentElement.toggleAttribute("data-sidebar-collapsed", sidebarCollapsed)
  }, [sidebarCollapsed])

  // Desktop: collapse/expand the sidebar. Phones: slide the drawer in and out.
  function toggle() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarCollapsed(!sidebarCollapsed)
    } else {
      setSidebarCollapsed(false)
      setMobileNavOpen(!mobileNavOpen)
    }
  }

  return (
    <>
      <button
        onClick={toggle}
        aria-label="Toggle navigation"
        aria-expanded={mobileNavOpen || !sidebarCollapsed}
        className={BUTTON_CLASS}
      >
        <HamburgerIcon />
      </button>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 top-[56px] bg-black/40 z-40 lg:hidden"
        />
      )}
    </>
  )
}

export default function MobileNavToggle() {
  return (
    <Suspense
      fallback={
        <span className={BUTTON_CLASS}>
          <HamburgerIcon />
        </span>
      }
    >
      <MobileNavToggleInner />
    </Suspense>
  )
}
