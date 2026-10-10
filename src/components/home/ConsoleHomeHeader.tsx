"use client"

import { useConsoleStore } from "@/store/useConsoleStore"

export default function ConsoleHomeHeader() {
  const resetLayout = useConsoleStore((s) => s.resetLayout)
  const addWidgetsOpen = useConsoleStore((s) => s.addWidgetsOpen)
  const setAddWidgetsOpen = useConsoleStore((s) => s.setAddWidgetsOpen)

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap px-4 lg:px-6 pt-4 pb-4">
      <div className="flex items-baseline gap-2">
        <h1 className="text-[24px] leading-[30px] font-bold text-[#0f141a]">Console home</h1>
        <span className="text-[12px] font-bold text-[#006ce0] hover:underline cursor-pointer">Info</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={resetLayout}
          className="h-8 px-5 rounded-full border-2 border-[#006ce0] text-[14px] font-bold text-[#006ce0] hover:bg-[#f0fbff] transition-colors whitespace-nowrap"
        >
          Reset to default layout
        </button>
        <button
          onClick={() => setAddWidgetsOpen(!addWidgetsOpen)}
          aria-expanded={addWidgetsOpen}
          className="h-8 px-5 flex items-center gap-2 rounded-full bg-[#ff9900] hover:bg-[#fa6f00] text-[14px] font-bold text-[#0f141a] transition-colors whitespace-nowrap"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" />
          </svg>
          Add widgets
        </button>
      </div>
    </div>
  )
}
