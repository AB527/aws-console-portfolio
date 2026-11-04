"use client"

import Link from "next/link"
import CloudTrailBanner from "@/components/services/cloudtrail/CloudTrailBanner"
import EventsTable from "@/components/services/cloudtrail/EventsTable"
import TrailsTable from "@/components/services/cloudtrail/TrailsTable"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import { buildEvents, buildTrails, currentTrail, regionFull } from "@/lib/cloudtrail"
import { useConsoleStore } from "@/store/useConsoleStore"
import regionsData from "@data/regions.json"
import { formatMonthYear } from "@/lib/formatDate"

// Trails and events are both derived from the work history in iam-users.json.
// Experience is regional: only the roles held in the selected Region are listed.
function useTrails() {
  const { data, error, reload } = useData("iam-users")
  const region = useConsoleStore((s) => s.selectedRegion)
  const trails = data ? buildTrails(data.users).filter((t) => t.region === region) : null
  // Shown in an empty table, so it is clear the Region is why
  const emptyNote = regionsData.emptyNote.replace("%s", regionFull(region))
  return { trails, events: trails ? buildEvents(trails) : null, emptyNote, error, reload }
}

function Count({ value }: { value: number | undefined }) {
  return <span className="font-normal text-ink-muted">({value ?? "–"})</span>
}

export function TrailCount() {
  return <Count value={useTrails().trails?.length} />
}

export function EventCount() {
  return <Count value={useTrails().events?.length} />
}

export function CurrentTrailBanner() {
  const { trails } = useTrails()
  const current = trails && currentTrail(trails)
  if (!current) return null

  return (
    <CloudTrailBanner>
      Currently logging: {current.role} at {current.organization} since {formatMonthYear(current.periodFrom)}.{" "}
      <Link href={`/iam/users/${current.id}`} className="underline underline-offset-4">
        Learn more ↗
      </Link>
    </CloudTrailBanner>
  )
}

export function TrailsList({ detailed = false }: { detailed?: boolean }) {
  const { trails, emptyNote, error, reload } = useTrails()
  return (
    <TrailsTable
      trails={trails ?? []}
      emptyNote={emptyNote}
      detailed={detailed}
      status={trails ? undefined : <DataStatus label="trails" error={error} onRetry={reload} />}
    />
  )
}

// `limit` keeps only the most recent events
export function EventsList({ limit, filterable = false }: { limit?: number; filterable?: boolean }) {
  const { events, emptyNote, error, reload } = useTrails()
  return (
    <EventsTable
      events={events?.slice(0, limit) ?? []}
      emptyNote={emptyNote}
      filterable={filterable}
      status={events ? undefined : <DataStatus label="events" error={error} onRetry={reload} />}
    />
  )
}
