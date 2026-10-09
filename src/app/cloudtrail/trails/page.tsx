import type { Metadata } from "next"
import TrailsTable from "@/components/services/cloudtrail/TrailsTable"
import { trails } from "@/lib/cloudtrail"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.cloudtrailTrails }

export default function CloudTrailTrailsPage() {
  return (
    <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
      <div className="flex items-baseline gap-2">
        <h1 className="text-[20px] leading-6 font-bold">
          Trails <span className="font-normal text-[#656871]">({trails.length})</span>
        </h1>
        <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
      </div>
      <p className="mt-1 mb-3">Each trail is one role in the work history.</p>
      <TrailsTable trails={trails} detailed />
    </div>
  )
}
