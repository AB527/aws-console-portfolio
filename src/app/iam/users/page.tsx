import type { Metadata } from "next"
import RoleHistoryTable from "@/components/services/iam/RoleHistoryTable"
import Breadcrumb from "@/components/layout/Breadcrumb"
import site from "@/data/site.json"
import iamConsole from "@/data/iam-console.json"
import { serviceTitle } from "@/lib/serviceTitle"

export const metadata: Metadata = { title: site.pageTitles.iamUsers }

export default async function UsersPage() {
  return (
    <div className="p-6">
      <Breadcrumb items={[{ label: serviceTitle("iam"), href: "/iam/home" }, { label: iamConsole.pages.roles.breadcrumb }]} />
      <RoleHistoryTable />
    </div>
  )
}
