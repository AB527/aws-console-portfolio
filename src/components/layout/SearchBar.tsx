"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import services from "@/data/services.json"

function ResultIcon({ iconId, color, title }: { iconId: string; color: string; title: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span
        className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-white text-[14px] font-bold"
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
      className="w-8 h-8 rounded shrink-0"
      onError={() => setFailed(true)}
    />
  )
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const visitService = useConsoleStore((s) => s.visitService)

  const results = query.trim().length > 0
    ? services.filter((s) =>
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
      if ((e.altKey || e.metaKey) && e.key === "s") {
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
    <div ref={ref} className="relative flex-1 max-w-[520px]">
      <div
        className={`flex items-center bg-[#1b2433] border rounded-md h-[32px] px-3 gap-2 transition-colors ${
          open ? "border-[#9bb4c8]" : "border-[#3a4757] hover:border-[#6a7a8c]"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" className="text-gray-400 shrink-0">
          <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.75"/>
          <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); setQuery("") }
            if (e.key === "Enter" && results.length > 0) navigate(results[0].id)
          }}
          className="bg-transparent text-[13px] text-white flex-1 focus:outline-none placeholder-gray-400 placeholder:italic"
        />
        <span className="text-[12px] text-gray-400 shrink-0 flex items-center gap-1.5">
          <span>[Option+S]</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="10.5" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      {open && query.trim().length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-[960px] max-w-[94vw] bg-[#0d1b2a] rounded-md shadow-2xl z-[9999] flex overflow-hidden">
          {/* Left category sidebar */}
          <div className="w-[148px] shrink-0 py-4 px-3 flex flex-col">
            <button className="text-left pl-2.5 py-1 text-[13px] text-[#539fe5] font-semibold border-l-2 border-[#539fe5]">
              Services
            </button>
            <div className="mt-auto pt-6">
              <p className="text-[12px] text-gray-400 mb-2">Were these results helpful?</p>
              <div className="flex gap-2">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#46586b] text-[12px] text-[#539fe5] hover:bg-[#16293c] transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M2 10h4v12H2zM22 11a2 2 0 0 0-2-2h-6l1-5a2 2 0 0 0-2-2l-5 7v11h11a2 2 0 0 0 2-1.7l1-6.3z"/></svg>
                  Yes
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#46586b] text-[12px] text-[#539fe5] hover:bg-[#16293c] transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22 14h-4V2h4zM2 13a2 2 0 0 1 2 2h6l-1 5a2 2 0 0 0 2 2l5-7V4H5a2 2 0 0 0-2 1.7l-1 6.3z"/></svg>
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Right results pane */}
          <div className="flex-1 min-w-0 max-h-[620px] overflow-y-auto py-4 pr-4 pl-6">
            {results.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[15px] font-semibold text-white">Services</h3>
                  <button className="text-[13px] text-[#539fe5] hover:underline">Show more</button>
                </div>
                <div className="flex flex-col gap-2">
                  {results.map((service) => (
                    <div
                      key={service.id}
                      className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-[#22323f] hover:bg-[#16293c] transition-colors"
                    >
                      <ResultIcon iconId={service.iconId} color={service.color} title={service.title} />
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => navigate(service.id)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className="text-[14px] font-semibold text-[#539fe5] leading-tight hover:underline truncate">
                          {service.title}
                        </p>
                        <p className="text-[12px] text-[#9aa7b4] truncate mt-0.5">{service.description}</p>
                      </button>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        className="shrink-0 text-[#8a98a6] hover:text-[#ffb400] transition-colors"
                        title="Add to favorites"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M12 2l3 6.5 7 .6-5.3 4.6 1.6 6.9L12 17.8 5.7 20.6l1.6-6.9L2 9.1l7-.6z" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[13px] text-gray-400 px-1 py-4">No results for &ldquo;{query}&rdquo;</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
