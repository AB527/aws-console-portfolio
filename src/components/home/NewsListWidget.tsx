import { formatDateBadge } from "@/lib/formatDate"

type NewsItem = {
  date: string
  title: string
  link: string
}

interface NewsListWidgetProps {
  items: NewsItem[]
  footer: { label: string; url: string }
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

export default function NewsListWidget({ items, footer }: NewsListWidgetProps) {
  return (
    <div className="flex flex-col h-full -m-3">
      {/* Items */}
      <div className="flex-1 overflow-y-auto px-3">
        {items.map((item, i) => {
          const { month, day } = formatDateBadge(item.date)
          return (
            <div
              key={i}
              className={`flex gap-3 py-3 ${i > 0 ? "border-t border-gray-200" : ""}`}
            >
              <div className="flex flex-col items-center w-8 shrink-0 pt-0.5">
                <span className="text-[10px] font-bold text-gray-500 leading-none">
                  {month}
                </span>
                <span className="text-[16px] font-bold text-gray-800 leading-tight">
                  {day}
                </span>
              </div>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-medium text-[#0073bb] hover:underline leading-snug"
                >
                  {item.title}
                  <ExternalIcon />
                </a>
              ) : (
                <span className="text-[13px] font-medium text-gray-700 leading-snug">
                  {item.title}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 shrink-0">
        <a
          href={footer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-center text-[13px] font-medium text-[#0073bb] hover:underline py-3"
        >
          {footer.label}
          <ExternalIcon />
        </a>
      </div>
    </div>
  )
}
