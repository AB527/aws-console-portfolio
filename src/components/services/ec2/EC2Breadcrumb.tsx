"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { serviceTitle } from "@/lib/serviceTitle"

const LINK = "text-[#006ce0] underline underline-offset-4"

// Shown in the EC2 top bar; only the finder is nested deep enough to need one
export default function EC2Breadcrumb() {
  const searchParams = useSearchParams()
  if (searchParams.get("view") !== "instance-type-finder") return null

  const region = searchParams.get("region")
  const regionParam = region ? `&region=${region}` : ""
  const items = [
    { label: serviceTitle("ec2"), href: `/ec2/home${region ? `?region=${region}` : ""}` },
    { label: "Project types", href: `/ec2/home?view=instance-types${regionParam}` },
    { label: "Project type finder" },
  ]

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-3 ml-4 text-[14px] leading-5">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-3">
          {i > 0 && (
            <svg className="text-[#656871]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
          {item.href ? (
            <Link href={item.href} className={LINK}>
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-[#424650]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
