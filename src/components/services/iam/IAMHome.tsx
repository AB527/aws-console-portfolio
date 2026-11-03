"use client"

import { useState } from "react"
import Link from "next/link"
import DataStatus from "@/components/ui/DataStatus"
import InfoLink from "@/components/ui/InfoLink"
import { useData } from "@/hooks/useData"
import { formatMonthYear, formatPeriod } from "@/lib/formatDate"
import { regionFull } from "@/lib/cloudtrail"
import { serviceTitle } from "@/lib/serviceTitle"
import iamConsole from "@data/iam-console.json"
import { CARD, LINK } from "./DetailParts"

const H2 = "text-[20px] leading-6 font-bold text-gray-900"
const STATUS = "py-4 text-[#424650]"

function RefreshButton({ onClick, spinning }: { onClick: () => void; spinning: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={iamConsole.table.refreshLabel}
      className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border-2 border-[#006ce0] text-[#006ce0] hover:bg-[#f0fbff]"
    >
      <svg className={spinning ? "animate-spin" : ""} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 4v5h-5" />
      </svg>
    </button>
  )
}

function Check({ ok }: { ok: boolean }) {
  return (
    <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={ok ? "#00802f" : "#855900"} strokeWidth="2">
      <circle cx="8" cy="8" r="7" />
      {ok ? <path d="m5 8 2 2 4-4" /> : <path d="M8 4.5v4M8 11v.5" />}
    </svg>
  )
}

export default function IAMHome() {
  const groups = useData("iam-groups")
  const users = useData("iam-users")
  const [spinning, setSpinning] = useState(false)
  const copy = iamConsole.dashboard
  const loaded = groups.data !== null && users.data !== null
  const error = groups.error || users.error

  const reload = () => {
    setSpinning(true)
    groups.reload()
    users.reload()
    setTimeout(() => setSpinning(false), 600)
  }

  const allSkills = groups.data?.groups.flatMap((g) => g.skills) ?? []
  const advanced = allSkills.filter((s) => s.level === "Advanced").length
  const roles = users.data?.users ?? []
  const activeRoles = roles.filter((u) => u.status === "Active")
  const current = activeRoles[0]
  const latest = [...roles].sort((a, b) => b.periodFrom.localeCompare(a.periodFrom)).slice(0, 4)

  // Counts show a dash until the data has loaded
  const count = (n: number) => (loaded ? n : "–")
  const resources = [
    { label: copy.resources.groups, value: count(groups.data?.groups.length ?? 0), href: "/iam/groups" },
    { label: copy.resources.skills, value: count(allSkills.length), href: "/iam/skills" },
    { label: copy.resources.roles, value: count(roles.length), href: "/iam/users" },
    { label: copy.resources.advanced, value: count(advanced), href: "/iam/skills" },
    { label: copy.resources.activeRoles, value: count(activeRoles.length), href: "/iam/users" },
  ]

  const roleCheck = current
    ? {
        ok: true,
        title: copy.recommendations.activeRole.title,
        text: copy.recommendations.activeRole.text
          .replace("%s", `${current.description}, ${current.displayName}`)
          .replace("%s", formatMonthYear(current.periodFrom)),
      }
    : { ok: false, ...copy.recommendations.noActiveRole }
  const checks = [
    roleCheck,
    {
      ok: true,
      title: copy.recommendations.advanced.title.replace("%s", String(advanced)),
      text: copy.recommendations.advanced.text,
    },
  ]
  const open = checks.filter((c) => !c.ok).length

  const status = (label: string) => <DataStatus label={label} error={error} onRetry={reload} className={STATUS} />

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[24px] leading-[30px] font-bold text-gray-900">{copy.title.replace("%s", serviceTitle("iam"))}</h1>
          <InfoLink topic="iam-dashboard" />
        </div>
        <RefreshButton onClick={reload} spinning={spinning} />
      </div>

      <div className="flex gap-6 items-start flex-wrap xl:flex-nowrap">
        <div className="flex-1 min-w-0 basis-full xl:basis-0 space-y-6">
          {/* Recommendations */}
          <section className={`${CARD} px-5 py-5`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className={`${H2} flex items-center gap-2`}>
                {copy.recommendations.title}
                <span
                  className={`px-1.5 rounded text-xs leading-5 font-bold text-white ${open ? "bg-[#855900]" : "bg-[#00802f]"}`}
                >
                  {loaded ? open : "–"}
                </span>
              </h2>
              <RefreshButton onClick={reload} spinning={spinning} />
            </div>
            {!loaded && status(copy.recommendations.label)}
            {loaded && (
              <ul className="mt-4 space-y-4">
                {checks.map((c) => (
                  <li key={c.title} className="flex gap-2.5">
                    <Check ok={c.ok} />
                    <div>
                      <p className="text-sm text-gray-900">{c.title}</p>
                      <p className="mt-1 text-xs text-[#424650]">{c.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Resources */}
          <section className={`${CARD} px-5 py-5`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className={H2}>{copy.resources.title}</h2>
              <RefreshButton onClick={reload} spinning={spinning} />
            </div>
            <p className="mt-1 text-sm text-[#424650]">{copy.resources.subtitle}</p>
            {error && status(copy.resources.label)}
            <dl className="grid grid-cols-2 md:grid-cols-5 gap-y-5 mt-4">
              {resources.map((r, i) => (
                <div key={r.label} className={`px-4 ${i === 0 ? "md:pl-0" : "md:border-l md:border-[#c6c6cd]"} max-md:px-0`}>
                  <dt className="text-sm text-[#424650]">{r.label}</dt>
                  <dd className="mt-2">
                    <Link href={r.href} className={`text-[28px] leading-9 ${LINK}`}>
                      {r.value}
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* What's new */}
          <section className={`${CARD} px-5 py-5`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className={H2}>{copy.whatsNew.title}</h2>
              <Link
                href="/iam/users"
                className="h-8 px-5 flex items-center rounded-full border-2 border-[#006ce0] text-sm font-bold text-[#006ce0] hover:bg-[#f0fbff] whitespace-nowrap"
              >
                {copy.whatsNew.viewAll}
              </Link>
            </div>
            <p className="mt-1 text-sm text-[#424650]">{copy.whatsNew.subtitle}</p>
            {!users.data && <DataStatus label={copy.whatsNew.label} error={users.error} onRetry={users.reload} className={STATUS} />}
            <ul className="mt-3 divide-y divide-[#ebebf0]">
              {latest.map((u) => (
                <li key={u.id} className="py-2.5 text-sm">
                  <Link href={`/iam/users/${u.id}`} className={LINK}>
                    {copy.whatsNew.item.replace("%s", u.description).replace("%s", u.displayName)}
                  </Link>{" "}
                  <span className="text-[#424650] whitespace-nowrap">{formatMonthYear(u.periodFrom)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="w-full xl:w-[320px] shrink-0 space-y-6">
          <section className={`${CARD} px-5 py-5`}>
            <h2 className={H2}>{copy.currentRole.title}</h2>
            {!users.data && <DataStatus label={copy.currentRole.label} error={users.error} onRetry={users.reload} className={STATUS} />}
            {users.data && !current && <p className="mt-3 text-sm text-[#424650]">{copy.currentRole.none}</p>}
            {current && (
              <dl className="mt-3 space-y-3 text-sm">
                {[
                  {
                    label: copy.currentRole.organization,
                    value: (
                      <Link href={`/iam/users/${current.id}`} className={LINK}>
                        {current.displayName}
                      </Link>
                    ),
                  },
                  { label: copy.currentRole.role, value: current.description },
                  { label: copy.currentRole.period, value: formatPeriod(current.periodFrom, current.periodTo) },
                  { label: copy.currentRole.region, value: regionFull(current.region) },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="font-bold text-gray-900">{row.label}</dt>
                    <dd className="mt-0.5 text-gray-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          <section className={`${CARD} px-5 py-5`}>
            <h2 className={H2}>{copy.quickLinks.title}</h2>
            <Link href="/cloudtrail/home" className={`inline-block mt-3 text-sm ${LINK}`}>
              {serviceTitle("cloudtrail")}
            </Link>
            <p className="mt-2 text-sm text-gray-900">{copy.quickLinks.text}</p>
          </section>

          <section className={`${CARD} px-5 py-5`}>
            <h2 className={H2}>{copy.tools.title}</h2>
            <Link href={copy.tools.href} className={`inline-block mt-3 text-sm ${LINK}`}>
              {copy.tools.label}
            </Link>
            <p className="mt-2 text-sm text-gray-900">{copy.tools.text}</p>
          </section>

          <section className={`${CARD} px-5 py-5`}>
            <h2 className={H2}>{copy.more.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {copy.more.services.map((id) => (
                <li key={id}>
                  <Link href={`/${id}/home`} className={LINK}>
                    {serviceTitle(id)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
