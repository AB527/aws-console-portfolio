"use client"

import { useEffect } from "react"
import Link from "next/link"

interface WidgetInfo {
  description: string
  note?: string
  links: { label: string; href: string }[]
}

const WIDGET_INFO: Record<string, WidgetInfo> = {
  "recently-visited": {
    description:
      "Jump in where you left off and navigate to the services and projects you most recently worked with.",
    note: "To view all services, choose View all services at the bottom of the widget.",
    links: [
      { label: "Getting started with the Console", href: "/getting-started" },
    ],
  },
  "know-me": {
    description:
      "Get to know Atharva Bedekar — his background, values, and what drives his passion for engineering and technology.",
    links: [
      { label: "View IAM profile", href: "/iam/home" },
    ],
  },
  "system-status": {
    description:
      "Track Atharva's open-source activity on GitHub at a glance — public repositories, recent contributions, and followers.",
    links: [
      { label: "Visit GitHub profile", href: "https://github.com/AB527" },
      { label: "EC2 — Projects", href: "/ec2/home" },
    ],
  },
  "achievements": {
    description:
      "Explore certifications, milestones, and recognitions that mark key moments in Atharva's engineering journey.",
    links: [
      { label: "IAM — Skills & experience", href: "/iam/home" },
    ],
  },
  "solutions": {
    description:
      "Browse solutions and projects built across cloud infrastructure, full-stack development, and AI/ML domains.",
    links: [
      { label: "EC2 — Projects", href: "/ec2/home" },
      { label: "Getting started", href: "/getting-started" },
    ],
  },
  "announcements": {
    description:
      "Stay up to date with Atharva's latest milestones, recognitions, and project launches.",
    links: [
      { label: "View all projects", href: "/ec2/home" },
      { label: "IAM — Skills & experience", href: "/iam/home" },
    ],
  },
  "blog-posts": {
    description:
      "Read Atharva's recent write-ups and articles on DevOps, security, and cloud engineering.",
    links: [
      { label: "EC2 — Projects", href: "/ec2/home" },
      { label: "S3 — Documents", href: "/s3/home" },
    ],
  },
}

interface WidgetInfoPanelProps {
  widgetId: string
  title: string
  onClose: () => void
}

export default function WidgetInfoPanel({ widgetId, title, onClose }: WidgetInfoPanelProps) {
  const info = WIDGET_INFO[widgetId] ?? {
    description: `Information about the ${title} widget.`,
    links: [],
  }

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-[20px] flex flex-col"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
      >
        {/* Title row */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[18px] font-bold text-gray-900 leading-tight">{title}</span>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="mt-0.5 shrink-0">
              <path d="M2 2l6 5-6 5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none mt-0.5 shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <div className="px-5 pb-4 flex flex-col gap-2.5">
          <p className="text-[13.5px] text-gray-700 leading-relaxed">{info.description}</p>
          {info.note && (
            <p className="text-[13.5px] text-gray-700 leading-relaxed">
              To view all services, choose{" "}
              <Link href="/getting-started" className="font-bold text-gray-900 hover:underline" onClick={onClose}>
                View all services
              </Link>{" "}
              at the bottom of the widget.
            </p>
          )}
        </div>

        {/* Was this helpful */}
        <div className="px-5 pb-5">
          <p className="text-[14px] font-bold text-gray-900 mb-3">Was this content helpful?</p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border-2 border-[#0073bb] text-[#0073bb] rounded-full px-4 py-1.5 text-[13px] font-medium hover:bg-[#eaf4fb] transition-colors">
              <span>👍</span> Yes
            </button>
            <button className="flex items-center gap-2 border-2 border-[#0073bb] text-[#0073bb] rounded-full px-4 py-1.5 text-[13px] font-medium hover:bg-[#eaf4fb] transition-colors">
              <span>👎</span> No
            </button>
          </div>
        </div>

        <hr className="border-gray-200 mx-5" />

        {/* Learn more */}
        {info.links.length > 0 && (
          <div className="px-5 pt-4 pb-6">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[14px] font-bold text-gray-900">Learn more</span>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M7 1h4v4M11 1L6 6M2 3H1v8h8v-1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col gap-1.5">
              {info.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="text-[13.5px] text-[#0073bb] hover:underline leading-snug"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
