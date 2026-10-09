"use client"

import { useEffect } from "react"
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

  useEffect(() => {
    document.documentElement.dataset.theme = visualMode === "light" ? "light" : ""
  }, [visualMode])

  return (
    <div className="min-h-screen bg-[#f2f3f3]">
      <Topbar />
      <div className="mt-[56px] flex min-h-[calc(100vh-56px)]">
        <main className="flex-1 min-w-0 overflow-x-hidden pb-[32px]">
          {children}
        </main>
      </div>
      {cloudShellOpen && <CloudShellPanel />}
      <ConsoleFooter />
    </div>
  )
}
