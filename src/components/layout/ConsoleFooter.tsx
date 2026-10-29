"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import CookiePreferencesDialog from "./CookiePreferencesDialog"

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
  const router = useRouter()

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
          <span>© 2026 Atharva Bedekar</span>
          <button
            onClick={() => router.push("/privacy")}
            className="hover:text-white transition-colors"
          >
            Privacy
          </button>
          <button
            onClick={() => router.push("/terms")}
            className="hover:text-white transition-colors"
          >
            Terms
          </button>
          <button
            onClick={() => setCookieOpen(true)}
            className="hover:text-white transition-colors"
          >
            Cookie preferences
          </button>
        </div>
      </footer>

      {cookieOpen && <CookiePreferencesDialog onClose={() => setCookieOpen(false)} />}

      {pwaOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setPwaOpen(false)}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#232f3e] rounded-lg flex items-center justify-center text-white">
                <MobileIcon size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Console Mobile App</h2>
                <p className="text-xs text-gray-500">Install on your device</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This portfolio can be installed as an app on your device:
            </p>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-2 mb-5">
              <li>
                <strong>Chrome / Edge</strong> — click the install icon (⊕) in the address bar
              </li>
              <li>
                <strong>Safari (iOS/macOS)</strong> — tap Share → &ldquo;Add to Home Screen&rdquo;
              </li>
              <li>
                <strong>Firefox</strong> — tap the menu → &ldquo;Install&rdquo;
              </li>
            </ol>
            <div className="flex justify-end">
              <button
                onClick={() => setPwaOpen(false)}
                className="px-4 py-1.5 bg-[#0073bb] text-white text-sm rounded hover:bg-[#005f99] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
