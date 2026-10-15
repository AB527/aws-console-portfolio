"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"

const BUTTON_CLASS = "w-8 h-8 shrink-0 flex items-center justify-center rounded-full transition-colors text-ink-body"

// The blue fill shows only while the sidebar is open. Service sidebars keep separate
// open states for desktop (not collapsed) and phones (drawer open), hence two flags.
function buttonClass(openOnDesktop: boolean, openOnMobile: boolean) {
  return `${BUTTON_CLASS} ${openOnDesktop ? "lg:bg-[#006ce0] lg:text-white" : "lg:hover:text-ink"} ${
    openOnMobile ? "max-lg:bg-[#006ce0] max-lg:text-white" : "max-lg:hover:text-ink"
  }`
}

function HamburgerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  )
}

// The hamburger itself, for a sidebar with a single open state
export function NavToggleButton({ open, onClick, className = "" }: { open: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle navigation"
      aria-expanded={open}
      className={`${buttonClass(open, open)} ${className}`}
    >
      <HamburgerIcon />
    </button>
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
        className={buttonClass(!sidebarCollapsed, mobileNavOpen)}
      >
        <HamburgerIcon />
      </button>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 top-[53px] bg-black/40 z-40 lg:hidden"
        />
      )}
    </>
  )
}

export default function MobileNavToggle() {
  return (
    <Suspense
      fallback={
        // Sidebars start open on desktop and closed on phones
        <span className={buttonClass(true, false)}>
          <HamburgerIcon />
        </span>
      }
    >
      <MobileNavToggleInner />
    </Suspense>
  )
}
