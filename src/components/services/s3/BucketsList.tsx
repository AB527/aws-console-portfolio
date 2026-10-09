import Link from "next/link"
import { formatDate } from "@/lib/formatDate"
import s3Data from "@/data/s3.json"

export default function BucketsList() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">
              <input type="checkbox" className="rounded" />
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Bucket name
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Type
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
              Region
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
              Created
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
              Objects
            </th>
          </tr>
        </thead>
        <tbody>
          {s3Data.buckets.map((bucket) => (
            <tr key={bucket.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
              <td className="px-4 py-3">
                <input type="checkbox" className="rounded" />
              </td>
              <td className="px-4 py-3">
                <Link href={`/s3/home/${bucket.id}`} className="text-[#0073bb] hover:underline font-medium">
                  {bucket.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">General purpose</span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{bucket.region}</td>
              <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                {formatDate(bucket.createdDate)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 hidden md:table-cell">
                {bucket.objects.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
