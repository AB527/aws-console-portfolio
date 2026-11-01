"use client"

import { useConsoleStore } from "@/store/useConsoleStore"

function FlaskIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
      <path d="M9 3h6M10 3v5.5L5.2 18.3A1.2 1.2 0 0 0 6.3 20h11.4a1.2 1.2 0 0 0 1.1-1.7L14 8.5V3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 14h9" strokeLinecap="round" />
    </svg>
  )
}

export default function SettingsDropdown() {
  const visualMode = useConsoleStore((s) => s.visualMode)
  const setVisualMode = useConsoleStore((s) => s.setVisualMode)

  return (
    <div className="absolute right-0 top-full w-[340px] max-md:static max-md:w-full max-md:rounded-none max-md:shadow-none max-md:border-0 max-md:bg-transparent bg-[#1a2332] text-white rounded-b-xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[#2d3f52]">
        <h2 className="text-[17px] font-bold text-white leading-tight">Current user settings</h2>
      </div>

      <div className="px-5 py-4">
        {/* Language */}
        <div className="mb-5">
          <label className="block text-[13px] font-bold text-white mb-2">Language</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-transparent border border-[#5a6b7b] text-[13px] text-gray-300 rounded-lg pl-3 pr-10 py-2 cursor-default focus:outline-none"
              value="browser"
              onChange={() => {}}
            >
              <option value="browser">Browser default</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="#539fe5">
              <path d="M2 4.5l5 5.5 5-5.5z" />
            </svg>
          </div>
        </div>

        {/* Visual mode */}
        <div>
          <p className="text-[13px] font-bold text-white mb-2.5">
            Visual mode <span className="italic">- beta</span>
          </p>
          <div className="flex flex-col gap-2.5">
            {([
              { id: "browser-default", label: "Browser default" },
              { id: "light", label: "Light" },
              { id: "dark", label: "Dark" },
            ] as const).map((mode) => {
              const selectable = mode.id === "browser-default" || mode.id === "light"
              return (
                <label key={mode.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="visual-mode"
                    checked={selectable && visualMode === mode.id}
                    onChange={() => {
                      if (selectable) setVisualMode(mode.id as "browser-default" | "light")
                    }}
                    className="appearance-none w-[18px] h-[18px] rounded-full border border-white checked:border-[5px] checked:border-[#539fe5] p-[2px] bg-clip-content checked:bg-black cursor-pointer shrink-0"
                  />
                  <span className="text-[13px] text-white">{mode.label}</span>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="px-5 py-4 border-t border-[#2d3f52] flex flex-col gap-3">
        <button className="text-[13px] font-bold text-[#539fe5] text-left hover:underline">
          See all user settings
        </button>
        <button className="text-[13px] font-bold text-[#539fe5] text-left hover:underline flex items-center gap-2">
          AWS experimental preview
          <FlaskIcon />
        </button>
      </div>
    </div>
  )
}
