"use client"

import { useState, useRef, useEffect } from "react"
import { useConsoleStore } from "@/store/useConsoleStore"
import { openSans } from "@/lib/awsFont"

export default function CloudShellPanel() {
  const setCloudShellOpen = useConsoleStore((s) => s.setCloudShellOpen)
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Array<{ cmd: string; output: string }>>([])
  const [height, setHeight] = useState(300)
  const dragState = useRef<{ startY: number; startH: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return
    const cmd = input.trim()
    if (!cmd) return
    setHistory((h) => [
      ...h,
      { cmd, output: `bash: ${cmd}: command not found  (Coming soon)` },
    ])
    setInput("")
  }

  function onDragStart(e: React.MouseEvent) {
    dragState.current = { startY: e.clientY, startH: height }
    function onMove(ev: MouseEvent) {
      if (!dragState.current) return
      const delta = dragState.current.startY - ev.clientY
      setHeight(Math.max(160, Math.min(640, dragState.current.startH + delta)))
    }
    function onUp() {
      dragState.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  return (
    <div
      className={`${openSans.className} fixed left-0 right-0 bottom-[32px] max-h-[70vh] bg-[#161d26] text-[#dedee3] z-40 flex flex-col`}
      style={{ height }}
    >
      {/* Grip bar: drag to resize, close on the right */}
      <div className="relative flex items-center justify-center h-[30px] shrink-0 bg-[#1b232d]">
        <div
          className="flex items-center justify-center w-16 h-full cursor-ns-resize"
          onMouseDown={onDragStart}
          title="Drag to resize"
        >
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M1 1.5h14M1 6.5h14" />
          </svg>
        </div>
        <button
          onClick={() => setCloudShellOpen(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#dedee3] hover:text-white transition-colors"
          title="Close"
          aria-label="Close CloudShell"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-1 pb-2 shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-white shrink-0" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 15h3" strokeLinecap="round" />
        </svg>
        <span className="text-[18px] leading-6 font-bold text-white">CloudShell</span>

        <div className="flex-1" />

        <button className="flex items-center gap-2.5 h-8 px-5 border-2 border-[#42b4ff] text-[#42b4ff] rounded-full text-[14px] font-bold hover:bg-[#1b2b3d] transition-colors">
          Actions
          <svg width="10" height="7" viewBox="0 0 10 7" fill="currentColor" aria-hidden="true">
            <path d="M0 0h10L5 7z" />
          </svg>
        </button>

        <button className="p-2 text-[#dedee3] hover:text-white transition-colors" title="Open in new tab">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <path d="M15 3h6v6M10 14 21 3" />
          </svg>
        </button>

        <button className="p-2 text-[#dedee3] hover:text-white transition-colors" title="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Region tabs */}
      <div className="flex items-end mx-5 shrink-0 border-b border-[#424650]">
        <button className="relative px-4 pt-2 pb-3 text-[14px] font-bold text-[#42b4ff]">
          {selectedRegion}
          <span className="absolute left-0 right-0 -bottom-px h-[3px] rounded-t bg-[#42b4ff]" />
        </button>
        <span className="self-center w-px h-6 bg-[#424650]" />
        <button className="px-4 pb-2 text-[#42b4ff] text-[22px] leading-none hover:text-white transition-colors" title="New tab" aria-label="New tab">
          +
        </button>
      </div>

      {/* Terminal */}
      <div
        className="flex-1 overflow-y-auto px-6 py-3 font-mono text-[13px] cursor-text leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, i) => (
          <div key={i} className="mb-1">
            <div>~ $ {item.cmd}</div>
            <div className="text-yellow-400/80">{item.output}</div>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span>~ $</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            aria-label="Terminal input"
            className="flex-1 bg-transparent outline-none text-[#dedee3] caret-white"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
