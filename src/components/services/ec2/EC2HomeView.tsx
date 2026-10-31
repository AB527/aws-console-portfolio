"use client"

import { useConsoleStore } from "@/store/useConsoleStore"
import ec2Data from "@/data/ec2-projects.json"
import regionsData from "@/data/regions.json"

export default function EC2HomeView() {
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)

  const regionInstances = ec2Data.instances.filter((i) => i.region === selectedRegion)
  const running = regionInstances.filter((i) => i.status === "running").length
  const stopped = regionInstances.filter((i) => i.status === "stopped").length
  const totalUsers = regionInstances.reduce((s, i) => s + i.metrics.usersServed, 0)
  const typesInRegion = new Set(regionInstances.map((i) => i.instanceType)).size

  const RESOURCES = [
    { label: "Projects (running)", value: running, href: `/ec2/home?view=instances&region=${selectedRegion}` },
    { label: "GitHub", value: 1, href: "https://github.com/AB527", external: true },
    { label: "Users served", value: totalUsers >= 1000 ? `${Math.round(totalUsers / 1000)}k+` : totalUsers, href: `/ec2/home?view=instances&region=${selectedRegion}` },
    { label: "Projects (stopped)", value: stopped, href: `/ec2/home?view=instances&region=${selectedRegion}` },
    { label: "Instance types", value: typesInRegion, href: `/ec2/home?view=instance-types&region=${selectedRegion}` },
    { label: "Regions active", value: 2, href: "/" },
    { label: "Tech companies", value: 3, href: "/iam/users" },
    { label: "Open source repos", value: 1, href: "https://github.com/AB527", external: true },
  ]

  const regionInfo = regionsData.groups
    .flatMap((g) => g.regions)
    .find((r) => r.id === selectedRegion)

  const zones = regionInfo?.zones ?? []

  function launchProject() {
    window.location.href =
      "mailto:atharvabedekar527@gmail.com?subject=Project%20Proposal&body=Hi%20Atharva%2C%20want%20to%20start%20a%20project."
  }

  return (
    <div className="p-5 space-y-5 max-w-5xl">

      {/* Resources */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-[14px] font-semibold text-gray-900">Resources</h2>
          <div className="flex items-center gap-2 text-gray-400">
            <button className="hover:text-gray-600" title="Settings">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            <button className="hover:text-gray-600" title="Refresh">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-[12px] text-gray-600">
            You are using the following EC2 resources in the{" "}
            <span className="font-medium">{regionInfo?.full ?? selectedRegion}</span> Region:
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-gray-100">
          {RESOURCES.map((r) => (
            <div key={r.label} className="px-4 py-2.5 flex items-center justify-between gap-3">
              <a
                href={r.href}
                {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-[13px] text-[#0073bb] hover:underline"
              >
                {r.label}
              </a>
              <span className="text-[13px] font-medium text-gray-800">{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Launch + Service Health row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Launch project */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
          <h2 className="text-[14px] font-semibold text-gray-900 mb-1">Launch project</h2>
          <p className="text-[12px] text-gray-600 mb-4 leading-relaxed">
            To get started, launch a project — a deployed system or shipped piece of code.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={launchProject}
              className="flex items-center gap-0 bg-[#ff9900] hover:bg-[#e88a00] text-white text-[13px] font-medium rounded-full overflow-hidden transition-colors"
            >
              <span className="px-3 py-1.5">Launch project</span>
              <span className="border-l border-[#e88a00] px-2 py-1.5 hover:bg-[#d47f00] rounded-r-full">
                <svg width="9" height="6" viewBox="0 0 10 6" fill="currentColor">
                  <path d="M1 1l4 4 4-4" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <a
              href="https://www.linkedin.com/in/atharva-bedekar/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[13px] text-[#0073bb] hover:underline border border-gray-300 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              View profile
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M3 13 L13 3 M6 3 H13 V10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <p className="text-[11px] text-gray-400">
            Note: Clicking Launch project will open an email to Atharva Bedekar in the{" "}
            <span className="font-medium">{regionInfo?.city ?? selectedRegion}</span> Region.
          </p>
        </section>

        {/* Service health */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold text-gray-900">Service health</h2>
            <button className="text-gray-400 hover:text-gray-600" title="Refresh">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <button className="flex items-center gap-1.5 border border-[#0073bb] text-[#0073bb] rounded-full px-2.5 py-1 text-[12px] hover:bg-[#eaf4fb] transition-colors mb-3">
            AB Health Dashboard
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M3 13 L13 3 M6 3 H13 V10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="space-y-1.5 mb-3 text-[13px]">
            <div className="flex gap-2">
              <span className="text-gray-500 w-16 shrink-0">Region</span>
              <span className="text-gray-800">{regionInfo?.full ?? selectedRegion}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-gray-500 w-16 shrink-0">Status</span>
              <span className="flex items-center gap-1.5 text-green-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" />
                  <path d="M22 4 12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                This service is operating normally.
              </span>
            </div>
          </div>

          {zones.length > 0 && (
            <>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Zones</p>
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="text-left py-1 font-medium">Zone name</th>
                    <th className="text-left py-1 font-medium">Zone ID</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((z) => (
                    <tr key={z.name} className="border-b border-gray-50">
                      <td className="py-1 text-[#0073bb]">{z.name}</td>
                      <td className="py-1 text-gray-600">{z.zoneId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>
      </div>

      {/* Instance alarms */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
        <h2 className="text-[14px] font-semibold text-gray-900 mb-3">Instance alarms</h2>
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/atharva-bedekar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-[#0073bb] text-[#0073bb] rounded-full px-2.5 py-1 text-[12px] hover:bg-[#eaf4fb] transition-colors"
          >
            View in LinkedIn
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M3 13 L13 3 M6 3 H13 V10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <span className="flex items-center gap-1 text-[12px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> 0 in alarm
          </span>
          <span className="flex items-center gap-1 text-[12px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> {running} OK
          </span>
          <span className="flex items-center gap-1 text-[12px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> 0 insufficient
          </span>
        </div>
      </section>

    </div>
  )
}
