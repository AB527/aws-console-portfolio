import { notFound } from "next/navigation"
import GroupDetail from "@/components/services/iam/GroupDetail"
import iamGroups from "@/data/iam-groups.json"

interface Props {
  params: Promise<{ groupId: string }>
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
