import type { Metadata } from "next"
import { notFound } from "next/navigation"
import UserDetail from "@/components/services/iam/UserDetail"
import iamUsers from "@data/iam-users.json"
import site from "@data/site.json"

interface Props {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  const user = iamUsers.users.find((u) => u.id === userId)
  return user ? { title: site.detailTitles.iam.replace("%s", user.displayName) } : {}
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
