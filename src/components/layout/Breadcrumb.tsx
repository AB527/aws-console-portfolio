import Link from "next/link"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-ink-muted mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-[#ff9900] select-none">›</span>}
          {item.href ? (
            <Link href={item.href} className="text-[#0073bb] dark:text-link hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 dark:text-ink-body">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
