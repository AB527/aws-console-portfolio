import Breadcrumb from "@/components/layout/Breadcrumb"
import { formatDate } from "@/lib/formatDate"

type S3Object = {
  key: string
  size: string
  lastModified: string
  type: string
  storageClass: string
  url: string
}

interface ObjectDetailProps {
  bucketId: string
  bucketName: string
  obj: S3Object
}

export default function ObjectDetail({ bucketId, bucketName, obj }: ObjectDetailProps) {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "S3", href: "/s3/home" },
          { label: "Buckets", href: "/s3/home" },
          { label: bucketName, href: `/s3/buckets/${bucketId}` },
          { label: obj.key },
        ]}
      />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-900 break-all">{obj.key}</h1>
        {obj.url ? (
          <a
            href={obj.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white bg-[#ff9900] hover:bg-[#e68900] px-4 py-1.5 rounded font-medium transition-colors shrink-0 ml-4"
          >
            Open
          </a>
        ) : (
          <button
            disabled
            className="text-sm text-gray-400 bg-gray-100 px-4 py-1.5 rounded font-medium cursor-not-allowed shrink-0 ml-4"
          >
            Open
          </button>
        )}
      </div>

      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
          <h2 className="text-sm font-semibold text-gray-700">Object overview</h2>
        </div>
        <dl className="divide-y divide-gray-100">
          {[
            { label: "Key", value: obj.key },
            { label: "Size", value: obj.size },
            { label: "Type", value: obj.type },
            { label: "Last modified", value: formatDate(obj.lastModified) },
            { label: "Storage class", value: obj.storageClass },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-baseline px-4 py-3">
              <dt className="w-40 text-xs text-gray-500 font-medium shrink-0">{label}</dt>
              <dd className="text-sm text-gray-800">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
