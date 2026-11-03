"use client"

import { useEffect } from "react"
import Link from "next/link"
import help from "@data/help.json"
import dashboardLayout from "@data/dashboard-layout.json"
import { openSans } from "@/lib/awsFont"
import { serviceTitle } from "@/lib/serviceTitle"
import { useConsoleStore } from "@/store/useConsoleStore"

interface HelpBlock {
  text?: string
  heading?: string
}

interface HelpLink {
  // Defaults to the title of `service`
  label?: string
  service?: string
  href: string
}

interface HelpTopic {
  // Defaults to the widget's title
  title?: string
  body: HelpBlock[]
  links?: HelpLink[]
}

const TOPICS: Record<string, HelpTopic | undefined> = help.topics
const PILL =
  "h-8 px-5 flex items-center gap-2 rounded-full border-2 border-link text-[14px] font-bold text-link hover:bg-surface-selected transition-colors"
const LINK = "text-link hover:underline"

function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`inline-block shrink-0 ${className}`} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 2h5v5M14 2 7.5 8.5M12 9.5V14H2V4h4.5" strokeLinejoin="round" />
    </svg>
  )
}

function ThumbIcon({ down = false }: { down?: boolean }) {
  return (
    <svg className={down ? "rotate-180" : ""} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 10v11H3V10h4zM7 10l4-8a2.5 2.5 0 0 1 2.5 2.5V9H20a2 2 0 0 1 2 2.3l-1.3 8A2 2 0 0 1 18.7 21H7" />
    </svg>
  )
}

function isExternal(href: string) {
  return href.startsWith("http")
}

function HelpAnchor({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

// Help copy may mark **bold terms** and [links](href)
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**")) {
          return (
            <strong key={i} className="font-bold text-ink">
              {part.slice(2, -2)}
            </strong>
          )
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          return (
            <HelpAnchor key={i} href={link[2]} className={`${LINK} underline underline-offset-4`}>
              {link[1]}
              {isExternal(link[2]) && <ExternalIcon className="ml-1 -mt-0.5" />}
            </HelpAnchor>
          )
        }
        return part
      })}
    </>
  )
}

// Right-hand help panel. It shows the topic held in the store: "console-home" or a widget id.
export default function HelpPanel() {
  const topicId = useConsoleStore((s) => s.helpTopic)
  const setHelpTopic = useConsoleStore((s) => s.setHelpTopic)

  useEffect(() => {
    if (!topicId) return
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setHelpTopic(null)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [topicId, setHelpTopic])

  if (!topicId) return null

  const topic = TOPICS[topicId]
  const title = topic?.title ?? dashboardLayout.widgets.find((w) => w.id === topicId)?.title ?? topicId
  const links = topic?.links ?? []

  return (
    <aside
      aria-label={title}
      className={`${openSans.className} w-[290px] shrink-0 bg-surface border-l border-line text-[14px] leading-5 text-ink-body overflow-y-auto sticky top-[56px] h-[calc(100vh-88px)] max-lg:fixed max-lg:inset-x-0 max-lg:top-[56px] max-lg:bottom-[32px] max-lg:z-40 max-lg:w-auto max-lg:h-auto`}
    >
      <div className="flex items-start justify-between gap-3 px-7 pt-5 pb-4">
        <h2 className="text-[20px] leading-6 font-bold text-ink">{title}</h2>
        <button
          onClick={() => setHelpTopic(null)}
          aria-label={help.labels.close}
          title={help.labels.close}
          className="mt-0.5 shrink-0 text-ink-body hover:text-ink transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="px-7 pb-2 space-y-4">
        {(topic?.body ?? []).map((block, i) =>
          block.heading ? (
            <h3 key={i} className="pt-3 text-[18px] leading-[22px] font-bold text-ink">
              {block.heading}
            </h3>
          ) : (
            <p key={i}>
              <RichText text={block.text ?? ""} />
            </p>
          )
        )}
      </div>

      <div className="px-7 pt-3 pb-5">
        <h4 className="text-[16px] leading-5 font-bold text-ink mb-3">{help.labels.helpful}</h4>
        <div className="flex gap-2">
          <a href={help.feedback.yesUrl} target="_blank" rel="noopener noreferrer" className={PILL}>
            <ThumbIcon />
            {help.labels.yes}
          </a>
          <a href={help.feedback.noUrl} target="_blank" rel="noopener noreferrer" className={PILL}>
            <ThumbIcon down />
            {help.labels.no}
          </a>
        </div>
      </div>

      {links.length > 0 && (
        <div className="mx-5 px-2 pt-5 pb-8 border-t border-line">
          <h3 className="flex items-center gap-2 text-[18px] leading-[22px] font-bold text-ink mb-3">
            {help.labels.learnMore}
            <ExternalIcon />
          </h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <HelpAnchor href={link.href} className={LINK}>
                  {link.label ?? serviceTitle(link.service ?? "")}
                </HelpAnchor>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
