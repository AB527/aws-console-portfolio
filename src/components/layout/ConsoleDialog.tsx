"use client"

import { useEffect } from "react"

// Dark modal used by the footer dialogs. It keeps the same dark colours in light and dark mode,
// like the rest of the console chrome.
export const DIALOG_BUTTON = "h-8 px-5 rounded-sm text-[14px] font-bold transition-colors"
export const DIALOG_PRIMARY = `${DIALOG_BUTTON} bg-[#ec9c33] hover:bg-[#f5ae4f] text-[#0f141a]`
export const DIALOG_SECONDARY = `${DIALOG_BUTTON} border border-[#e9ebed] text-[#e9ebed] hover:bg-[#3a3e44]`

interface ConsoleDialogProps {
  id: string
  title: string
  onClose: () => void
  footer: React.ReactNode
  children: React.ReactNode
}

export default function ConsoleDialog({ id, title, onClose, footer, children }: ConsoleDialogProps) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className="[color-scheme:dark] bg-[#2b2e33] text-[#e9ebed] w-full max-w-[820px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="bg-[#22252b] px-5 py-4 border-b border-[#43474f] shrink-0">
          <h2 id={id} className="text-[18px] leading-6 font-bold">
            {title}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5">{children}</div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#43474f] shrink-0">{footer}</div>
      </div>
    </div>
  )
}
