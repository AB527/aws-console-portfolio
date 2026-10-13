import type { Metadata } from "next"
import { TrailCount, TrailsList } from "@/components/services/cloudtrail/CloudTrailData"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.cloudtrailTrails }

export default function CloudTrailTrailsPage() {
  return (
    <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
      <div className="flex items-baseline gap-2">
        <h1 className="text-[20px] leading-6 font-bold">
          Trails <TrailCount />
        </h1>
        <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
      </div>
      <p className="mt-1 mb-3">Each trail is one role in the work history.</p>
      <TrailsList detailed />
    </div>
  )
}
