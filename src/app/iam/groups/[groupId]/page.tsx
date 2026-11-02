import type { Metadata } from "next"
import { notFound } from "next/navigation"
import GroupDetail from "@/components/services/iam/GroupDetail"
import iamGroups from "@data/iam-groups.json"
import site from "@data/site.json"

interface Props {
  params: Promise<{ groupId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { groupId } = await params
  const group = iamGroups.groups.find((g) => g.id === groupId)
  return group ? { title: site.detailTitles.iam.replace("%s", group.label) } : {}
}

export default async function GroupPage({ params }: Props) {
  const { groupId } = await params
  const exists = iamGroups.groups.some((g) => g.id === groupId)
  if (!exists) notFound()

  return (
    <div className="p-6">
      <GroupDetail groupId={groupId} />
    </div>
  )
}
