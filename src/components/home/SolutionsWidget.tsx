"use client"

import { useState } from "react"
import solutions from "@/data/solutions.json"

type SolutionItem = {
  title: string
  description: string
  source: string
  time: string
  link: string
}

function LinkedInBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#0a66c2] bg-[#e8f0f9] rounded px-1.5 py-0.5 shrink-0">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="#0a66c2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
      Posted on LinkedIn
    </span>
  )
}

function MediumBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-700 bg-gray-100 rounded px-1.5 py-0.5 shrink-0">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
      Medium
    </span>
  )
}

export default function SolutionsWidget() {
  const [activeTab, setActiveTab] = useState(solutions.tabs[0].id)
  const tab = solutions.tabs.find((t) => t.id === activeTab) ?? solutions.tabs[0]

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200 mb-3 overflow-x-auto">
        {solutions.tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === t.id
                ? "border-[#0073bb] text-[#0073bb]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.name} ({t.items.length})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto">
        {(tab.items as SolutionItem[]).map((item, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2 flex-wrap">
              {item.source === "linkedin" ? <LinkedInBadge /> : <MediumBadge />}
            </div>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-semibold text-[#0073bb] hover:underline leading-snug"
            >
              {item.title}
            </a>
            <p className="text-[12px] font-medium text-gray-500 leading-relaxed">{item.description}</p>
            <span className="text-[12px] font-medium text-gray-400">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
