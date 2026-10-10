import type { Metadata } from "next"
import SkillsTable from "@/components/services/iam/SkillsTable"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.iamSkills }

export default async function SkillsPage() {
  return (
    <div className="p-6">
      <SkillsTable />
    </div>
  )
}
