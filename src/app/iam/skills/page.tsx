import type { Metadata } from "next"
import SkillsTable from "@/components/services/iam/SkillsTable"
import Breadcrumb from "@/components/layout/Breadcrumb"
import site from "@/data/site.json"
import iamConsole from "@/data/iam-console.json"
import { serviceTitle } from "@/lib/serviceTitle"

export const metadata: Metadata = { title: site.pageTitles.iamSkills }

export default async function SkillsPage() {
  return (
    <div className="p-6">
      <Breadcrumb items={[{ label: serviceTitle("iam"), href: "/iam/home" }, { label: iamConsole.pages.skills.breadcrumb }]} />
      <SkillsTable />
    </div>
  )
}
