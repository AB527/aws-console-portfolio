"use client"

import { usePathname } from "next/navigation"
import { TopBarCrumbs } from "./ServiceTopBar"
import type { BreadcrumbItem } from "./Breadcrumb"
import { serviceTitle } from "@/lib/serviceTitle"
import iamConsole from "@/data/iam-console.json"
import iamGroups from "@/data/iam-groups.json"
import iamUsers from "@/data/iam-users.json"
import s3Data from "@/data/s3.json"

const IAM_SECTIONS = iamConsole.nav.sections.flatMap((s) => s.items)

function iamItems(section: string | undefined, id: string | undefined): BreadcrumbItem[] {
  const href = `/iam/${section}`
  const sectionLabel = IAM_SECTIONS.find((i) => i.href === href)?.label
  if (!sectionLabel) return []
  if (!id) return [{ label: sectionLabel }]
  const name =
    section === "groups"
      ? iamGroups.groups.find((g) => g.id === id)?.label
      : iamUsers.users.find((u) => u.id === id)?.username
  return [{ label: sectionLabel, href }, { label: name ?? id }]
}

function s3Items(section: string | undefined, bucketId: string | undefined, objectKey: string | undefined): BreadcrumbItem[] {
  if (section !== "buckets" || !bucketId) return []
  const bucket = s3Data.buckets.find((b) => b.id === bucketId)
  const bucketLabel = bucket?.name ?? bucketId
  const items: BreadcrumbItem[] = [{ label: "Buckets", href: "/s3/home" }]
  if (!objectKey) return [...items, { label: bucketLabel }]
  return [...items, { label: bucketLabel, href: `/s3/buckets/${bucketId}` }, { label: decodeURIComponent(objectKey) }]
}

// Breadcrumb for the service top bar, worked out from the URL
export default function ServiceBreadcrumb() {
  const [serviceId = "", section, id, subId] = usePathname().split("/").filter(Boolean)

  const rest = serviceId === "iam" ? iamItems(section, id) : serviceId === "s3" ? s3Items(section, id, subId) : []
  const root: BreadcrumbItem = { label: serviceTitle(serviceId), href: rest.length > 0 ? `/${serviceId}/home` : undefined }

  return <TopBarCrumbs items={[root, ...rest]} />
}
