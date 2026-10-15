"use client"

import { useState } from "react"

type SectionId = "account" | "regions" | "settings" | "help"

interface MobileMoreMenuProps {
  regionLabel: string
  sections: Record<SectionId, React.ReactNode>
}

const ROWS: { id: SectionId; label: string }[] = [
  { id: "account", label: "Account details" },
  { id: "regions", label: "Regions" },
  { id: "settings", label: "Settings" },
  { id: "help", label: "Help & support" },
]

// Full-screen "More" panel that replaces the account, region, settings and help dropdowns on phones
export default function MobileMoreMenu({ regionLabel, sections }: MobileMoreMenuProps) {
  const [openSection, setOpenSection] = useState<SectionId | null>(null)

  return (
    <div className="md:hidden fixed inset-x-0 top-[53px] bottom-0 z-50 bg-[#1b232d] text-white flex flex-col overflow-y-auto select-text">
      {/* Account */}
      <div className="px-4 pt-3 pb-4 border-b border-[#424650]">
        <span className="block rounded-sm bg-[#7d8998] px-1 text-[13px] font-bold text-[#1b242e] truncate">
          Atharva Bedekar (9820173314)
        </span>
        <span className="block px-1 pt-1 text-[13px] font-bold">Atharva Bedekar</span>
      </div>

      {ROWS.map((row) => {
        const open = openSection === row.id
        return (
          <div key={row.id} className="border-b border-[#424650]">
            <button
              onClick={() => setOpenSection(open ? null : row.id)}
              aria-expanded={open}
              className="w-full flex items-center gap-4 px-3 py-3 text-left"
            >
              <span className="text-[14px] font-bold">{row.label}</span>
              {row.id === "regions" && <span className="text-[14px] text-gray-200 truncate">{regionLabel}</span>}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                className={`ml-auto shrink-0 text-gray-300 transition-transform ${open ? "rotate-90" : ""}`}
              >
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && <div className="bg-[#161d26]">{sections[row.id]}</div>}
          </div>
        )
      })}

      <button className="self-start py-1 text-[12px] font-bold text-[#539fe5] hover:underline">Send feedback</button>

      <div className="mt-auto flex flex-col items-end gap-3 p-3">
        <button className="h-7 px-4 rounded-full border-2 border-[#539fe5] text-[13px] font-bold text-[#539fe5]">
          Turn on multi-session support
        </button>
        <button className="h-7 px-5 rounded-full bg-[#ff9900] text-[13px] font-bold text-[#0f141a]">Sign out</button>
      </div>
    </div>
  )
}
