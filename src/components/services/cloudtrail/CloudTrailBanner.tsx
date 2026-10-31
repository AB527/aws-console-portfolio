"use client"

import { useState } from "react"

export default function CloudTrailBanner({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  if (!open) return null

  return (
    <div className="flex items-start gap-3 px-5 py-3 mb-6 rounded-xl bg-[#006ce0] text-white">
      <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 11v6M12 7v.5" />
      </svg>
      <p className="flex-1">{children}</p>
      <button onClick={() => setOpen(false)} aria-label="Dismiss" className="shrink-0 mt-0.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
      </button>
    </div>
  )
}
