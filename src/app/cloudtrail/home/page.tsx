import type { Metadata } from "next"
import Link from "next/link"
import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"
import { CurrentTrailBanner, EventsList, TrailsList } from "@/components/services/cloudtrail/CloudTrailData"
import { GITHUB_REPO_URL } from "@/lib/constants"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.cloudtrail }

const CARD = "bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4"
const OUTLINE_BTN =
  "h-8 px-5 flex items-center rounded-full border-2 border-[#006ce0] text-sm font-bold text-[#006ce0] hover:bg-[#f0fbff] whitespace-nowrap"

export default function CloudTrailPage() {
  return (
    <>
      <ServiceVisitor serviceId="cloudtrail" />

      <CurrentTrailBanner />

      <div className="flex items-baseline gap-2 mb-5">
        <h1 className="text-[24px] leading-[30px] font-bold">Dashboard</h1>
        <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
      </div>

      <div className={`${CARD} mb-6`}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[20px] leading-6 font-bold">Trails</h2>
            <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
          </div>
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className={OUTLINE_BTN}>
            Create trail
          </a>
        </div>
        <TrailsList />
      </div>

      <div className={CARD}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-[20px] leading-6 font-bold">Event history</h2>
              <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
            </div>
            <p className="mt-1">The most recent role changes.</p>
          </div>
          <Link href="/cloudtrail/events" className={OUTLINE_BTN}>
            View full Event history
          </Link>
        </div>
        <EventsList limit={5} />
      </div>
    </>
  )
}
