"use client"

import { useConsoleStore } from "@/store/useConsoleStore"

export default function SettingsDropdown() {
  const visualMode = useConsoleStore((s) => s.visualMode)
  const setVisualMode = useConsoleStore((s) => s.setVisualMode)

  return (
    <div className="absolute right-0 top-full mt-1 w-72 bg-[#1a2332] text-white rounded shadow-xl z-50 p-4 text-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Current user settings
      </p>

      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">Language</label>
        <select
          className="w-full bg-[#243447] border border-gray-600 text-white text-sm rounded px-2 py-1.5 cursor-default"
          value="en"
          onChange={() => {}}
        >
          <option value="en">English</option>
        </select>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">
          Visual mode <span className="text-[#ff9900] text-[10px] ml-1">beta</span>
        </p>
        <div className="flex flex-col gap-2">
          {(["browser-default", "light"] as const).map((mode) => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visual-mode"
                value={mode}
                checked={visualMode === mode}
                onChange={() => setVisualMode(mode)}
                className="accent-[#ff9900]"
              />
              <span className="text-sm capitalize">
                {mode === "browser-default" ? "Browser default" : "Light"}
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2 opacity-40 cursor-not-allowed">
            <input type="radio" disabled className="accent-[#ff9900]" />
            <span className="text-sm">Dark</span>
          </label>
        </div>
      </div>
    </div>
  )
}
