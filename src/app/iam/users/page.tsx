import UsersList from "@/components/services/iam/UsersList"
import Breadcrumb from "@/components/layout/Breadcrumb"

export default async function UsersPage() {
  return (
    <div className="p-6">
      <Breadcrumb items={[{ label: "IAM", href: "/iam/home" }, { label: "Users" }]} />
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Experience / Roles</h1>
      </div>
      <UsersList />
    </div>
  )
}
