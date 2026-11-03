import iamConsole from "@data/iam-console.json"

export const CARD = "bg-surface rounded-2xl border border-line"
export const LINK = "text-link hover:underline"
export const TH = "text-left px-3 py-3 font-bold text-gray-900 dark:text-ink whitespace-nowrap"
export const TH_INNER = "block border-l border-gray-300 dark:border-line pl-3"
export const TD = "px-3 py-3 text-gray-700 dark:text-ink-body"
export const TD_INNER = "pl-3"
export const ROW = "border-b border-gray-100 dark:border-line-subtle hover:bg-[#f1faff] dark:hover:bg-surface-selected transition-colors"

interface SummaryItem {
  label: string
  value: React.ReactNode
}

// The "Summary" container at the top of a detail page
export function SummaryGrid({ items }: { items: SummaryItem[] }) {
  return (
    <div className={`${CARD} px-5 py-5`}>
      <h2 className="text-[18px] leading-6 font-bold text-gray-900 dark:text-ink">{iamConsole.detail.summary}</h2>
      <dl className="grid grid-cols-1 md:grid-cols-3 gap-y-5 mt-4">
        {items.map((item, i) => (
          <div key={item.label} className={`md:px-5 ${i % 3 === 0 ? "md:pl-0" : "md:border-l md:border-line"}`}>
            <dt className="text-sm text-ink-body">{item.label}</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-ink break-words">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[]
  active: T
  onChange: (id: T) => void
}

export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex border-b border-line mt-6 mb-4 overflow-x-auto overflow-y-hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap border-b-[3px] -mb-px transition-colors ${
            active === tab.id ? "border-link text-link" : "border-transparent text-ink-body hover:text-link"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// A table container with the "Title (count)" heading used under the tabs
export function TableCard({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className={`${CARD} overflow-hidden`}>
      <h2 className="px-5 pt-5 pb-2 text-[18px] leading-6 font-bold text-gray-900 dark:text-ink">
        {title} <span className="font-normal text-gray-500 dark:text-ink-muted">({count})</span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  )
}
