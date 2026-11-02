import type { Metadata } from "next"
import { EventCount, EventsList } from "@/components/services/cloudtrail/CloudTrailData"
import site from "@data/site.json"
import InfoLink from "@/components/ui/InfoLink"

export const metadata: Metadata = { title: site.pageTitles.cloudtrailEvents }

export default function CloudTrailEventsPage() {
  return (
    <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
      <div className="flex items-baseline gap-2">
        <h1 className="text-[20px] leading-6 font-bold">
          Event history <EventCount />
        </h1>
        <InfoLink topic="cloudtrail-events" />
      </div>
      <p className="mt-1 mb-3">Every role started and ended, newest first.</p>
      <EventsList filterable />
    </div>
  )
}
