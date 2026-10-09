"use client"

import { useState, useRef, useEffect } from "react"
import { useConsoleStore } from "@/store/useConsoleStore"

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
      className="fixed left-0 right-0 bottom-[32px] bg-[#0d1117] text-gray-200 z-40 flex flex-col border-t border-[#30363d]"
      style={{ height }}
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-center h-[14px] cursor-ns-resize shrink-0 hover:bg-[#161b22] transition-colors"
        onMouseDown={onDragStart}
        title="Drag to resize"
      >
        <div className="flex flex-col gap-[3px]">
          <div className="w-7 h-[2px] bg-[#484f58] rounded-full" />
          <div className="w-7 h-[2px] bg-[#484f58] rounded-full" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 px-3 h-[38px] shrink-0 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-1.5 text-gray-300">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 15h5" strokeLinecap="round" />
          </svg>
          <span className="text-[13px] font-semibold">CloudShell</span>
        </div>

        <div className="flex items-center ml-3 border-b-2 border-[#ff9900]">
          <button className="px-3 py-0.5 text-[12px] text-white">{selectedRegion}</button>
        </div>
        <button className="text-gray-500 hover:text-white text-lg leading-none px-1">+</button>

        <div className="flex-1" />

        <button className="flex items-center gap-1 px-2.5 py-0.5 border border-[#4db8ff] text-[#4db8ff] rounded text-[12px] hover:bg-[#0d2137] transition-colors">
          Actions
          <svg width="8" height="5" viewBox="0 0 10 6" fill="currentColor">
            <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button className="p-1 text-gray-500 hover:text-white transition-colors" title="Open in new tab">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>

        <button className="p-1 text-gray-500 hover:text-white transition-colors" title="Settings">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        <button
          onClick={() => setCloudShellOpen(false)}
          className="p-1 text-gray-500 hover:text-white transition-colors"
          title="Close"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Terminal */}
      <div
        className="flex-1 overflow-y-auto p-3 font-mono text-[13px] cursor-text leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, i) => (
          <div key={i} className="mb-1">
            <div className="text-gray-300">
              <span className="text-green-400">~</span>{" "}
              <span className="text-gray-500">$</span> {item.cmd}
            </div>
            <div className="text-yellow-400/80">{item.output}</div>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="text-green-400">~</span>
          <span className="text-gray-500">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent outline-none text-gray-200 caret-white"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
