import type { Metadata } from "next"
import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"
import BucketsList from "@/components/services/s3/BucketsList"
import S3SubSidebar from "@/components/services/s3/S3SubSidebar"
import services from "@/data/services.json"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.s3 }

const s3Service = services.find((s) => s.id === "s3")

export default async function S3Page() {
  return (
    <>
      <ServiceVisitor serviceId="s3" />
      <div className="flex bg-[#f2f3f3] min-h-[calc(100vh-56px)]">
        {/* S3 sub-sidebar */}
        <S3SubSidebar title={s3Service?.title} />

        {/* Main content */}
        <div className="flex-1 min-w-0 px-4 lg:px-6 py-5">
          {/* Header, tabs and buckets table */}
          <BucketsList />
        </div>
      </div>
    </>
  )
}
