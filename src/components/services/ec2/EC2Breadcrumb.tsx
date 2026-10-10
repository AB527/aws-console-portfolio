"use client"

import { useSearchParams } from "next/navigation"
import { TopBarCrumbs } from "@/components/layout/ServiceTopBar"
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb"
import { serviceTitle } from "@/lib/serviceTitle"

// Shown in the EC2 top bar; the EC2 views live in ?view= rather than the path
export default function EC2Breadcrumb() {
  const searchParams = useSearchParams()
  const view = searchParams.get("view")

  const region = searchParams.get("region")
  const regionParam = region ? `&region=${region}` : ""
  const home = `/ec2/home${region ? `?region=${region}` : ""}`
  const types = `/ec2/home?view=instance-types${regionParam}`

  const rest: BreadcrumbItem[] =
    view === "instances"
      ? [{ label: "Projects" }]
      : view === "instance-types"
        ? [{ label: "Project types" }]
        : view === "instance-type-finder"
          ? [{ label: "Project types", href: types }, { label: "Project type finder" }]
          : []

  return <TopBarCrumbs items={[{ label: serviceTitle("ec2"), href: rest.length > 0 ? home : undefined }, ...rest]} />
}
