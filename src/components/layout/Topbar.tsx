"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import SettingsDropdown from "./SettingsDropdown"
import AccountDropdown from "./AccountDropdown"
import NotificationsDropdown from "./NotificationsDropdown"
import HelpDropdown from "./HelpDropdown"
import SearchBar from "./SearchBar"
import MobileMoreMenu from "./MobileMoreMenu"
import regionsData from "@/data/regions.json"
import notificationsData from "@/data/notifications.json"

const RECENT_NOTIFICATION_COUNT = notificationsData.items.filter((n) => {
  const diffMs = new Date("2026-06-13").getTime() - new Date(n.date).getTime()
  return diffMs <= 30 * 24 * 60 * 60 * 1000
}).length

function TerminalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 15h5" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="9" height="6" viewBox="0 0 10 6" fill="none" className="opacity-70 shrink-0">
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type RegionId = "ap-south-1" | "ap-south-17"

function RegionDropdown({
  selectedRegion,
  onSelect,
}: {
  selectedRegion: RegionId
  onSelect: (id: RegionId) => void
}) {
  const [tab, setTab] = useState<"regions" | "local-zones">("regions")

  return (
    <div className="absolute right-0 top-full mt-0 w-[300px] max-md:static max-md:w-full max-md:rounded-none max-md:shadow-none max-md:border-0 max-md:bg-transparent bg-[#1a2332] border border-[#2d3f52] rounded-b-xl overflow-hidden shadow-2xl z-50 flex flex-col">
      {/* Tab switcher */}
      <div className="flex items-center gap-0 px-3 pt-3 pb-2">
        <button
          onClick={() => setTab("regions")}
          className={`px-4 py-1 text-[13px] font-medium rounded-l-full border transition-colors ${
            tab === "regions"
              ? "bg-[#4db8ff] text-[#0d1b2a] border-[#4db8ff]"
              : "bg-transparent text-gray-300 border-[#4d6070] hover:border-gray-400"
          }`}
        >
          Regions
        </button>
        <button
          onClick={() => setTab("local-zones")}
          className={`px-4 py-1 text-[13px] font-medium rounded-r-full border-t border-b border-r transition-colors ${
            tab === "local-zones"
              ? "bg-[#4db8ff] text-[#0d1b2a] border-[#4db8ff]"
              : "bg-transparent text-gray-300 border-[#4d6070] hover:border-gray-400"
          }`}
        >
          Local Zones
        </button>
      </div>

      {tab === "regions" ? (
        <>
          {/* Region groups */}
          <div className="flex-1 overflow-y-auto">
            {regionsData.groups.map((group) => (
              <div key={group.id}>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[12px] font-bold text-white">{group.name}</p>
                </div>
                <div>
                  {group.regions.map((region) => {
                    const isActive = selectedRegion === region.id
                    return (
                      <button
                        key={region.id}
                        onClick={() => onSelect(region.id as RegionId)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-[13px] hover:bg-[#243447] transition-colors border-t border-[#243447] ${
                          isActive ? "text-[#4db8ff]" : "text-gray-300"
                        }`}
                      >
                        <span className={isActive ? "font-semibold" : ""}>{region.city}</span>
                        <span className={`font-mono text-[12px] ${isActive ? "text-[#4db8ff] font-semibold" : "text-gray-400"}`}>
                          {region.id}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#2d3f52]">
            <button className="text-[12px] text-[#4db8ff] hover:underline">Manage Regions</button>
            <span className="text-[#2d3f52]">|</span>
            <button className="text-[12px] text-[#4db8ff] hover:underline">Manage local zones</button>
          </div>
        </>
      ) : (
        <div className="px-4 py-8 text-center text-gray-400 text-sm">
          No Local Zones available.
        </div>
      )}
    </div>
  )
}

function TopbarInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)
  const setRegion = useConsoleStore((s) => s.setRegion)
  const setCloudShellOpen = useConsoleStore((s) => s.setCloudShellOpen)
  const amazonQOpen = useConsoleStore((s) => s.amazonQOpen)
  const setAmazonQOpen = useConsoleStore((s) => s.setAmazonQOpen)
  const notificationsRead = useConsoleStore((s) => s.notificationsRead)
  const markNotificationsRead = useConsoleStore((s) => s.markNotificationsRead)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [pwaOpen, setPwaOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  const settingsRef = useRef<HTMLDivElement>(null)
  const regionRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const helpRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false)
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false)
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setHelpOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function handleRegionChange(r: RegionId) {
    setRegion(r)
    setRegionOpen(false)
    setMoreOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.set("region", r)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const activeRegion = regionsData.groups
    .flatMap((g) => g.regions)
    .find((r) => r.id === selectedRegion)

  const regionLabel = activeRegion?.full ?? selectedRegion

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] bg-[#0f1620] border-t-[5px] border-[#7d8998] flex items-center z-40 text-white text-[13px] select-none">
      {/* Logo */}
      <a href="/console/home" className="flex items-center justify-center h-full px-3 hover:bg-[#37475a] transition-colors shrink-0">
        <img src="/icons/navbar.png" alt="AWS" className="h-[22px] w-auto" />
      </a>

      <div className="w-[0.5px] h-8 bg-[#7d8998] mx-1.5 shrink-0 hidden md:block" />

      {/* Amazon Q */}
      <button
        onClick={() => { setMoreOpen(false); setAmazonQOpen(!amazonQOpen) }}
        aria-expanded={amazonQOpen}
        className="flex items-center justify-center h-full px-2.5 transition-colors shrink-0"
        title="Amazon Q"
      >
        <img src="/icons/amazon-q.png" alt="" className="h-[24px] w-[24px]" />
      </button>

      <div className="w-[0.5px] h-8 bg-[#7d8998] mx-1.5 shrink-0 hidden md:block" />

      {/* Grid icon */}
      <button className="flex items-center justify-center h-full px-2.5 transition-colors shrink-0 text-gray-300 hover:text-[#539fe5]">
        <svg width="18" height="18" viewBox="0 0 15 15" fill="currentColor">
          <rect x="0" y="0" width="4" height="4" rx="0.5" />
          <rect x="5.5" y="0" width="4" height="4" rx="0.5" />
          <rect x="11" y="0" width="4" height="4" rx="0.5" />
          <rect x="0" y="5.5" width="4" height="4" rx="0.5" />
          <rect x="5.5" y="5.5" width="4" height="4" rx="0.5" />
          <rect x="11" y="5.5" width="4" height="4" rx="0.5" />
          <rect x="0" y="11" width="4" height="4" rx="0.5" />
          <rect x="5.5" y="11" width="4" height="4" rx="0.5" />
          <rect x="11" y="11" width="4" height="4" rx="0.5" />
        </svg>
      </button>

      {/* Search */}
      <div className="flex-1 flex max-md:justify-end px-1.5 md:px-3 min-w-0">
        <SearchBar />
      </div>

      {/* Right side */}
      <div className="flex items-center h-full shrink-0">
        <div className="w-[0.5px] h-8 bg-[#7d8998] mx-1.5 md:hidden" />

        {/* CloudShell */}
        <button
          onClick={() => { setMoreOpen(false); setCloudShellOpen(true) }}
          className="flex items-center justify-center h-full w-[38px] text-gray-300 hover:text-[#539fe5] transition-colors"
          title="CloudShell"
        >
          <TerminalIcon />
        </button>

        <div className="w-[0.5px] h-8 bg-[#7d8998] mx-1.5" />

        {/* Notifications bell */}
        <div ref={notifRef} className="relative h-full">
          <button
            onClick={() => {
              setNotifOpen((o) => {
                const next = !o
                if (next) markNotificationsRead()
                return next
              })
            }}
            className={`relative flex items-center justify-center h-full w-[38px] transition-colors ${notifOpen ? "text-[#539fe5]" : "text-gray-300 hover:text-[#539fe5]"}`}
            title="Notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {!notificationsRead && RECENT_NOTIFICATION_COUNT > 0 && (
              <span className="absolute top-[7px] right-[6px] min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#d13212] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {RECENT_NOTIFICATION_COUNT}
              </span>
            )}
          </button>
          {notifOpen && <NotificationsDropdown />}
        </div>

        <div className="w-[0.5px] h-8 bg-[#7d8998] mx-1.5" />

        {/* More menu (phones) */}
        <button
          onClick={() => setMoreOpen((o) => !o)}
          aria-expanded={moreOpen}
          className={`md:hidden flex items-center gap-1.5 h-full pl-1.5 pr-3 text-[14px] transition-colors ${moreOpen ? "text-[#539fe5]" : "text-gray-200"}`}
        >
          More
          <svg width="10" height="7" viewBox="0 0 10 7" fill="currentColor" aria-hidden="true">
            <path d="M0 0h10L5 7z" />
          </svg>
        </button>

        {/* Help */}
        <div ref={helpRef} className="relative h-full hidden md:block">
          <button
            onClick={() => setHelpOpen((o) => !o)}
            className={`flex items-center justify-center h-full w-[38px] transition-colors ${helpOpen ? "text-[#539fe5]" : "text-gray-300 hover:text-[#539fe5]"}`}
            title="Help"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="17" r="0.5" fill="currentColor" />
            </svg>
          </button>
          {helpOpen && <HelpDropdown />}
        </div>

        <div className="w-[0.5px] h-8 bg-[#7d8998] mx-1.5 hidden md:block" />

        {/* Settings */}
        <div ref={settingsRef} className="relative h-full hidden md:block">
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            className={`flex items-center justify-center h-full w-[38px] transition-colors ${settingsOpen ? "text-[#539fe5]" : "text-gray-300 hover:text-[#539fe5]"}`}
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          {settingsOpen && <SettingsDropdown />}
        </div>

        <div className="w-[0.5px] h-8 bg-[#7d8998] mx-1.5 hidden md:block" />

        {/* Region dropdown */}
        <div ref={regionRef} className="relative h-full hidden md:block">
          <button
            onClick={() => setRegionOpen((o) => !o)}
            className={`flex items-center gap-1 h-full px-2 md:px-3 text-[13px] text-gray-200 hover:text-white transition-colors ${regionOpen ? "bg-[#37475a]" : "hover:bg-[#37475a]"}`}
          >
            <span className="hidden md:inline">{regionLabel}</span>
            <span className="md:hidden">{activeRegion?.city ?? selectedRegion}</span>
            <ChevronDown />
          </button>
          {regionOpen && (
            <RegionDropdown
              selectedRegion={selectedRegion}
              onSelect={handleRegionChange}
            />
          )}
        </div>

        {/* Account dropdown */}
        <div ref={accountRef} className="relative h-full hidden md:block">
          <button
            onClick={() => setAccountOpen((o) => !o)}
            className="group flex flex-col items-end h-full"
          >
            <span className={`flex items-center gap-2 rounded-b-md px-2 md:px-5 py-0.5 text-[11px] font-semibold text-[#1b242e] transition-colors ${accountOpen ? "bg-[#8b96a3]" : "bg-[#7d8998] group-hover:bg-[#8b96a3]"}`}>
              <span className="max-md:max-w-[72px] truncate">Atharva Bedekar (9820173314)</span>
              <ChevronDown />
            </span>
            <span className="hidden md:block text-[11px] text-white leading-none pt-1.5 pr-5">Atharva Bedekar</span>
          </button>
          {accountOpen && (
            <AccountDropdown
              onClose={() => setAccountOpen(false)}
              onInstallApp={() => setPwaOpen(true)}
            />
          )}
        </div>
      </div>

      {moreOpen && (
        <MobileMoreMenu
          regionLabel={regionLabel}
          sections={{
            account: (
              <AccountDropdown
                onClose={() => setMoreOpen(false)}
                onInstallApp={() => setPwaOpen(true)}
              />
            ),
            regions: <RegionDropdown selectedRegion={selectedRegion} onSelect={handleRegionChange} />,
            settings: <SettingsDropdown />,
            help: <HelpDropdown />,
          }}
        />
      )}

      {/* PWA install dialog */}
      {pwaOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setPwaOpen(false)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-gray-900">
            <h2 className="text-base font-semibold mb-3">Install Console Mobile App</h2>
            <p className="text-sm text-gray-600 mb-4">Install this portfolio as an app on your device:</p>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-2 mb-5">
              <li><strong>Chrome / Edge</strong> — click the install icon (⊕) in the address bar</li>
              <li><strong>Safari (iOS/macOS)</strong> — tap Share → &ldquo;Add to Home Screen&rdquo;</li>
              <li><strong>Firefox</strong> — tap the menu → &ldquo;Install&rdquo;</li>
            </ol>
            <div className="flex justify-end">
              <button
                onClick={() => setPwaOpen(false)}
                className="px-4 py-1.5 bg-[#0073bb] text-white text-sm rounded-full hover:bg-[#005f99] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default function Topbar() {
  return (
    <Suspense fallback={<header className="fixed top-0 left-0 right-0 h-[56px] bg-[#0f1620] border-t-[5px] border-[#7d8998] z-40" />}>
      <TopbarInner />
    </Suspense>
  )
}
