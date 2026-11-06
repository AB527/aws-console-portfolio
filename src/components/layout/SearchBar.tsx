"use client"

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import FavoriteStar from "@/components/ui/FavoriteStar"
import services from "@data/services.json"
import { openSans } from "@/lib/font"

function AbQIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M14.22 3.41L8.87 0.32C8.63 0.18 8.32 0.11 8 0.11C7.68 0.11 7.37 0.18 7.13 0.32L1.78 3.41C1.3 3.68 0.91 4.36 0.91 4.91V11.09C0.91 11.64 1.3 12.31 1.78 12.59L7.14 15.68C7.38 15.82 7.69 15.89 8.01 15.89C8.33 15.89 8.64 15.82 8.88 15.68L14.24 12.59C14.72 12.31 15.11 11.64 15.11 11.09V4.91C15.11 4.36 14.72 3.68 14.24 3.41H14.22ZM8 13.88L2.91 10.94V5.06L8 2.12L13.09 5.06V9.78L10 8V7.26C10 7 9.86 6.77 9.64 6.64L8.36 5.9C8.25 5.84 8.12 5.8 8 5.8C7.88 5.8 7.75 5.83 7.64 5.9L6.36 6.64C6.14 6.77 6 7.01 6 7.26V8.74C6 9 6.14 9.23 6.36 9.36L7.64 10.1C7.75 10.16 7.88 10.2 8 10.2C8.12 10.2 8.25 10.17 8.36 10.1L9 9.73L12.09 11.51L8 13.87V13.88Z" />
    </svg>
  )
}

// Macs label the key Option, everything else Alt; the server renders Alt
const noSubscribe = () => () => {}
function useShortcutKey() {
  return useSyncExternalStore(
    noSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "Option" : "Alt"),
    () => "Alt"
  )
}

function ResultIcon({ iconId, color, title }: { iconId: string; color: string; title: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span
        className="w-10 h-10 rounded-sm shrink-0 flex items-center justify-center text-white text-[16px] font-bold"
        style={{ background: color }}
      >
        {title.charAt(0)}
      </span>
    )
  }
  return (
    <img
      src={`/icons/${iconId}.png`}
      alt=""
      className="w-10 h-10 rounded-sm shrink-0"
      onError={() => setFailed(true)}
    />
  )
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const shortcutKey = useShortcutKey()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const visitService = useConsoleStore((s) => s.visitService)
  const hiddenServices = useConsoleStore((s) => s.hiddenServices)

  const results = query.trim().length > 0
    ? services.filter((s) => !hiddenServices.includes(s.id)).filter((s) =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.id.toLowerCase().includes(query.toLowerCase())
      )
    : []

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isSKey = e.code === "KeyS" || e.key === "s" || e.key === "S" || e.key === "ß"
      if ((e.altKey || e.metaKey) && isSKey) {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const navigate = useCallback(
    (serviceId: string) => {
      visitService(serviceId)
      router.push(`/${serviceId}/home`)
      setQuery("")
      setOpen(false)
    },
    [router, visitService]
  )

  return (
    <div
      ref={ref}
      className="group relative flex-1 min-w-0 max-w-[520px] max-lg:flex-none max-lg:w-[38px] max-lg:focus-within:fixed max-lg:focus-within:left-2 max-lg:focus-within:right-2 max-lg:focus-within:top-[13px] max-lg:focus-within:z-50 max-lg:focus-within:w-auto max-lg:focus-within:max-w-none"
    >
      {/* On phones this is a bare search icon until tapped, then it expands across the topbar */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`flex items-center bg-transparent max-lg:group-focus-within:bg-[#0f1620] border rounded-lg h-[32px] px-3 gap-2 transition-colors max-lg:[.group:not(:focus-within)_&]:justify-center max-lg:[.group:not(:focus-within)_&]:gap-0 max-lg:[.group:not(:focus-within)_&]:px-0 max-lg:[.group:not(:focus-within)_&]:bg-transparent max-lg:[.group:not(:focus-within)_&]:border-transparent ${
          open ? "border-[#9bb4c8]" : "border-[#b4b4bb] hover:border-[#dedee3]"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" className="text-[#a4a4ad] shrink-0 max-lg:[.group:not(:focus-within)_&]:w-[19px] max-lg:[.group:not(:focus-within)_&]:h-[19px] max-lg:[.group:not(:focus-within)_&]:text-gray-200">
          <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="2.6"/>
          <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { setOpen(true); setFocused(true) }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); setQuery("") }
            if (e.key === "Enter" && results.length > 0) navigate(results[0].id)
          }}
          className="bg-transparent text-[13px] text-white flex-1 w-0 min-w-0 focus:outline-none placeholder:text-[#a4a4ad] placeholder:italic max-lg:[.group:not(:focus-within)_&]:w-0 max-lg:[.group:not(:focus-within)_&]:flex-none"
        />
        <span className="text-[12px] text-gray-400 shrink-0 hidden lg:flex max-lg:group-focus-within:flex items-center gap-2">
          <span className="hidden sm:inline">[{shortcutKey}+S]</span>
          {/* "Ask AB Q" slides open beside the icon on hover and while typing, pushing the hint left */}
          <span className="flex items-center font-bold text-gray-200" title="AB Q">
            <AbQIcon />
            <span
              className={`grid transition-[grid-template-columns] duration-200 ease-out ${
                focused ? "grid-cols-[1fr]" : "grid-cols-[0fr] group-hover:grid-cols-[1fr]"
              }`}
            >
              <span className="overflow-hidden whitespace-nowrap pl-1.5">Ask AB Q</span>
            </span>
          </span>
        </span>
      </div>

      {open && query.trim().length > 0 && (
        <div
          className={`${openSans.className} absolute top-[calc(100%+10px)] left-0 w-[74vw] max-lg:fixed max-lg:left-2 max-lg:right-2 max-lg:top-[53px] max-lg:w-auto max-w-[1410px] max-h-[calc(100vh-120px)] bg-[#161d26] rounded-b-xl shadow-2xl z-[9999] flex overflow-hidden`}
        >
          {/* Left category sidebar */}
          <div className="w-[250px] shrink-0 py-6 pl-5 pr-4 hidden md:flex flex-col">
            <button className="text-left pl-4 py-1 text-[15px] leading-6 text-[#75b8ff] font-bold border-l-2 border-[#75b8ff]">
              Services
            </button>
            <div className="mt-auto pt-6">
              <p className="text-[18px] leading-7 font-bold text-white mb-3">Were these results helpful?</p>
              <div className="flex gap-2">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-2 h-8 px-4 rounded-full border-2 border-[#75b8ff] text-[13px] font-bold text-[#75b8ff] hover:bg-[#1b2b3d] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M2 10h4v12H2zM22 11a2 2 0 0 0-2-2h-6l1-5a2 2 0 0 0-2-2l-5 7v11h11a2 2 0 0 0 2-1.7l1-6.3z"/></svg>
                  Yes
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-2 h-8 px-4 rounded-full border-2 border-[#75b8ff] text-[13px] font-bold text-[#75b8ff] hover:bg-[#1b2b3d] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M22 14h-4V2h4zM2 13a2 2 0 0 1 2 2h6l-1 5a2 2 0 0 0 2 2l5-7V4H5a2 2 0 0 0-2 1.7l-1 6.3z"/></svg>
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Right results pane */}
          <div className="flex-1 min-w-0 overflow-y-auto py-6 pr-5 pl-5">
            {results.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[18px] leading-6 font-bold text-white">Services</h3>
                  <button className="text-[15px] font-bold text-[#75b8ff] hover:underline">Show more</button>
                </div>
                <div className="flex flex-col gap-2">
                  {results.map((service) => (
                    <div
                      key={service.id}
                      className="group flex items-start gap-3 px-4 py-3 rounded-xl border border-[#424650] hover:border-[#75b8ff] transition-colors"
                    >
                      <ResultIcon iconId={service.iconId} color={service.color} title={service.title} />
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => navigate(service.id)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className="text-[16px] leading-6 font-bold text-[#75b8ff] hover:underline truncate">
                          {service.title}
                        </p>
                        <p className="text-[14px] leading-5 text-[#dedee3] truncate">{service.description}</p>
                      </button>
                      <FavoriteStar serviceId={service.id} className="mt-0.5" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[15px] text-[#dedee3] px-1 py-4">No results for &ldquo;{query}&rdquo;</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
