"use client"

import { useRef, useState } from "react"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

type SolutionItem = {
  title: string
  description: string
  source: string
  time: string
  link: string
}

function ExternalIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      className="inline-block ml-1 -mb-px shrink-0"
    >
      <path
        d="M4.5 2H10v5.5M10 2L5 7M2 4v6h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SolutionsWidget() {
  const { data: solutions, error, reload } = useData("solutions")
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  if (!solutions) return <DataStatus label="solutions" error={error} onRetry={reload} />
  const tab = solutions.tabs.find((t) => t.id === activeTab) ?? solutions.tabs[0]

  function scrollTabs(dir: number) {
    tabsRef.current?.scrollBy({ left: dir * 140, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col h-full -mx-5 -mb-5">
      {/* Description */}
      <p className="text-[14px] text-ink-body leading-relaxed px-5 -mt-1 pb-3">
        {solutions.description}
      </p>

      {/* Tabs with chevron navigation */}
      <div className="flex items-stretch border-b border-line shrink-0">
        <button
          onClick={() => scrollTabs(-1)}
          className="flex items-center px-2.5 text-ink-muted hover:text-ink border-r border-line shrink-0"
          aria-label="Scroll tabs left"
        >
          <svg width="11" height="16" viewBox="0 0 8 12" fill="none">
            <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          ref={tabsRef}
          className="flex flex-1 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {solutions.tabs.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2.5 text-[14px] font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                idx > 0 ? "border-l border-l-line" : ""
              } ${
                tab.id === t.id
                  ? "border-b-link text-link"
                  : "border-b-transparent text-ink-body hover:text-ink"
              }`}
            >
              {t.name} ({t.items.length})
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTabs(1)}
          className="flex items-center px-2.5 text-ink-muted hover:text-ink border-l border-line shrink-0"
          aria-label="Scroll tabs right"
        >
          <svg width="11" height="16" viewBox="0 0 8 12" fill="none">
            <path d="M2 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5">
        {(tab.items as SolutionItem[]).map((item, i) => (
          <div key={i} className={`py-3 ${i > 0 ? "border-t border-line" : ""}`}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-bold text-link hover:underline leading-snug"
            >
              {item.title}
              <ExternalIcon />
            </a>
            <p className="text-[12px] text-ink-muted mt-1">{item.time}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-line shrink-0">
        <a
          href={solutions.footer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-center text-[14px] text-link hover:underline py-3"
        >
          {solutions.footer.label}
          <ExternalIcon />
        </a>
      </div>
    </div>
  )
}
