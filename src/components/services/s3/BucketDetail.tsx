"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/formatDate"
import Breadcrumb from "@/components/layout/Breadcrumb"

type S3Object = {
  key: string
  size: string
  lastModified: string
  type: string
  storageClass: string
  url: string
}

type Bucket = {
  id: string
  name: string
  region: string
  createdDate: string
  objects: S3Object[]
}

const TABS = ["Objects", "Properties", "Permissions", "Metrics", "Management", "Access Points"]

export default function BucketDetail({ bucket }: { bucket: Bucket }) {
  const [activeTab, setActiveTab] = useState("Objects")

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "S3", href: "/s3/home" },
          { label: "Buckets", href: "/s3/home" },
          { label: bucket.name },
        ]}
      />

      <h1 className="text-xl font-semibold text-gray-900 mb-4">{bucket.name}</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-[#0073bb] text-[#0073bb]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Objects" ? (
        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Key
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Size
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Last modified
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  Storage class
                </th>
              </tr>
            </thead>
            <tbody>
              {bucket.objects.map((obj) => (
                <tr key={obj.key} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/s3/home/${bucket.id}/${encodeURIComponent(obj.key)}`}
                      className="text-[#0073bb] hover:underline font-medium"
                    >
                      {obj.key}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 hidden md:table-cell">{obj.size}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-xs hidden md:table-cell">
                    {formatDate(obj.lastModified)}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 hidden lg:table-cell">{obj.storageClass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          {activeTab} — Coming soon
        </div>
      )}
    </div>
  )
}
