"use client"

import { useConsoleStore } from "@/store/useConsoleStore"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import regionsData from "@data/regions.json"

const CARD = "bg-surface rounded-2xl border border-line"
const H2 = "text-[20px] leading-6 font-bold"
const OUTLINE_BTN =
  "h-8 px-5 inline-flex items-center gap-2 rounded-full border-2 border-link text-sm font-bold text-link hover:bg-surface-selected whitespace-nowrap"
const ICON_BTN =
  "w-8 h-8 shrink-0 flex items-center justify-center rounded-full border-2 border-link text-link hover:bg-surface-selected"

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3h7v7M21 3l-9 9M10 5H3v16h16v-7" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 4v5h-5" />
    </svg>
  )
}

export default function EC2HomeView() {
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)

  const { data: ec2Data, error, reload } = useData("ec2-projects")
  // Figures worked out from the projects show a dash until they have loaded
  const figure = <T,>(value: T) => (ec2Data ? value : "–")

  const regionInstances = (ec2Data?.instances ?? []).filter((i) => i.region === selectedRegion)
  const running = regionInstances.filter((i) => i.status === "running").length
  const stopped = regionInstances.filter((i) => i.status === "stopped").length
  const totalUsers = regionInstances.reduce((s, i) => s + i.metrics.usersServed, 0)
  const totalHours = regionInstances.reduce((s, i) => s + i.metrics.hoursSpent, 0)
  const typesInRegion = new Set(regionInstances.map((i) => i.instanceType)).size
  const instancesHref = `/ec2/home?view=instances&region=${selectedRegion}`

  const RESOURCES = [
    { label: "Projects (running)", value: figure(running), href: instancesHref },
    { label: "GitHub", value: 1, href: "https://github.com/AB527", external: true },
    { label: "Users served", value: figure(totalUsers >= 1000 ? `${Math.round(totalUsers / 1000)}k+` : totalUsers), href: instancesHref },
    { label: "Projects (stopped)", value: figure(stopped), href: instancesHref },
    { label: "Project types", value: figure(typesInRegion), href: `/ec2/home?view=instance-types&region=${selectedRegion}` },
    { label: "Regions active", value: 2, href: "/" },
    { label: "Tech companies", value: 3, href: "/iam/users" },
    { label: "Open source repos", value: 1, href: "https://github.com/AB527", external: true },
  ]

  const regionInfo = regionsData.groups
    .flatMap((g) => g.regions)
    .find((r) => r.id === selectedRegion)

  const zones = regionInfo?.zones ?? []
  const regionName = regionInfo?.full ?? selectedRegion

  function launchProject() {
    window.location.href =
      "mailto:atharvabedekar527@gmail.com?subject=Project%20Proposal&body=Hi%20Atharva%2C%20want%20to%20start%20a%20project."
  }

  return (
    <div className="px-4 lg:px-6 py-5 flex gap-6 items-start flex-wrap xl:flex-nowrap text-[14px] leading-5 text-ink">
      <div className="flex-1 min-w-0 basis-full xl:basis-0 space-y-6">
        {/* Resources */}
        <section className={`${CARD} px-5 py-5`}>
          <div className="flex items-start justify-between gap-4">
            <h2 className={H2}>Resources</h2>
            <div className="flex items-center gap-2">
              <button className={ICON_BTN} title="Settings" aria-label="Settings">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              <button className={ICON_BTN} title="Refresh" aria-label="Refresh">
                <RefreshIcon />
              </button>
            </div>
          </div>
          <p className="mt-2 mb-4">You are using the following Projects resources in the {regionName} Region:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
            {RESOURCES.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between gap-3 px-3 py-2.5 border border-line rounded-sm text-link"
              >
                <a
                  href={r.href}
                  {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="hover:underline"
                >
                  {r.label}
                </a>
                <span>{r.value}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            {/* Launch project */}
            <section className={CARD}>
              <div className="px-5 pt-5 pb-5">
                <h2 className={H2}>Launch project</h2>
                <p className="mt-1 mb-4">
                  To get started, launch a project, which is a deployed system or shipped piece of code.
                </p>
                <div className="flex flex-col items-start gap-3">
                  <button
                    onClick={launchProject}
                    className="h-8 flex items-stretch rounded-full bg-[#ff9900] hover:bg-[#fa6f00] text-sm font-bold text-[#0f141a] overflow-hidden transition-colors"
                  >
                    <span className="flex items-center pl-5 pr-4">Launch project</span>
                    <span className="flex items-center px-3 border-l-2 border-white">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                        <path d="M1 3h8L5 8z" />
                      </svg>
                    </span>
                  </button>
                  <a
                    href="https://www.linkedin.com/in/atharva-bedekar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={OUTLINE_BTN}
                  >
                    View profile
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <p className="px-5 py-4 border-t border-line">
                Note: Launch project opens an email to Atharva Bedekar in the {regionName} Region
              </p>
            </section>

            {/* Project alarms */}
            <section className={`${CARD} px-5 py-5`}>
              <h2 className={H2}>Project alarms</h2>
              <a
                href="https://www.linkedin.com/in/atharva-bedekar/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${OUTLINE_BTN} mt-2`}
              >
                View in LinkedIn
                <ExternalIcon />
              </a>
              <div className="flex items-center gap-x-4 gap-y-1 flex-wrap mt-4 text-ink-body">
                <span className="flex items-center gap-1.5">
                  <svg className="text-warning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3 2 21h20L12 3z" />
                    <path d="M12 10v5M12 18v.5" />
                  </svg>
                  0 in alarm
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="text-success" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m7 12 3.5 3.5L17 9" />
                  </svg>
                  {figure(running)} OK
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M7.5 12h.5M12 12h.5M16 12h.5" strokeLinecap="round" />
                  </svg>
                  0 insufficient data
                </span>
              </div>
            </section>
          </div>

          {/* Service health + zones */}
          <section className={CARD}>
            <div className="px-5 pt-5 pb-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className={H2}>Service health</h2>
                <button className={ICON_BTN} title="Refresh" aria-label="Refresh">
                  <RefreshIcon />
                </button>
              </div>
              <button className={`${OUTLINE_BTN} mt-2 max-w-full`}>
                <span className="truncate">AB Health Dashboard</span>
                <ExternalIcon />
              </button>
              <dl className="mt-5 space-y-5">
                <div>
                  <dt className="font-bold">Region</dt>
                  <dd className="mt-0.5">{regionName}</dd>
                </div>
                <div>
                  <dt className="font-bold">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-success">
                    <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m7 12 3.5 3.5L17 9" />
                    </svg>
                    This service is operating normally.
                  </dd>
                </div>
              </dl>
            </div>

            {zones.length > 0 && (
              <div className="px-5 py-5 border-t border-line">
                <h2 className={H2}>Zones</h2>
                <table className="w-full mt-3">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left py-2 pr-4 font-bold text-ink-body">Zone name</th>
                      <th className="text-left py-2 font-bold text-ink-body">
                        <span className="block pl-4 border-l border-line">Zone ID</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((z) => (
                      <tr key={z.name} className="border-b border-line-subtle last:border-b-0">
                        <td className="py-3 pr-4">{z.name}</td>
                        <td className="py-3 pl-4">{z.zoneId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      <section className={`${CARD} w-full xl:w-[320px] shrink-0`}>
        <div className="px-5 pt-5 pb-5">
          <h2 className={H2}>Projects effort</h2>
          <div className="flex mt-3">
            <div className="pr-5">
              <p className="font-bold">Date range:</p>
              <p>All time</p>
            </div>
            <div className="pl-5 border-l border-line">
              <p className="font-bold">Region:</p>
              <p>{regionInfo?.city ?? selectedRegion}</p>
            </div>
          </div>
          <div className="mt-5 p-4 -mx-1 bg-surface-subtle space-y-5">
            <div>
              <p className="font-bold">Total hours</p>
              <p className="text-[20px] leading-6 font-bold mt-1">{figure(totalHours.toLocaleString("en-US"))}</p>
            </div>
            <div>
              <p className="font-bold">Projects</p>
              <p className="text-[20px] leading-6 font-bold mt-1">{figure(regionInstances.length)}</p>
            </div>
          </div>
          <p className="font-bold mt-5 mb-1">Hours by project</p>
          <ul className="divide-y divide-line-subtle">
            {regionInstances.map((inst) => (
              <li key={inst.id} className="flex items-baseline justify-between gap-4 py-2.5">
                <a href={`/ec2/home?view=instances&project=${inst.id}&region=${selectedRegion}`} className="text-link hover:underline">
                  {inst.name}
                </a>
                <span className="whitespace-nowrap">{inst.metrics.hoursSpent.toLocaleString("en-US")}</span>
              </li>
            ))}
            {!ec2Data && (
              <li>
                <DataStatus label="projects" error={error} onRetry={reload} className="py-4 text-ink-body" />
              </li>
            )}
            {ec2Data && regionInstances.length === 0 && <li className="py-2.5 text-ink-body">No projects in this region</li>}
          </ul>
        </div>
        <div className="px-5 py-4 border-t border-line text-center">
          <a href={instancesHref} className="text-link hover:underline">
            View all projects
          </a>
        </div>
      </section>
    </div>
  )
}
