"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import Topbar from "./Topbar"
import ConsoleFooter from "./ConsoleFooter"
import CloudShellPanel from "./CloudShellPanel"

interface ConsoleLayoutProps {
  children: React.ReactNode
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
  const visualMode = useConsoleStore((s) => s.visualMode)
  const cloudShellOpen = useConsoleStore((s) => s.cloudShellOpen)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    document.documentElement.dataset.theme = visualMode === "light" ? "light" : ""
  }, [visualMode])

  return (
    <div className="min-h-screen bg-[#f2f3f3]">
      <Topbar />
      <div className="mt-[56px] flex min-h-[calc(100vh-56px)]">
        {isHome && (
          <div className="w-[40px] shrink-0 bg-[#232f3e] flex flex-col items-center pt-2">
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#37475a] rounded transition-colors">
              <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor">
                <rect y="0" width="15" height="1.5" rx="0.75" />
                <rect y="5.25" width="15" height="1.5" rx="0.75" />
                <rect y="10.5" width="15" height="1.5" rx="0.75" />
              </svg>
            </button>
          </div>
        )}
        <main className="flex-1 min-w-0 overflow-x-hidden pb-[32px]">
          {children}
        </main>
      </div>
      {cloudShellOpen && <CloudShellPanel />}
      <ConsoleFooter />
    </div>
  )
}
