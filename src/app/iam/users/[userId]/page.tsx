import { notFound } from "next/navigation"
import UserDetail from "@/components/services/iam/UserDetail"
import iamUsers from "@/data/iam-users.json"

interface Props {
  params: Promise<{ userId: string }>
}

export default async function UserPage({ params }: Props) {
  const { userId } = await params
  const exists = iamUsers.users.some((u) => u.id === userId)
  if (!exists) notFound()

  return (
    <div className="p-6">
      <UserDetail userId={userId} />
    </div>
  )
}
