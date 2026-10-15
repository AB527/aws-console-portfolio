"use client"

import { useState } from "react"
import { useConsoleStore } from "@/store/useConsoleStore"
import site from "@data/site.json"
import CookiePreferencesDialog from "./CookiePreferencesDialog"
import MobileAppDialog from "./MobileAppDialog"
import { LICENSE_URL } from "@/lib/constants"

function TerminalIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 15h5" strokeLinecap="round" />
    </svg>
  )
}

function MobileIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" strokeLinecap="round" />
    </svg>
  )
}

export default function ConsoleFooter() {
  const setCloudShellOpen = useConsoleStore((s) => s.setCloudShellOpen)
  const [cookieOpen, setCookieOpen] = useState(false)
  const [pwaOpen, setPwaOpen] = useState(false)

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 h-[32px] bg-[#232f3e] flex items-center justify-between px-4 text-[11px] text-gray-400 z-30 border-t border-[#3d4f61]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCloudShellOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <TerminalIcon />
            CloudShell
          </button>
          <button className="hover:text-white transition-colors">Feedback</button>
          <button
            onClick={() => setPwaOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <MobileIcon />
            Console Mobile App
          </button>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span>© 2026 {site.account.name}</span>
          <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Terms
          </a>
          <button
            onClick={() => setCookieOpen(true)}
            className="hover:text-white transition-colors"
          >
            Cookie preferences
          </button>
        </div>
      </footer>

      {cookieOpen && <CookiePreferencesDialog onClose={() => setCookieOpen(false)} />}

      {pwaOpen && <MobileAppDialog onClose={() => setPwaOpen(false)} />}
    </>
  )
}
