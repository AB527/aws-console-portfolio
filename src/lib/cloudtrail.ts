import type usersData from "@data/iam-users.json"
import regionsData from "@data/regions.json"

type User = (typeof usersData)["users"][number]

const regions = regionsData.groups.flatMap((g) => g.regions)

export function regionFull(region: string): string {
  return regions.find((r) => r.id === region)?.full ?? region
}

// "Cloud & DevOps Intern" → "CloudDevOpsIntern"
function pascal(text: string): string {
  return text
    .split(/[^a-zA-Z0-9]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

export type Trail = {
  id: string
  name: string
  organization: string
  role: string
  region: string
  periodFrom: string
  periodTo: string
  logging: boolean
}

export type TrailEvent = {
  id: string
  name: "StartRole" | "EndRole"
  time: string
  userName: string
  source: string
  trailId: string
  region: string
}

// Each experience in iam-users.json is one trail
export function buildTrails(users: User[]): Trail[] {
  return users
    .map((u) => ({
      id: u.id,
      name: u.username,
      organization: u.displayName,
      role: u.description,
      region: u.region,
      periodFrom: u.periodFrom,
      periodTo: u.periodTo,
      logging: u.status === "Active",
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// Starting and ending a role are the events, newest first
export function buildEvents(trails: Trail[]): TrailEvent[] {
  return trails
    .flatMap((t) => {
      const base = { userName: pascal(t.role), source: t.name, trailId: t.id, region: t.region }
      const start: TrailEvent = { ...base, id: `${t.id}-start`, name: "StartRole", time: t.periodFrom }
      const end: TrailEvent = { ...base, id: `${t.id}-end`, name: "EndRole", time: t.periodTo }
      return t.periodTo ? [start, end] : [start]
    })
    .sort((a, b) => b.time.localeCompare(a.time))
}

// Most recent role that is still ongoing
export function currentTrail(trails: Trail[]): Trail | undefined {
  return trails.filter((t) => t.logging).sort((a, b) => b.periodFrom.localeCompare(a.periodFrom))[0]
}
