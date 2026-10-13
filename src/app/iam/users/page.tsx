import type { Metadata } from "next"
import RoleHistoryTable from "@/components/services/iam/RoleHistoryTable"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.iamUsers }

export default async function UsersPage() {
  return (
    <div className="p-6">
      <RoleHistoryTable />
    </div>
  )
}
