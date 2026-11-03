"use client"

import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import { formatDateBadge } from "@/lib/formatDate"

interface NewsListWidgetProps {
  source: "announcements" | "blog-posts"
  // What the loader calls the list, e.g. "announcements"
  label: string
}

function ExternalIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      className="inline-block ml-1 -mb-px shrink-0"
    >
      <path
        d="M4.5 2H10v5.5M10 2L5 7M2 4v6h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function NewsListWidget({ source, label }: NewsListWidgetProps) {
  const { data, error, reload } = useData(source)
  if (!data) return <DataStatus label={label} error={error} onRetry={reload} />
  const { items, footer } = data

  return (
    <div className="flex flex-col h-full -mx-5 -mb-5">
      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5">
        {items.map((item, i) => {
          const { month, day } = formatDateBadge(item.date)
          return (
            <div
              key={i}
              className={`flex gap-3 py-3 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <div className="flex flex-col items-center w-8 shrink-0 pt-0.5">
                <span className="text-[10px] font-bold text-ink-muted leading-none">
                  {month}
                </span>
                <span className="text-[16px] font-bold text-ink leading-tight">
                  {day}
                </span>
              </div>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-link hover:underline leading-snug"
                >
                  {item.title}
                  <ExternalIcon />
                </a>
              ) : (
                <span className="text-[14px] text-ink-body leading-snug">
                  {item.title}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-line shrink-0">
        <a
          href={footer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-center text-[14px] text-link hover:underline py-3"
        >
          {footer.label}
          <ExternalIcon />
        </a>
      </div>
    </div>
  )
}
