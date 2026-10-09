"use client"

import { useState, useRef, useEffect } from "react"
import { useConsoleStore } from "@/store/useConsoleStore"
import { openSans } from "@/lib/awsFont"

const MAX_CHARS = 10000

const SUGGESTIONS = [
  {
    title: "Which projects are running right now?",
    description: "List the projects on the Projects page and their current status.",
  },
  {
    title: "What skills does this account have?",
    description: "Summarise the skill groups and experience levels.",
  },
]

const ICON_BUTTON_CLASS = "w-8 h-8 flex items-center justify-center rounded-full text-[#424650] hover:text-[#006ce0] transition-colors"

function HeaderIcon({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <button title={title} aria-label={title} className={ICON_BUTTON_CLASS}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}

function QOutlineLogo() {
  return (
    <svg width="60" height="60" viewBox="4 4 16 16" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="q-outline-gradient" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0099FF" />
          <stop offset="0.5" stopColor="#5C7FFF" />
          <stop offset="1" stopColor="#962EFF" />
        </linearGradient>
      </defs>
      <path
        fill="url(#q-outline-gradient)"
        d="M18.2199 7.40941L12.8699 4.31846C12.6299 4.17842 12.3199 4.1084 11.9999 4.1084C11.6799 4.1084 11.3699 4.17842 11.1299 4.31846L5.77991 7.40941C5.29991 7.67949 4.90991 8.3597 4.90991 8.90986V15.0917C4.90991 15.6419 5.29991 16.3121 5.77991 16.5922L11.1399 19.6832C11.3799 19.8232 11.6899 19.8932 12.0099 19.8932C12.3299 19.8932 12.6399 19.8232 12.8799 19.6832L18.2399 16.5922C18.7199 16.3121 19.1099 15.6419 19.1099 15.0917V8.90986C19.1099 8.3597 18.7199 7.67949 18.2399 7.40941H18.2199ZM11.9999 17.8826L6.90991 14.9417V9.05991L11.9999 6.11901L17.0899 9.05991V13.7813L13.9999 12.0008V11.2606C13.9999 11.0005 13.8599 10.7704 13.6399 10.6404L12.3599 9.90017C12.2499 9.84015 12.1199 9.80013 11.9999 9.80013C11.8799 9.80013 11.7499 9.83014 11.6399 9.90017L10.3599 10.6404C10.1399 10.7704 9.99991 11.0105 9.99991 11.2606V12.741C9.99991 13.0011 10.1399 13.2312 10.3599 13.3612L11.6399 14.1014C11.7499 14.1615 11.8799 14.2015 11.9999 14.2015C12.1199 14.2015 12.2499 14.1715 12.3599 14.1014L12.9999 13.7313L16.0899 15.5119L11.9999 17.8726V17.8826Z"
      />
    </svg>
  )
}

export default function AmazonQPanel() {
  const setAmazonQOpen = useConsoleStore((s) => s.setAmazonQOpen)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Array<{ prompt: string; reply: string }>>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  function ask(prompt: string) {
    const text = prompt.trim()
    if (!text) return
    setHistory((h) => [...h, { prompt: text, reply: "Amazon Q is not available yet. (Coming soon)" }])
    setInput("")
  }

  return (
    <aside
      aria-label="Amazon Q"
      className={`${openSans.className} fixed left-0 top-[56px] bottom-[32px] w-full md:w-[420px] z-30 bg-white md:border-r-[12px] md:border-[#0f1620] flex flex-col text-[14px] leading-5 text-[#0f141a]`}
    >
      {/* Divider grip between the panel and the page */}
      <span aria-hidden="true" className="hidden md:block absolute top-1/2 -right-[8px] -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#c6c6cd]" />
      {/* Header */}
      <div className="flex items-center gap-1 pl-5 pr-3 h-[52px] shrink-0">
        <h2 className="text-[16px] font-bold mr-auto">Amazon Q</h2>
        <button title="New chat" aria-label="New chat" onClick={() => setHistory([])} className={ICON_BUTTON_CLASS}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <HeaderIcon title="Prompt library">
          <path d="M12 6c-2-1.3-4.5-2-8-2v14c3.500 0 6 .7 8 2 2-1.300 4.500-2 8-2V4c-3.500 0-6 .7-8 2zM12 6v14" />
        </HeaderIcon>
        <HeaderIcon title="Chat history">
          <path d="M3 12a9 9 0 1 0 3-6.700L3 8M3 3v5h5M12 8v4l3 2" />
        </HeaderIcon>
        <HeaderIcon title="Settings">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900l2.100 2.100M17 17l2.100 2.100M4.900 19.100 7 17M17 7l2.100-2.100" />
        </HeaderIcon>
        <span className="w-px h-6 bg-[#c6c6cd] mx-1 hidden md:block" />
        <span className="hidden md:block">
          <HeaderIcon title="Expand">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </HeaderIcon>
        </span>
        <button title="Close" aria-label="Close Amazon Q" onClick={() => setAmazonQOpen(false)} className={ICON_BUTTON_CLASS}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
      <div className="h-[2px] shrink-0 bg-gradient-to-r from-[#962eff] via-[#5c7fff] to-[#b8e7ff]" />

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {history.length === 0 ? (
          <div className="flex flex-col items-center pt-14 pb-12">
            <QOutlineLogo />
            <p className="mt-7 text-[24px] leading-[30px] font-bold text-center">How can I help you today?</p>
          </div>
        ) : (
          <div className="py-5 space-y-4">
            {history.map((item, i) => (
              <div key={i} className="space-y-2">
                <p className="ml-auto w-fit max-w-[85%] rounded-xl bg-[#f0fbff] border border-[#b8e7ff] px-3 py-2 break-words">{item.prompt}</p>
                <p className="w-fit max-w-[85%] rounded-xl bg-[#f6f6f9] border border-[#dedee3] px-3 py-2 text-[#424650]">{item.reply}</p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Prompt box */}
        <div className="relative border border-[#8c8c94] rounded-lg focus-within:border-[#006ce0]">
          <textarea
            value={input}
            maxLength={MAX_CHARS}
            rows={4}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                ask(input)
              }
            }}
            placeholder="Describe what you want to do, such as 'List all projects'."
            className="block w-full resize-none bg-transparent px-3 pt-3 pb-9 outline-none placeholder:italic placeholder:text-[#656871]"
          />
          <button
            onClick={() => ask(input)}
            disabled={!input.trim()}
            title="Send"
            aria-label="Send"
            className="absolute right-2 bottom-2 p-1 text-[#006ce0] disabled:text-[#8c8c94]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4l17 8-17 8 4-8-4-8zM8 12h13" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-[12px] text-[#656871]">Max {MAX_CHARS} characters</p>

        {/* Suggestions */}
        {history.length === 0 && (
          <div className="mt-10 space-y-4">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.title}
                onClick={() => ask(s.title)}
                className="block w-full text-left border border-[#c6c6cd] rounded-2xl px-5 py-4 hover:border-[#006ce0] transition-colors"
              >
                <span className="block text-[16px] font-bold">{s.title}</span>
                <span className="block mt-1 text-[#424650]">{s.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-[#dedee3] px-5 py-3 text-[#424650]">
        Help us improve Amazon Q by <span className="text-[#006ce0] hover:underline cursor-pointer">providing feedback</span>.
      </div>
    </aside>
  )
}
