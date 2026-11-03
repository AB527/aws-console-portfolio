"use client"

import { GITHUB_REPO_URL as REPO_URL } from "@/lib/constants"

const ISSUES_URL = `${REPO_URL}/issues`
const DISCUSSIONS_URL = `${REPO_URL}/discussions`
const LINKEDIN_URL = "https://www.linkedin.com/in/atharva-bedekar"
const FEEDBACK_EMAIL = "atharvabedekar527@gmail.com"

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <path d="M14 4h6v6M20 4l-9 9M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function HelpDropdown() {
  return (
    <div className="absolute right-0 top-full w-[300px] max-md:static max-md:w-full max-md:rounded-none max-md:shadow-none max-md:border-0 max-md:bg-transparent bg-[#1a2332] text-white rounded-b-xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 pt-6 pb-4 border-b border-[#2d3f52]">
        <h3 className="text-[18px] font-semibold text-white">Support</h3>
        <ExternalLinkIcon />
      </div>

      <div className="px-6 py-4 border-b border-[#2d3f52] flex flex-col gap-3">
        <a
          href={DISCUSSIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-left text-[15px] text-gray-200 hover:text-white hover:underline"
        >
          Support Centre
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-left text-[15px] text-gray-200 hover:text-white hover:underline"
        >
          re:Post
        </a>
      </div>

      <div className="px-6 py-4 border-b border-[#2d3f52] flex flex-col gap-3">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-left text-[15px] text-gray-200 hover:text-white hover:underline"
        >
          Documentation
        </a>
        <a
          href={ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-left text-[15px] text-gray-200 hover:text-white hover:underline"
        >
          Issues
        </a>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-left text-[15px] text-gray-200 hover:text-white hover:underline"
        >
          Getting Started Resource Centre
        </a>
      </div>

      <div className="px-6 py-4">
        <a
          href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent("Feedback: AWS Console Portfolio")}`}
          className="text-left text-[15px] font-bold text-[#539fe5] hover:underline"
        >
          Send feedback
        </a>
      </div>
    </div>
  )
}
