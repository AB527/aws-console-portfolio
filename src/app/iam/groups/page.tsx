import type { Metadata } from "next"
import SkillGroupsTable from "@/components/services/iam/SkillGroupsTable"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.iamGroups }

export default async function GroupsPage() {
  return (
    <div className="p-6">
      <SkillGroupsTable />
    </div>
  )
}
