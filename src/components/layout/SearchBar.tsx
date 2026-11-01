"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import FavoriteStar from "@/components/ui/FavoriteStar"
import services from "@/data/services.json"
import { openSans } from "@/lib/awsFont"

function ResultIcon({ iconId, color, title }: { iconId: string; color: string; title: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span
        className="w-12 h-12 rounded-sm shrink-0 flex items-center justify-center text-white text-[18px] font-bold"
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
      className="w-12 h-12 rounded-sm shrink-0"
      onError={() => setFailed(true)}
    />
  )
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
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
      className="group relative flex-1 max-w-[520px] max-md:flex-none max-md:w-[38px] max-md:focus-within:fixed max-md:focus-within:left-2 max-md:focus-within:right-2 max-md:focus-within:top-[15px] max-md:focus-within:z-50 max-md:focus-within:w-auto max-md:focus-within:max-w-none"
    >
      {/* On phones this is a bare search icon until tapped, then it expands across the topbar */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`flex items-center bg-[#1b2433] border rounded-lg h-[32px] px-3 gap-2 transition-colors max-md:[.group:not(:focus-within)_&]:justify-center max-md:[.group:not(:focus-within)_&]:gap-0 max-md:[.group:not(:focus-within)_&]:px-0 max-md:[.group:not(:focus-within)_&]:bg-transparent max-md:[.group:not(:focus-within)_&]:border-transparent ${
          open ? "border-[#9bb4c8]" : "border-[#3a4757] hover:border-[#6a7a8c]"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" className="text-gray-400 shrink-0 max-md:[.group:not(:focus-within)_&]:w-[19px] max-md:[.group:not(:focus-within)_&]:h-[19px] max-md:[.group:not(:focus-within)_&]:text-gray-200">
          <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.75"/>
          <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
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
          className="bg-transparent text-[13px] text-white flex-1 min-w-0 focus:outline-none placeholder-gray-400 placeholder:italic max-md:[.group:not(:focus-within)_&]:w-0 max-md:[.group:not(:focus-within)_&]:flex-none"
        />
        <span className="text-[12px] text-gray-400 shrink-0 hidden sm:flex items-center gap-2">
          {focused ? (
            <span className="font-semibold text-gray-200">Ask AB Q</span>
          ) : (
            <>
              <span className="hidden sm:inline">[Option+S]</span>
              <span className="font-semibold text-gray-200">Q</span>
            </>
          )}
        </span>
      </div>

      {open && query.trim().length > 0 && (
        <div
          className={`${openSans.className} absolute top-[calc(100%+10px)] left-0 w-[74vw] max-md:fixed max-md:left-2 max-md:right-2 max-md:top-[56px] max-md:w-auto max-w-[1410px] max-h-[calc(100vh-120px)] bg-[#161d26] rounded-b-xl shadow-2xl z-[9999] flex overflow-hidden`}
        >
          {/* Left category sidebar */}
          <div className="w-[250px] shrink-0 py-6 pl-5 pr-4 hidden md:flex flex-col">
            <button className="text-left pl-4 py-1 text-[16px] leading-6 text-[#75b8ff] font-bold border-l-2 border-[#75b8ff]">
              Services
            </button>
            <div className="mt-auto pt-6">
              <p className="text-[20px] leading-7 font-bold text-white mb-4">Were these results helpful?</p>
              <div className="flex gap-2">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-2 h-8 px-5 rounded-full border-2 border-[#75b8ff] text-[14px] font-bold text-[#75b8ff] hover:bg-[#1b2b3d] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M2 10h4v12H2zM22 11a2 2 0 0 0-2-2h-6l1-5a2 2 0 0 0-2-2l-5 7v11h11a2 2 0 0 0 2-1.7l1-6.3z"/></svg>
                  Yes
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-2 h-8 px-5 rounded-full border-2 border-[#75b8ff] text-[14px] font-bold text-[#75b8ff] hover:bg-[#1b2b3d] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M22 14h-4V2h4zM2 13a2 2 0 0 1 2 2h6l-1 5a2 2 0 0 0 2 2l5-7V4H5a2 2 0 0 0-2 1.7l-1 6.3z"/></svg>
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
                  <h3 className="text-[20px] leading-6 font-bold text-white">Services</h3>
                  <button className="text-[16px] font-bold text-[#75b8ff] hover:underline">Show more</button>
                </div>
                <div className="flex flex-col gap-3">
                  {results.map((service) => (
                    <div
                      key={service.id}
                      className="group flex items-start gap-3 px-5 py-5 rounded-2xl border border-[#424650] hover:bg-[#1b2b3d] transition-colors"
                    >
                      <ResultIcon iconId={service.iconId} color={service.color} title={service.title} />
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => navigate(service.id)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className="text-[18px] leading-6 font-bold text-[#75b8ff] hover:underline truncate">
                          {service.title}
                        </p>
                        <p className="text-[16px] leading-6 text-[#dedee3] truncate">{service.description}</p>
                      </button>
                      <FavoriteStar serviceId={service.id} className="mt-0.5" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[16px] text-[#dedee3] px-1 py-4">No results for &ldquo;{query}&rdquo;</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
