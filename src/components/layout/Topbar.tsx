"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import site from "@data/site.json"
import SettingsDropdown from "./SettingsDropdown"
import AccountDropdown from "./AccountDropdown"
import NotificationsDropdown from "./NotificationsDropdown"
import HelpDropdown from "./HelpDropdown"
import SearchBar from "./SearchBar"
import MobileMoreMenu from "./MobileMoreMenu"
import ServicesMenu from "./ServicesMenu"
import servicesMenu from "@data/services-menu.json"
import regionsData from "@data/regions.json"
import services from "@data/services.json"
import { useData } from "@/hooks/useData"
import { GITHUB_REPO_URL } from "@/lib/constants"

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

function CaretDown() {
  return (
    <svg width="9" height="6" viewBox="0 0 10 6" fill="currentColor" className="shrink-0" aria-hidden="true">
      <path d="M0 0h10L5 6z" />
    </svg>
  )
}

type RegionId = "ap-south-1" | "ap-south-17"

function RegionDropdown({
  selectedRegion,
  onSelect,
  globalService,
}: {
  selectedRegion: RegionId
  onSelect: (id: RegionId) => void
  // Title of the current service when it is global: the list is shown but nothing can be chosen
  globalService?: string
}) {
  const [tab, setTab] = useState<"regions" | "local-zones">("regions")
  // Regions hidden in Unified settings > Account settings
  const hiddenRegions = useConsoleStore((s) => s.hiddenRegions)

  return (
    <div className="absolute right-0 top-full mt-0 w-[300px] max-md:static max-md:w-full max-md:rounded-none max-md:shadow-none max-md:border-0 max-md:bg-transparent bg-[#1a2332] border border-[#2d3f52] rounded-b-xl overflow-hidden shadow-2xl z-50 flex flex-col">
      {/* Tab switcher */}
      <div className="px-3 pt-3 pb-2">
        <div className="inline-flex items-center gap-1 p-[3px] rounded-full border border-[#656871]">
          <button
            onClick={() => setTab("regions")}
            className={`px-4 py-1 rounded-full text-[14px] font-bold transition-colors ${
              tab === "regions" ? "bg-[#75b8ff] text-[#0f141a]" : "text-[#dedee3] hover:text-white"
            }`}
          >
            Regions
          </button>
          <span className="w-px h-4 bg-[#656871]" aria-hidden="true" />
          <button
            onClick={() => setTab("local-zones")}
            className={`px-4 py-1 rounded-full text-[14px] font-bold transition-colors ${
              tab === "local-zones" ? "bg-[#75b8ff] text-[#0f141a]" : "text-[#dedee3] hover:text-white"
            }`}
          >
            Local Zones
          </button>
        </div>
      </div>

      {tab === "regions" ? (
        <>
          {globalService && (
            <p className="px-4 pt-1 pb-2 text-[12px] text-gray-300">
              {regionsData.globalNote.replace("%s", globalService)}
            </p>
          )}
          {/* Region groups */}
          <div className="flex-1 overflow-y-auto">
            {regionsData.groups.map((group) => (
              <div key={group.id}>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[12px] font-bold text-white">{group.name}</p>
                </div>
                <div>
                  {group.regions.filter((region) => !hiddenRegions.includes(region.id)).map((region) => {
                    const isActive = !globalService && selectedRegion === region.id
                    return (
                      <button
                        key={region.id}
                        disabled={!!globalService}
                        onClick={() => onSelect(region.id as RegionId)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-[13px] hover:bg-[#243447] disabled:hover:bg-transparent disabled:opacity-50 transition-colors relative before:absolute before:top-0 before:inset-x-4 before:h-[0.5px] before:bg-[#414d5c] ${
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
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#4db8ff] hover:underline">Manage Regions</a>
            <span className="text-[#2d3f52]">|</span>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#4db8ff] hover:underline">Manage local zones</a>
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
  const abQOpen = useConsoleStore((s) => s.abQOpen)
  const setAbQOpen = useConsoleStore((s) => s.setAbQOpen)
  const notificationsRead = useConsoleStore((s) => s.notificationsRead)
  const markNotificationsRead = useConsoleStore((s) => s.markNotificationsRead)
  const notifications = useData("notifications").data
  // Matches the "Most recent" tab of the dropdown, which lists the three newest
  const recentNotificationCount = Math.min(notifications?.items.length ?? 0, 3)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [pwaOpen, setPwaOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  const settingsRef = useRef<HTMLDivElement>(null)
  const regionRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const helpRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false)
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false)
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setHelpOpen(false)
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false)
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

  // Documents, Skills and Connect are the same in every Region, so the selector reads "Global" there
  const service = services.find((s) => s.id === pathname.split("/")[1])
  const globalService = service?.global ? service.title : undefined

  const regionLabel = globalService ? regionsData.globalLabel : (activeRegion?.full ?? selectedRegion)

  return (
    <header className="fixed top-0 left-0 right-0 h-[53px] bg-[#0f1620] border-t-[5px] border-[#7d8998] flex items-center z-40 text-white text-[13px] select-none">
      {/* Logo */}
      <a href="/console/home" className="flex items-center justify-center h-full px-3 hover:bg-[#37475a] transition-colors shrink-0">
        <img src="/icons/navbar.png" alt="AB" className="h-[22px] w-auto" />
      </a>

      <div className="w-[0.5px] h-8 bg-[#414d5c] mx-1.5 shrink-0 hidden md:block" />

      {/* AB Q */}
      <button
        onClick={() => { setMoreOpen(false); setAbQOpen(!abQOpen) }}
        aria-expanded={abQOpen}
        className="flex items-center justify-center h-full px-2.5 transition-colors shrink-0"
        title="AB Q"
      >
        <img src="/icons/ab-q.png" alt="" className="h-[24px] w-[24px]" />
      </button>

      <div className="w-[0.5px] h-8 bg-[#414d5c] mx-1.5 shrink-0 hidden md:block" />

      {/* Grid icon */}
      <div ref={servicesRef} className="relative h-full shrink-0">
      <button
        onClick={() => { setMoreOpen(false); setServicesOpen((o) => !o) }}
        aria-expanded={servicesOpen}
        title={servicesMenu.sections[2].label}
        className={`flex items-center justify-center h-full px-2.5 transition-colors ${servicesOpen ? "text-[#539fe5]" : "text-gray-300 hover:text-[#539fe5]"}`}
      >
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
      {servicesOpen && <ServicesMenu onClose={() => setServicesOpen(false)} />}
      </div>

      {/* Search */}
      <div className="flex-1 flex max-lg:justify-end px-1.5 lg:px-3 min-w-0">
        <SearchBar />
      </div>

      {/* Right side */}
      <div className="flex items-center h-full shrink-0">
        <div className="w-[0.5px] h-8 bg-[#414d5c] mx-1.5 lg:hidden" />

        {/* CloudShell */}
        <button
          onClick={() => { setMoreOpen(false); setCloudShellOpen(true) }}
          className="flex items-center justify-center h-full w-[38px] text-gray-300 hover:text-[#539fe5] transition-colors"
          title="CloudShell"
        >
          <TerminalIcon />
        </button>

        <div className="w-[0.5px] h-8 bg-[#414d5c] mx-1.5" />

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
            {!notificationsRead && recentNotificationCount > 0 && (
              <span className="absolute top-[7px] right-[6px] min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#d13212] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {recentNotificationCount}
              </span>
            )}
          </button>
          {notifOpen && <NotificationsDropdown />}
        </div>

        <div className="w-[0.5px] h-8 bg-[#414d5c] mx-1.5" />

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

        <div className="w-[0.5px] h-8 bg-[#414d5c] mx-1.5 hidden md:block" />

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
          {settingsOpen && <SettingsDropdown onNavigate={() => setSettingsOpen(false)} />}
        </div>

        <div className="w-[0.5px] h-8 bg-[#414d5c] mx-1.5 hidden md:block" />

        {/* Region dropdown */}
        <div ref={regionRef} className="relative h-full hidden md:block">
          <button
            onClick={() => setRegionOpen((o) => !o)}
            className={`flex items-center gap-1 h-full px-2 md:px-3 text-[13px] text-gray-200 hover:text-white transition-colors ${regionOpen ? "bg-[#37475a]" : "hover:bg-[#37475a]"}`}
          >
            <span className="hidden lg:inline">{regionLabel}</span>
            <span className="lg:hidden">{globalService ? regionsData.globalLabel : (activeRegion?.city ?? selectedRegion)}</span>
            <CaretDown />
          </button>
          {regionOpen && (
            <RegionDropdown
              selectedRegion={selectedRegion}
              onSelect={handleRegionChange}
              globalService={globalService}
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
              <span className="max-md:max-w-[72px] truncate">{site.account.name} ({site.account.id})</span>
              <ChevronDown />
            </span>
            <span className="hidden md:block text-[11px] text-white leading-none pt-1.5 pr-5">{site.account.name}</span>
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
            regions: <RegionDropdown selectedRegion={selectedRegion} onSelect={handleRegionChange} globalService={globalService} />,
            settings: <SettingsDropdown onNavigate={() => setMoreOpen(false)} />,
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
          <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl text-gray-900 dark:text-ink">
            <h2 className="text-base font-semibold mb-3">Install Console Mobile App</h2>
            <p className="text-sm text-gray-600 dark:text-ink-body mb-4">Install this portfolio as an app on your device:</p>
            <ol className="text-sm text-gray-600 dark:text-ink-body list-decimal list-inside space-y-2 mb-5">
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
    <Suspense fallback={<header className="fixed top-0 left-0 right-0 h-[53px] bg-[#0f1620] border-t-[5px] border-[#7d8998] z-40" />}>
      <TopbarInner />
    </Suspense>
  )
}
