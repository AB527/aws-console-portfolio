"use client"

import { useState } from "react"
import { LICENSE_URL } from "@/lib/constants"
import ConsoleDialog, { DIALOG_PRIMARY, DIALOG_SECONDARY } from "./ConsoleDialog"

interface CookiePreferencesDialogProps {
  onClose: () => void
}

const CATEGORIES = [
  {
    id: "essential",
    title: "Essential",
    description:
      "Essential cookies are necessary to provide our site and services and cannot be deactivated. They are usually set in response to your actions on the site, such as setting your privacy preferences, signing in, or filling in forms.",
    required: true,
  },
  {
    id: "performance",
    title: "Performance",
    description:
      "Performance cookies provide anonymous statistics about how customers navigate our site so we can improve site experience and performance. Approved third parties may perform analytics on our behalf, but they cannot use the data for their own purposes.",
    required: false,
  },
  {
    id: "functional",
    title: "Functional",
    description:
      "Functional cookies help us provide useful site features, remember your preferences, and display relevant content. Approved third parties may set these cookies to provide certain site features. If you do not allow these cookies, then some or all of these services may not function properly.",
    required: false,
  },
  {
    id: "advertising",
    title: "Advertising",
    description:
      "Advertising cookies may be set through our site by us or our advertising partners and help us deliver relevant marketing content. If you do not allow these cookies, you will experience less relevant advertising.",
    required: false,
  },
]

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="inline ml-1 -mt-0.5">
      <path d="M10 2h4v4M14 2 7 9M12 9.5V14H2V4h4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CookiePreferencesDialog({ onClose }: CookiePreferencesDialogProps) {
  const [allowed, setAllowed] = useState<Record<string, boolean>>({
    essential: true,
    performance: true,
    functional: true,
    advertising: true,
  })

  function toggle(id: string) {
    if (id === "essential") return
    setAllowed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <ConsoleDialog
      id="cookie-preferences-title"
      title="Customize cookie preferences"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={DIALOG_SECONDARY}>
            Cancel
          </button>
          <button onClick={onClose} className={DIALOG_PRIMARY}>
            Save preferences
          </button>
        </>
      }
    >
      {CATEGORIES.map((cat) => (
        <div key={cat.id} className="flex items-center gap-10 px-2.5 py-4 border-b border-[#43474f] max-md:flex-col max-md:items-start max-md:gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[18px] leading-6 mb-2">{cat.title}</h3>
            <p className="text-[14px] leading-5">{cat.description}</p>
          </div>
          <label className={`flex items-center gap-2 shrink-0 w-[90px] text-[14px] ${cat.required ? "cursor-default" : "cursor-pointer"}`}>
            <input
              type="checkbox"
              checked={allowed[cat.id]}
              onChange={() => toggle(cat.id)}
              disabled={cat.required}
              className="w-3.5 h-3.5 accent-[#539fe5] cursor-pointer disabled:cursor-default"
            />
            Allowed
          </label>
        </div>
      ))}

      <p className="px-2.5 pt-5 text-[12px] leading-[21px]">
        Blocking some types of cookies may impact your experience of our sites. You may review and change your choices
        at any time by selecting Cookie preferences in the footer of this site. How this site and its code may be used
        is set out in the{" "}
        <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-[#44b9d6] underline hover:text-[#7fd1e6]">
          License
          <ExternalIcon />
        </a>
        .
      </p>
    </ConsoleDialog>
  )
}
