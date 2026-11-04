"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import { DARK_QUERY, resolveTheme } from "@/lib/theme"
import services from "@data/services.json"
import Topbar from "./Topbar"
import ConsoleFooter from "./ConsoleFooter"
import CloudShellPanel from "./CloudShellPanel"
import ABQPanel from "./ABQPanel"

interface ConsoleLayoutProps {
  children: React.ReactNode
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
  const pathname = usePathname()
  const visualMode = useConsoleStore((s) => s.visualMode)
  const cloudShellOpen = useConsoleStore((s) => s.cloudShellOpen)
  const abQOpen = useConsoleStore((s) => s.abQOpen)

  const setHelpTopic = useConsoleStore((s) => s.setHelpTopic)

  // Browser default follows the system setting, and keeps following it while the page is open
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const apply = () => {
      document.documentElement.dataset.theme = resolveTheme(visualMode, media.matches)
    }
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [visualMode])

  // Help is about the page it was opened on, so it closes when the visitor moves on
  useEffect(() => {
    setHelpTopic(null)
  }, [pathname, setHelpTopic])

  // Show the current service's icon as the tab favicon, falling back to the site icon elsewhere
  useEffect(() => {
    const service = services.find((s) => s.id === pathname.split("/")[1])
    const apply = () => {
      document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="shortcut icon"]').forEach((link) => {
        if (link.dataset.defaultHref === undefined) {
          link.dataset.defaultHref = link.getAttribute("href") ?? ""
          link.dataset.defaultType = link.getAttribute("type") ?? ""
        }
        const href = service ? `/icons/${service.iconId}.png` : link.dataset.defaultHref
        const type = service ? "image/png" : (link.dataset.defaultType ?? "")
        if (link.getAttribute("href") !== href) link.setAttribute("href", href)
        if ((link.getAttribute("type") ?? "") !== type) {
          if (type) link.setAttribute("type", type)
          else link.removeAttribute("type")
        }
      })
    }
    apply()
    // Next streams its own icon links into <head> after first paint, so re-apply when they arrive
    const observer = new MutationObserver(apply)
    observer.observe(document.head, { childList: true })
    return () => observer.disconnect()
  }, [pathname])

  return (
    <div className="min-h-screen bg-page">
      <Topbar />
      <div className={`mt-[56px] flex min-h-[calc(100vh-56px)] ${abQOpen ? "md:pl-[420px]" : ""}`}>
        <main className="flex-1 min-w-0 overflow-x-clip pb-[32px]">
          {children}
        </main>
      </div>
      {abQOpen && <ABQPanel />}
      {cloudShellOpen && <CloudShellPanel />}
      <ConsoleFooter />
    </div>
  )
}
