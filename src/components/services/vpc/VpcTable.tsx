const TH = "text-left py-1.5 font-bold text-[#424650]"

export function StateBadge({ state }: { state: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[#00802f] whitespace-nowrap">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="m7 12 3.5 3.5L17 9" />
      </svg>
      {state}
    </span>
  )
}

interface VpcTableProps {
  title: string
  count: number | string
  description: string
  columns: string[]
  children: React.ReactNode
}

// Card + table frame shared by the Your Connects and Subnets pages; rows are passed as children
export default function VpcTable({ title, count, description, columns, children }: VpcTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
      <div className="flex items-baseline gap-2">
        <h1 className="text-[20px] leading-6 font-bold">
          {title} <span className="font-normal text-[#656871]">({count})</span>
        </h1>
        <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
      </div>
      <p className="mt-1 mb-3">{description}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c6c6cd]">
              {columns.map((col, i) => (
                <th key={col} className={TH}>
                  <span className={`block py-0.5 whitespace-nowrap ${i === 0 ? "pr-4" : "px-4 border-l border-[#c6c6cd]"}`}>
                    {col}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  )
}
