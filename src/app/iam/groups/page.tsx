import type { Metadata } from "next"
import SkillGroupsTable from "@/components/services/iam/SkillGroupsTable"
import Breadcrumb from "@/components/layout/Breadcrumb"
import site from "@/data/site.json"
import iamConsole from "@/data/iam-console.json"
import { serviceTitle } from "@/lib/serviceTitle"

export const metadata: Metadata = { title: site.pageTitles.iamGroups }

export default async function GroupsPage() {
  return (
    <div className="p-6">
      <Breadcrumb items={[{ label: serviceTitle("iam"), href: "/iam/home" }, { label: iamConsole.pages.groups.breadcrumb }]} />
      <SkillGroupsTable />
    </div>
  )
}
