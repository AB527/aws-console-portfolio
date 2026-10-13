import site from "@data/site.json"

interface DataStatusProps {
  // What is being loaded, e.g. "projects"
  label: string
  error?: boolean
  onRetry?: () => void
  className?: string
}

// Spinner line shown where content will appear, or a retry prompt if the fetch failed
export default function DataStatus({ label, error = false, onRetry, className = "py-8 text-ink-body" }: DataStatusProps) {
  if (error) {
    return (
      <div role="alert" className={`flex items-center justify-center gap-3 flex-wrap text-center ${className}`}>
        <span className="font-bold">{site.data.loadError.replace("%s", label)}</span>
        {onRetry && (
          <button onClick={onRetry} className="font-bold text-link hover:underline">
            {site.data.retry}
          </button>
        )}
      </div>
    )
  }

  return (
    <div role="status" className={`flex items-center justify-center gap-2 text-center ${className}`}>
      <svg className="animate-spin shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-6.22-8.56" strokeLinecap="round" />
      </svg>
      {site.data.loading.replace("%s", label)}
    </div>
  )
}

// The same status as a full-width table row
export function DataStatusRow({ colSpan, ...status }: DataStatusProps & { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <DataStatus {...status} />
      </td>
    </tr>
  )
}
