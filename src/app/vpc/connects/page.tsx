import type { Metadata } from "next"
import ConnectsTable from "@/components/services/vpc/ConnectsTable"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.vpcVpcs }

export default function ConnectsPage() {
  return <ConnectsTable />
}
