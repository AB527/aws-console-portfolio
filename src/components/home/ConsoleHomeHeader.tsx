"use client"

import { useConsoleStore } from "@/store/useConsoleStore"

export default function ConsoleHomeHeader() {
  const resetLayout = useConsoleStore((s) => s.resetLayout)

  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-light text-gray-900 tracking-tight">Console home</h1>
        <span className="text-[13px] text-[#0073bb] hover:underline cursor-pointer font-medium leading-none">
          Info
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={resetLayout}
          className="text-[13px] text-[#0073bb] border-2 border-[#0073bb] rounded-full px-4 py-1.5 hover:bg-[#eaf4fb] transition-colors font-bold"
        >
          Reset to default layout
        </button>
        <button className="text-[13px] text-black bg-[#ff9900] hover:bg-[#e68900] rounded-full px-4 py-1.5 transition-colors font-bold flex items-center gap-1.5 shadow-sm">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add widgets
        </button>
      </div>
    </div>
  )
}
