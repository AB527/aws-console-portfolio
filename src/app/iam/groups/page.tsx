import GroupsList from "@/components/services/iam/GroupsList"
import Breadcrumb from "@/components/layout/Breadcrumb"

export default async function GroupsPage() {
  return (
    <div className="p-6">
      <Breadcrumb items={[{ label: "IAM", href: "/iam/home" }, { label: "Skill Groups" }]} />
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Skill Groups</h1>
      </div>
      <GroupsList />
    </div>
  )
}
