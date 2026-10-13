import type { Metadata } from "next"
import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"
import BucketsList from "@/components/services/s3/BucketsList"
import ServiceSidebar from "@/components/layout/ServiceSidebar"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.s3 }

export default async function S3Page() {
  return (
    <>
      <ServiceVisitor serviceId="s3" />
      <div className="flex bg-[#f2f3f3] min-h-[calc(100vh-56px)]">
        {/* S3 sub-sidebar */}
        <ServiceSidebar serviceId="s3" />

        {/* Main content */}
        <div className="flex-1 min-w-0 px-4 lg:px-6 py-5">
          {/* Header, tabs and buckets table */}
          <BucketsList />
        </div>
      </div>
    </>
  )
}
