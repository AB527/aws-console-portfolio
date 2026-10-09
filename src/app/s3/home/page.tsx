import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"
import BucketsList from "@/components/services/s3/BucketsList"
import s3Data from "@/data/s3.json"

export default async function S3Page() {
  return (
    <>
      <ServiceVisitor serviceId="s3" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">S3 — Documents</h1>
            <p className="text-sm text-gray-500 mt-0.5">Resumes, letters, certifications</p>
          </div>
          <span className="text-xs bg-[#e8f5e3] text-[#3F8624] border border-[#b2d9a0] rounded px-2.5 py-1 font-medium">
            Global
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 border-l-4 border-l-[#3F8624]">
            <p className="text-xs text-gray-500 font-medium">Total Buckets</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s3Data.buckets.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 border-l-4 border-l-[#0073bb]">
            <p className="text-xs text-gray-500 font-medium">Total Objects</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {s3Data.buckets.reduce((s, b) => s + b.objects.length, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 border-l-4 border-l-[#ff9900]">
            <p className="text-xs text-gray-500 font-medium">Regions</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {new Set(s3Data.buckets.map((b) => b.region)).size}
            </p>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-gray-700 mb-3">General Purpose Buckets</h2>
        <BucketsList />
      </div>
    </>
  )
}
