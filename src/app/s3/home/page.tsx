import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"
import BucketsList from "@/components/services/s3/BucketsList"
import S3SubSidebar from "@/components/services/s3/S3SubSidebar"
import services from "@/data/services.json"

const s3Service = services.find((s) => s.id === "s3")

export default async function S3Page() {
  return (
    <>
      <ServiceVisitor serviceId="s3" />
      <div className="flex bg-[#f2f3f3] min-h-[calc(100vh-56px)]">
        {/* S3 sub-sidebar */}
        <S3SubSidebar title={s3Service?.title} />

        {/* Main content */}
        <div className="flex-1 min-w-0 px-6 py-5 [&_*]:font-bold">
          {/* Page header */}
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Buckets</h1>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#687078" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-5">
            <div className="flex items-center gap-2 pb-2 -mb-px border-b-[3px] border-[#0073bb]">
              <span className="text-sm font-semibold text-[#0073bb]">General purpose buckets</span>
              <span className="text-[11px] font-medium text-white bg-[#545b64] rounded px-1.5 py-0.5">
                All AWS Regions
              </span>
            </div>
          </div>

          {/* Buckets table */}
          <BucketsList />
        </div>
      </div>
    </>
  )
}
