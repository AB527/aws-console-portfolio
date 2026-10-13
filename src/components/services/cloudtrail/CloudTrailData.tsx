"use client"

import Link from "next/link"
import CloudTrailBanner from "@/components/services/cloudtrail/CloudTrailBanner"
import EventsTable from "@/components/services/cloudtrail/EventsTable"
import TrailsTable from "@/components/services/cloudtrail/TrailsTable"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import { buildEvents, buildTrails, currentTrail } from "@/lib/cloudtrail"
import { formatMonthYear } from "@/lib/formatDate"

// Trails and events are both derived from the work history in iam-users.json
function useTrails() {
  const { data, error, reload } = useData("iam-users")
  const trails = data ? buildTrails(data.users) : null
  return { trails, events: trails ? buildEvents(trails) : null, error, reload }
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
  const { trails, error, reload } = useTrails()
  return (
    <TrailsTable
      trails={trails ?? []}
      detailed={detailed}
      status={trails ? undefined : <DataStatus label="trails" error={error} onRetry={reload} />}
    />
  )
}

// `limit` keeps only the most recent events
export function EventsList({ limit, filterable = false }: { limit?: number; filterable?: boolean }) {
  const { events, error, reload } = useTrails()
  return (
    <EventsTable
      events={events?.slice(0, limit) ?? []}
      filterable={filterable}
      status={events ? undefined : <DataStatus label="events" error={error} onRetry={reload} />}
    />
  )
}
