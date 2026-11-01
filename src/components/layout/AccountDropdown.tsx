"use client"

import { useState } from "react"

interface AccountDropdownProps {
  onClose: () => void
  onInstallApp: () => void
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export default function AccountDropdown({ onClose, onInstallApp }: AccountDropdownProps) {
  const [copied, setCopied] = useState<string | null>(null)

  function copy(text: string, field: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(field)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <div className="absolute right-0 top-full mt-0 w-[280px] max-md:static max-md:w-full max-md:rounded-none max-md:shadow-none max-md:border-0 max-md:bg-transparent bg-[#1a2332] text-white rounded-b-xl overflow-hidden shadow-2xl z-50 text-sm border border-[#2d3f52]">
      {/* Top link */}
      <div className="px-4 py-2.5 border-b border-[#2d3f52]">
        <button className="text-[#4db8ff] text-sm hover:underline">Atharva Bedekar</button>
      </div>

      {/* Account details */}
      <div className="px-4 py-3 border-b border-[#2d3f52] space-y-3">
        <div>
          <p className="text-[11px] font-bold text-white mb-1">Account ID</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copy("9820173314", "id")}
              className="text-[#4db8ff] hover:text-blue-300 shrink-0"
              title={copied === "id" ? "Copied!" : "Copy"}
            >
              <CopyIcon />
            </button>
            <span className="text-[13px] text-gray-200">
              {copied === "id" ? "Copied!" : "9820173314"}
            </span>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-white mb-1">Account name</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copy("Atharva Bedekar", "name")}
              className="text-[#4db8ff] hover:text-blue-300 shrink-0"
              title={copied === "name" ? "Copied!" : "Copy"}
            >
              <CopyIcon />
            </button>
            <span className="text-[13px] text-gray-200">
              {copied === "name" ? "Copied!" : "Atharva Bedekar"}
            </span>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-white mb-1">Account color</p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500 shrink-0" />
            <span className="text-[13px] text-gray-400">Unset</span>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <button
          onClick={onClose}
          className="w-full text-left px-4 py-2.5 text-[13px] text-gray-200 hover:bg-[#243447] transition-colors"
        >
          Account
        </button>
        <button
          onClick={() => { onClose(); onInstallApp() }}
          className="w-full text-left px-4 py-2.5 text-[13px] text-gray-200 hover:bg-[#243447] transition-colors"
        >
          Console Mobile App
        </button>
      </div>
    </div>
  )
}
