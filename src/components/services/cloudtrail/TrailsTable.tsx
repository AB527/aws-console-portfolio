import Link from "next/link"
import { formatPeriod } from "@/lib/formatDate"
import { regionFull, type Trail } from "@/lib/cloudtrail"

const TH = "text-left py-1.5 font-bold text-[#424650]"
const TH_INNER = "block px-4 py-0.5 border-l border-[#c6c6cd] whitespace-nowrap"

function TrailStatus({ logging }: { logging: boolean }) {
  return logging ? (
    <span className="inline-flex items-center gap-1.5 text-[#00802f]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="m7 12 3.5 3.5L17 9" />
      </svg>
      Logging
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[#656871]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
      </svg>
      Stopped
    </span>
  )
}

interface TrailsTableProps {
  trails: Trail[]
  detailed?: boolean
  // Shown in place of the rows while the trails are loading
  status?: React.ReactNode
}

export default function TrailsTable({ trails, detailed = false, status }: TrailsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#c6c6cd]">
            <th className={TH}>
              <span className="flex items-center justify-between gap-2 pr-4 py-0.5 whitespace-nowrap">
                Name
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M2 8.5h8L6 2.5z" />
                </svg>
              </span>
            </th>
            {detailed && (
              <>
                <th className={TH}>
                  <span className={TH_INNER}>Organization</span>
                </th>
                <th className={TH}>
                  <span className={TH_INNER}>Home region</span>
                </th>
                <th className={TH}>
                  <span className={TH_INNER}>Period</span>
                </th>
              </>
            )}
            <th className={TH}>
              <span className={TH_INNER}>Status</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {trails.map((trail) => (
            <tr key={trail.id} className="border-b border-[#ebebf0] last:border-b-0">
              <td className="pr-4 py-3">
                <Link href={`/iam/users/${trail.id}`} className="text-[#006ce0] underline underline-offset-4">
                  {trail.name}
                </Link>
              </td>
              {detailed && (
                <>
                  <td className="px-4 py-3">{trail.organization}</td>
                  <td className="px-4 py-3">{regionFull(trail.region)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatPeriod(trail.periodFrom, trail.periodTo)}</td>
                </>
              )}
              <td className="px-4 py-3 whitespace-nowrap">
                <TrailStatus logging={trail.logging} />
              </td>
            </tr>
          ))}
          {status && (
            <tr>
              <td colSpan={detailed ? 5 : 2}>{status}</td>
            </tr>
          )}
          {!status && trails.length === 0 && (
            <tr>
              <td colSpan={detailed ? 5 : 2} className="py-8 text-center text-[#424650]">
                <p className="font-bold">No trails</p>
                <p className="mt-1">No trails to display</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
