"use client"

import { Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import help from "@data/help.json"
import { useConsoleStore } from "@/store/useConsoleStore"

const PAGES: Record<string, string | undefined> = help.pages

// Help topic for a page: "<path>?view=<view>" first, then the path, then its longest listed parent
function pageTopic(pathname: string, view: string | null): string | undefined {
  const exact = (view && PAGES[`${pathname}?view=${view}`]) || PAGES[pathname]
  if (exact) return exact
  const parent = Object.keys(PAGES)
    .filter((path) => pathname.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0]
  return parent ? PAGES[parent] : undefined
}

// Info icon for a top bar. Opens the help panel on `topic`; filled blue while the panel is open.
export default function HelpToggle({ topic, className = "" }: { topic: string; className?: string }) {
  const helpTopic = useConsoleStore((s) => s.helpTopic)
  const setHelpTopic = useConsoleStore((s) => s.setHelpTopic)
  const open = helpTopic !== null

  return (
    <button
      onClick={() => setHelpTopic(open ? null : topic)}
      aria-label={open ? help.labels.close : help.labels.open}
      aria-expanded={open}
      className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full transition-colors ${
        open ? "bg-[#006ce0] text-white" : "text-ink-body hover:text-ink"
      } ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 11.5v5.5M12 7.25v.25" />
      </svg>
    </button>
  )
}

function PageHelpToggleInner({ className }: { className?: string }) {
  const topic = pageTopic(usePathname(), useSearchParams().get("view"))
  return topic ? <HelpToggle topic={topic} className={className} /> : null
}

// The same icon for a service page, with the topic worked out from the URL (see `pages` in help.json)
export function PageHelpToggle({ className }: { className?: string }) {
  return (
    <Suspense fallback={null}>
      <PageHelpToggleInner className={className} />
    </Suspense>
  )
}
