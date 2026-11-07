"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useConsoleStore } from "@/store/useConsoleStore"
import { GITHUB_REPO_URL } from "@/lib/constants"
import regionsData from "@data/regions.json"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import { endpointCount } from "@/lib/vpc"

const regions = regionsData.groups.flatMap((g) => g.regions)

const CARD = "bg-surface rounded-2xl border border-line"
const LINK = "text-link underline underline-offset-4"

export default function VpcDashboard() {
  const router = useRouter()
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)
  const [spinning, setSpinning] = useState(false)
  const city = regions.find((r) => r.id === selectedRegion)?.city ?? selectedRegion
  const { data: vpc, error, reload } = useData("vpc")

  // Counts that come from the data show a dash until it has loaded
  const RESOURCES: { label: string; count: number | string; href?: string }[] = [
    { label: "Connects", count: 1, href: "/vpc/connects" },
    { label: "Endpoints", count: vpc ? endpointCount(vpc) : "–", href: "/vpc/route-tables" },
    { label: "Subnets", count: vpc?.subnets.length ?? "–", href: "/vpc/subnets" },
    { label: "NAT Gateways", count: 0 },
    { label: "Route Tables", count: vpc?.routeTables.length ?? "–", href: "/vpc/route-tables" },
    { label: "Connect Peering Connections", count: 0 },
    { label: "Internet Gateways", count: 0 },
    { label: "Network ACLs", count: 0 },
  ]
  const endpoints = vpc?.routeTables.flatMap((rt) => rt.routes) ?? []

  const handleRefresh = () => {
    setSpinning(true)
    router.refresh()
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <div className="flex gap-6 items-start flex-wrap xl:flex-nowrap">
      <div className="flex-1 min-w-0 basis-full xl:basis-0">
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-5 flex items-center rounded-full bg-[#ff9900] text-sm font-bold text-[#0f141a] hover:bg-[#fa6f00] whitespace-nowrap"
          >
            Create Connect
          </a>
          <Link
            href="/ec2/home"
            className="h-8 px-5 flex items-center rounded-full border-2 border-link text-sm font-bold text-link hover:bg-surface-selected whitespace-nowrap"
          >
            Launch Projects
          </Link>
        </div>
        <p className="mt-2 text-xs text-ink-body">Note: Your Instances will launch in the Asia Pacific region.</p>

        <div className="flex items-end justify-between gap-4 flex-wrap mt-6 pb-2 border-b-2 border-line">
          <div>
            <h1 className="text-[20px] leading-6 font-bold">Resources by Region</h1>
            <p className="mt-2">You are using the following Connect resources</p>
          </div>
          <button onClick={handleRefresh} className="flex items-center gap-2 mb-6 font-bold text-link">
            <svg
              className={spinning ? "animate-spin" : ""}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 4v5h-5" />
            </svg>
            Refresh Resources
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-5">
          {RESOURCES.map((res) => (
            <div key={res.label} className={`${CARD} px-4 py-3`}>
              <div className="flex items-baseline justify-between gap-3">
                {res.href ? (
                  <Link href={res.href} className={`${LINK} font-bold`}>
                    {res.label}
                  </Link>
                ) : (
                  <span className={`${LINK} font-bold`}>{res.label}</span>
                )}
                <span className="whitespace-nowrap">
                  {city} <span className={LINK}>{res.count}</span>
                </span>
              </div>
              <details className="mt-2 group">
                <summary className="flex items-center gap-2 font-bold cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <svg className="group-open:rotate-90 transition-transform" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M2 0v10l7-5z" />
                  </svg>
                  See all regions
                </summary>
                <ul className="mt-2 pl-5 space-y-1">
                  {regions.map((r) => (
                    <li key={r.id} className="flex justify-between">
                      <span>{r.full}</span>
                      <span>{res.count}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full xl:w-[320px] shrink-0 space-y-6">
        <div className={`${CARD} px-5 py-5`}>
          <h2 className="text-[20px] leading-6 font-bold">Service Health</h2>
          <Link href="/vpc/subnets" className={`${LINK} inline-block mt-3`}>
            View all subnets
          </Link>
        </div>
        <div className={`${CARD} px-5 py-5`}>
          <h2 className="text-[20px] leading-6 font-bold">Additional Information ↗</h2>
          {!vpc && <DataStatus label="links" error={error} onRetry={reload} className="py-4 text-ink-body" />}
          <ul className="mt-2 divide-y divide-line-subtle">
            {endpoints.map((e) => (
              <li key={e.url} className="py-2.5">
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-link hover:underline break-all">
                  {e.target}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
