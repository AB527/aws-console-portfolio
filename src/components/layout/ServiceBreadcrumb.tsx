"use client"

import { usePathname } from "next/navigation"
import { TopBarCrumbs } from "./ServiceTopBar"
import type { BreadcrumbItem } from "./Breadcrumb"
import { serviceTitle } from "@/lib/serviceTitle"
import { useData } from "@/hooks/useData"
import { sidebarNav } from "./ServiceSidebar"

const IAM_SECTIONS = (sidebarNav("iam").sections ?? []).flatMap((s) => s.items)

function Crumbs({ serviceId, rest = [] }: { serviceId: string; rest?: BreadcrumbItem[] }) {
  const root: BreadcrumbItem = { label: serviceTitle(serviceId), href: rest.length > 0 ? `/${serviceId}/home` : undefined }
  return <TopBarCrumbs items={[root, ...rest]} />
}

// The names below show the id from the URL until their data has loaded

function GroupCrumbs({ section, id }: { section: BreadcrumbItem; id: string }) {
  const name = useData("iam-groups").data?.groups.find((g) => g.id === id)?.label
  return <Crumbs serviceId="iam" rest={[section, { label: name ?? id }]} />
}

function UserCrumbs({ section, id }: { section: BreadcrumbItem; id: string }) {
  const name = useData("iam-users").data?.users.find((u) => u.id === id)?.username
  return <Crumbs serviceId="iam" rest={[section, { label: name ?? id }]} />
}

function BucketCrumbs({ bucketId, objectKey }: { bucketId: string; objectKey: string | undefined }) {
  const bucket = useData("s3").data?.buckets.find((b) => b.id === bucketId)
  const bucketLabel = bucket?.name ?? bucketId
  const items: BreadcrumbItem[] = [{ label: "Buckets", href: "/s3/home" }]
  if (!objectKey) return <Crumbs serviceId="s3" rest={[...items, { label: bucketLabel }]} />
  return (
    <Crumbs
      serviceId="s3"
      rest={[...items, { label: bucketLabel, href: `/s3/buckets/${bucketId}` }, { label: decodeURIComponent(objectKey) }]}
    />
  )
}

// Breadcrumb for the service top bar, worked out from the URL
export default function ServiceBreadcrumb() {
  const [serviceId = "", section, id, subId] = usePathname().split("/").filter(Boolean)

  if (serviceId === "iam") {
    const href = `/iam/${section}`
    const sectionLabel = IAM_SECTIONS.find((i) => i.href === href)?.label
    if (!sectionLabel) return <Crumbs serviceId={serviceId} />
    if (!id) return <Crumbs serviceId={serviceId} rest={[{ label: sectionLabel }]} />
    const sectionItem = { label: sectionLabel, href }
    return section === "groups" ? <GroupCrumbs section={sectionItem} id={id} /> : <UserCrumbs section={sectionItem} id={id} />
  }

  if (serviceId === "s3" && section === "buckets" && id) return <BucketCrumbs bucketId={id} objectKey={subId} />

  return <Crumbs serviceId={serviceId} />
}
