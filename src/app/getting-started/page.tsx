import type { Metadata } from "next"
import Breadcrumb from "@/components/layout/Breadcrumb"
import GettingStartedContent from "@/components/services/GettingStartedContent"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.gettingStarted }

export default function GettingStartedPage() {
  return (
    <div className="p-6 max-w-3xl">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Getting started" }]} />
      <GettingStartedContent />
    </div>
  )
}
