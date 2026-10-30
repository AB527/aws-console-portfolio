"use client"

import { useRef, useState } from "react"
import solutions from "@/data/solutions.json"

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
  const [activeTab, setActiveTab] = useState(solutions.tabs[0].id)
  const tab = solutions.tabs.find((t) => t.id === activeTab) ?? solutions.tabs[0]
  const tabsRef = useRef<HTMLDivElement>(null)

  function scrollTabs(dir: number) {
    tabsRef.current?.scrollBy({ left: dir * 140, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col h-full -m-3">
      {/* Description */}
      <p className="text-[13px] text-gray-600 leading-relaxed px-4 -mt-1 pb-3">
        {solutions.description}
      </p>

      {/* Tabs with chevron navigation */}
      <div className="flex items-stretch border-b border-gray-200 shrink-0">
        <button
          onClick={() => scrollTabs(-1)}
          className="flex items-center px-2.5 text-gray-500 hover:text-gray-800 border-r border-gray-200 shrink-0"
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
              className={`px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                idx > 0 ? "border-l border-l-gray-200" : ""
              } ${
                activeTab === t.id
                  ? "border-b-[#0073bb] text-[#0073bb]"
                  : "border-b-transparent text-gray-700 hover:text-gray-900"
              }`}
            >
              {t.name} ({t.items.length})
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTabs(1)}
          className="flex items-center px-2.5 text-gray-500 hover:text-gray-800 border-l border-gray-200 shrink-0"
          aria-label="Scroll tabs right"
        >
          <svg width="11" height="16" viewBox="0 0 8 12" fill="none">
            <path d="M2 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4">
        {(tab.items as SolutionItem[]).map((item, i) => (
          <div key={i} className={`py-3 ${i > 0 ? "border-t border-gray-200" : ""}`}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-bold text-[#0073bb] hover:underline leading-snug"
            >
              {item.title}
              <ExternalIcon />
            </a>
            <p className="text-[12px] text-gray-500 mt-1">{item.time}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 shrink-0">
        <a
          href={solutions.footer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-center text-[13px] font-medium text-[#0073bb] hover:underline py-3"
        >
          {solutions.footer.label}
          <ExternalIcon />
        </a>
      </div>
    </div>
  )
}
