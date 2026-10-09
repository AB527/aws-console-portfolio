"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import SettingsDropdown from "./SettingsDropdown"
import AccountDropdown from "./AccountDropdown"
import NotificationsDropdown from "./NotificationsDropdown"
import SearchBar from "./SearchBar"
import regionsData from "@/data/regions.json"

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
    <div className="absolute right-0 top-full mt-0 w-[300px] bg-[#1a2332] border border-[#2d3f52] shadow-2xl z-50 flex flex-col">
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

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [pwaOpen, setPwaOpen] = useState(false)

  const settingsRef = useRef<HTMLDivElement>(null)
  const regionRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false)
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false)
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function handleRegionChange(r: RegionId) {
    setRegion(r)
    setRegionOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.set("region", r)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const activeRegion = regionsData.groups
    .flatMap((g) => g.regions)
    .find((r) => r.id === selectedRegion)

  const regionLabel = activeRegion?.full ?? selectedRegion

  return (
    <header className="fixed top-0 left-0 right-0 h-[48px] bg-[#0f1620] border-t-[3px] border-[#4a525d] flex items-center z-40 text-white text-[13px] select-none">
      {/* Logo */}
      <a href="/console/home" className="flex items-center justify-center h-full px-3 hover:bg-[#37475a] transition-colors shrink-0">
        <img src="/icons/navbar.png" alt="AWS" className="h-[22px] w-auto" />
      </a>

      <div className="w-px h-5 bg-[#3d4f61] shrink-0" />

      {/* Amazon Q */}
      <button className="flex items-center justify-center h-full px-2.5 hover:bg-[#37475a] transition-colors shrink-0" title="Amazon Q">
        <span className="h-[24px] w-[24px] rounded-[6px] bg-gradient-to-br from-[#3b5bf5] to-[#7b3ff2] flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.4" />
            <path d="M13 13l5 5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* Grid icon */}
      <button className="flex items-center justify-center h-full px-2.5 hover:bg-[#37475a] transition-colors shrink-0 text-gray-300 hover:text-white">
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
      <div className="flex-1 px-3 min-w-0">
        <SearchBar />
      </div>

      {/* Right side */}
      <div className="flex items-center h-full shrink-0">
        {/* CloudShell */}
        <button
          onClick={() => setCloudShellOpen(true)}
          className="flex items-center justify-center h-full w-[38px] text-gray-300 hover:bg-[#37475a] hover:text-white transition-colors"
          title="CloudShell"
        >
          <TerminalIcon />
        </button>

        {/* Notifications bell */}
        <div ref={notifRef} className="relative h-full">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className={`relative flex items-center justify-center h-full w-[38px] text-gray-300 hover:text-white transition-colors ${notifOpen ? "bg-[#37475a] text-white" : "hover:bg-[#37475a]"}`}
            title="Notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="absolute top-[7px] right-[7px] min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#d13212] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              1
            </span>
          </button>
          {notifOpen && <NotificationsDropdown />}
        </div>

        {/* Help */}
        <button className="flex items-center justify-center h-full w-[38px] text-gray-300 hover:bg-[#37475a] hover:text-white transition-colors" title="Help">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        </button>

        {/* Settings */}
        <div ref={settingsRef} className="relative h-full">
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            className={`flex items-center justify-center h-full w-[38px] text-gray-300 hover:text-white transition-colors ${settingsOpen ? "bg-[#37475a]" : "hover:bg-[#37475a]"}`}
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          {settingsOpen && <SettingsDropdown />}
        </div>

        <div className="w-px h-5 bg-[#3d4f61] mx-0.5" />

        {/* Region dropdown */}
        <div ref={regionRef} className="relative h-full">
          <button
            onClick={() => setRegionOpen((o) => !o)}
            className={`flex items-center gap-1 h-full px-3 text-[13px] text-gray-200 hover:text-white transition-colors ${regionOpen ? "bg-[#37475a]" : "hover:bg-[#37475a]"}`}
          >
            <span>{regionLabel}</span>
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
        <div ref={accountRef} className="relative h-full">
          <button
            onClick={() => setAccountOpen((o) => !o)}
            className="group flex flex-col items-end h-full"
          >
            <span className={`flex items-center gap-2 rounded-b-md px-5 py-0.5 text-[11px] font-semibold text-[#1b242e] transition-colors ${accountOpen ? "bg-[#566069]" : "bg-[#4a525d] group-hover:bg-[#566069]"}`}>
              Atharva Bedekar (9820173314)
              <ChevronDown />
            </span>
            <span className="text-[11px] text-white leading-none pt-1.5 pr-5">Atharva Bedekar</span>
          </button>
          {accountOpen && (
            <AccountDropdown
              onClose={() => setAccountOpen(false)}
              onInstallApp={() => setPwaOpen(true)}
            />
          )}
        </div>
      </div>

      {/* PWA install dialog */}
      {pwaOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setPwaOpen(false)}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl text-gray-900">
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
                className="px-4 py-1.5 bg-[#0073bb] text-white text-sm rounded hover:bg-[#005f99] transition-colors"
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
    <Suspense fallback={<header className="fixed top-0 left-0 right-0 h-[48px] bg-[#0f1620] border-t-[3px] border-[#4a525d] z-40" />}>
      <TopbarInner />
    </Suspense>
  )
}
