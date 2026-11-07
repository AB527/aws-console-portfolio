"use client"

import { useSyncExternalStore } from "react"
import site from "@data/site.json"
import ConsoleDialog, { DIALOG_PRIMARY } from "./ConsoleDialog"

type BrowserId = "chromium" | "safari" | "firefox"

const BROWSERS: { id: BrowserId; title: string; steps: string[] }[] = [
  {
    id: "chromium",
    title: "Chrome or Edge",
    steps: [
      "Select the install icon at the right end of the address bar.",
      "On Android, open the browser menu and choose Install app.",
      "Confirm with Install.",
    ],
  },
  {
    id: "safari",
    title: "Safari on iPhone, iPad or Mac",
    steps: [
      "Tap the Share button.",
      "Choose Add to Home Screen (on a Mac, Add to Dock).",
      "Confirm with Add.",
    ],
  },
  {
    id: "firefox",
    title: "Firefox on Android",
    steps: ["Open the browser menu.", "Choose Install.", "Confirm with Add."],
  },
]

// Which set of steps applies to the browser this page is open in; the server renders none
const noSubscribe = () => () => {}
function detectBrowser(): BrowserId | null {
  const ua = navigator.userAgent
  if (/Firefox|FxiOS/.test(ua)) return "firefox"
  if (/Edg|Chrome|CriOS|Chromium/.test(ua)) return "chromium"
  if (/Safari/.test(ua)) return "safari"
  return null
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" strokeLinecap="round" />
    </svg>
  )
}

export default function MobileAppDialog({ onClose }: { onClose: () => void }) {
  const current = useSyncExternalStore(noSubscribe, detectBrowser, () => null)

  return (
    <ConsoleDialog
      id="mobile-app-title"
      title="Console Mobile App"
      onClose={onClose}
      footer={
        <button onClick={onClose} className={DIALOG_PRIMARY}>
          Done
        </button>
      }
    >
      <div className="flex items-start gap-4 px-2.5 py-4 border-b border-[#43474f]">
        <span className="w-11 h-11 shrink-0 rounded-md bg-[#232f3e] text-[#ff9900] flex items-center justify-center">
          <PhoneIcon />
        </span>
        <p className="text-[14px] leading-5">
          Install {site.appTitle} on your phone, tablet or computer. It opens in its own window, straight from your home
          screen or dock, with no app store needed.
        </p>
      </div>

      {BROWSERS.map((browser) => (
        <div key={browser.id} className="px-2.5 py-4 border-b border-[#43474f] last:border-b-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[18px] leading-6">{browser.title}</h3>
            {current === browser.id && (
              <span className="px-2 rounded-full bg-[#539fe5] text-[#0f141a] text-[12px] leading-5 font-bold">
                This browser
              </span>
            )}
          </div>
          <ol className="list-decimal pl-5 space-y-1 text-[14px] leading-5 marker:text-[#a1a3a5]">
            {browser.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ))}
    </ConsoleDialog>
  )
}
