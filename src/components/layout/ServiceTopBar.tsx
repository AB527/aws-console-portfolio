import Link from "next/link"
import { PageHelpToggle } from "./HelpToggle"
import MobileNavToggle from "./MobileNavToggle"
import type { BreadcrumbItem } from "./Breadcrumb"

export function TopBarCrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-x-3 gap-y-1 min-w-0 text-[14px] leading-5">
      {items.map((item, i) => (
        <span key={`${i}-${item.label}`} className="flex items-center gap-3 min-w-0">
          {i > 0 && (
            <svg className="text-[#656871] shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
          {item.href ? (
            <Link href={item.href} className="text-[#006ce0] underline underline-offset-4">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-[#424650] break-all">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

// Bar under the topbar shared by every service: sidebar toggle + where you are
export default function ServiceTopBar({ items, children }: { items?: BreadcrumbItem[]; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 bg-white border-b border-[#c6c6cd]">
      <MobileNavToggle />
      {items && <TopBarCrumbs items={items} />}
      {children}
      <PageHelpToggle className="ml-auto" />
    </div>
  )
}
