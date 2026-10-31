import type { Metadata } from "next"
import EventsTable from "@/components/services/cloudtrail/EventsTable"
import { events } from "@/lib/cloudtrail"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.cloudtrailEvents }

export default function CloudTrailEventsPage() {
  return (
    <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
      <div className="flex items-baseline gap-2">
        <h1 className="text-[20px] leading-6 font-bold">
          Event history <span className="font-normal text-[#656871]">({events.length})</span>
        </h1>
        <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
      </div>
      <p className="mt-1 mb-3">Every role started and ended, newest first.</p>
      <EventsTable events={events} filterable />
    </div>
  )
}
