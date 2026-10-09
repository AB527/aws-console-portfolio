// Shared icons for service sidebars

export function SectionCaret({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 text-gray-900 transition-transform duration-150 ${open ? "rotate-0" : "-rotate-90"}`}
    >
      <path d="M0 2h10L5 9z" />
    </svg>
  )
}

export function SidebarChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path
        d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Below lg a service sidebar becomes a slide-in drawer, toggled by MobileNavToggle
export function mobileDrawerClass(open: boolean) {
  return `max-lg:fixed max-lg:top-[56px] max-lg:bottom-[32px] max-lg:left-0 max-lg:z-50 max-lg:h-auto max-lg:w-[280px] max-lg:max-w-[85vw] max-lg:overflow-y-auto max-lg:shadow-2xl max-lg:transition-transform max-lg:duration-200 ${
    open ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
  }`
}

export const SIDEBAR_CLOSE_BUTTON_CLASS =
  "w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
