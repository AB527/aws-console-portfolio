"use client"

import { useState } from "react"
import Link from "next/link"
import { useConsoleStore } from "@/store/useConsoleStore"
import { DataStatusRow } from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

const ANY = "any"
const BOOL_OPTIONS = [
  { value: ANY, label: "No preference" },
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
]

const LINK = "text-link underline underline-offset-4"
const RESULT_COLS = ["Project type", "Description", "Tech stack", "Scale", "Users served", "Hours spent"]

interface Criteria {
  family: string
  scale: string
  productionGrade: string
  openSource: string
  minUsers: string
  minHours: string
}

const DEFAULT_CRITERIA: Criteria = {
  family: ANY,
  scale: ANY,
  productionGrade: ANY,
  openSource: ANY,
  minUsers: "",
  minHours: "",
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="block font-bold mb-1">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8 pl-3 pr-9 appearance-none bg-surface border border-line-strong rounded-lg outline-none focus:border-link focus:ring-1 focus:ring-link"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-link"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="currentColor"
        >
          <path d="M1 3h8L5 8z" />
        </svg>
      </span>
    </label>
  )
}

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="block font-bold mb-1">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 px-3 bg-surface border border-line-strong rounded-lg outline-none focus:border-link focus:ring-1 focus:ring-link"
      />
    </label>
  )
}

export default function EC2InstanceTypeFinderView() {
  const selectedRegion = useConsoleStore((s) => s.selectedRegion)
  const [criteria, setCriteria] = useState<Criteria>(DEFAULT_CRITERIA)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  // Criteria as they were when advice was last requested
  const [applied, setApplied] = useState<Criteria | null>(null)

  const typesHref = `/ec2/home?view=instance-types&region=${selectedRegion}`
  const set = (key: keyof Criteria) => (value: string) => setCriteria((c) => ({ ...c, [key]: value }))

  const { data: ec2Data, error, reload } = useData("ec2-projects")

  const regionInstances = (ec2Data?.instances ?? []).filter((i) => i.region === selectedRegion)
  const types = (ec2Data?.instanceTypeDetails ?? [])
    .map((t) => {
      const projects = regionInstances.filter((i) => i.instanceType === t.id)
      return {
        ...t,
        projectCount: projects.length,
        usersServed: projects.reduce((s, i) => s + i.metrics.usersServed, 0),
        hoursSpent: projects.reduce((s, i) => s + i.metrics.hoursSpent, 0),
      }
    })
    .filter((t) => t.projectCount > 0)

  const toOptions = (values: string[]) => [
    { value: ANY, label: "Any" },
    ...[...new Set(values)].sort().map((v) => ({ value: v, label: v })),
  ]
  const familyOptions = toOptions(types.map((t) => t.id.split(".")[0]))
  const scaleOptions = toOptions(types.map((t) => t.scale))

  const suggestions = applied
    ? types
        .filter(
          (t) =>
            (applied.family === ANY || t.id.split(".")[0] === applied.family) &&
            (applied.scale === ANY || t.scale === applied.scale) &&
            (applied.productionGrade === ANY || String(t.productionGrade) === applied.productionGrade) &&
            (applied.openSource === ANY || String(t.openSource) === applied.openSource) &&
            t.usersServed >= (Number(applied.minUsers) || 0) &&
            t.hoursSpent >= (Number(applied.minHours) || 0)
        )
        .sort((a, b) => b.usersServed - a.usersServed)
    : []

  return (
    <div className="px-4 lg:px-6 py-5 text-[14px] leading-5 text-ink">
      <h1 className="text-[24px] leading-[30px] font-bold">Project type finder</h1>

      <section className="mt-5 px-5 py-5 bg-surface rounded-2xl border border-line">
        <h2 className="text-[20px] leading-6 font-bold">Project type requirements</h2>
        <p className="mt-4 mb-3 font-bold">
          Tell us about your project type requirements and we&apos;ll provide suggestions for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <SelectField label="Project family" value={criteria.family} options={familyOptions} onChange={set("family")} />
          <SelectField label="Scale" value={criteria.scale} options={scaleOptions} onChange={set("scale")} />
          <SelectField
            label="Production grade"
            value={criteria.productionGrade}
            options={BOOL_OPTIONS}
            onChange={set("productionGrade")}
          />
          <SelectField label="Open source" value={criteria.openSource} options={BOOL_OPTIONS} onChange={set("openSource")} />
        </div>

        <button
          onClick={() => setAdvancedOpen((o) => !o)}
          aria-expanded={advancedOpen}
          className="flex items-center gap-2 mt-5 text-[16px] leading-5 font-bold"
        >
          <svg
            className={`transition-transform ${advancedOpen ? "" : "-rotate-90"}`}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="currentColor"
          >
            <path d="M1 3h8L5 8z" />
          </svg>
          Advanced parameters
        </button>
        {advancedOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mt-4">
            <NumberField label="Minimum users served" value={criteria.minUsers} onChange={set("minUsers")} />
            <NumberField label="Minimum hours spent" value={criteria.minHours} onChange={set("minHours")} />
          </div>
        )}
      </section>

      <div className="flex items-center justify-end gap-3 mt-5">
        <Link href={typesHref} className="h-8 px-5 flex items-center text-sm font-bold text-link hover:text-link-hover">
          Cancel
        </Link>
        <button
          onClick={() => setApplied(criteria)}
          className="h-8 px-5 rounded-full bg-[#ff9900] hover:bg-[#fa6f00] text-sm font-bold text-[#0f141a] transition-colors"
        >
          Get project type advice
        </button>
      </div>

      {applied && (
        <section className="mt-5 px-5 py-5 bg-surface rounded-2xl border border-line">
          <h2 className="text-[20px] leading-6 font-bold">
            Suggested project types <span className="font-normal text-ink-muted">({ec2Data ? suggestions.length : "–"})</span>
          </h2>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  {RESULT_COLS.map((col, i) => (
                    <th key={col} className="text-left py-1.5 font-bold text-ink-body">
                      <span className={`block pr-4 whitespace-nowrap ${i > 0 ? "pl-4 border-l border-line" : ""}`}>
                        {col}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suggestions.map((t) => (
                  <tr key={t.id} className="border-b border-line-subtle last:border-b-0">
                    <td className="py-2.5 pr-4 whitespace-nowrap">
                      <Link href={`${typesHref}&type=${t.id}`} className={LINK}>
                        {t.id}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">{t.description}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{t.techStack}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{t.scale}</td>
                    <td className="px-4 py-2.5">{t.usersServed.toLocaleString("en-US")}</td>
                    <td className="px-4 py-2.5">{t.hoursSpent.toLocaleString("en-US")}</td>
                  </tr>
                ))}
                {!ec2Data && (
                  <DataStatusRow colSpan={RESULT_COLS.length} label="project types" error={error} onRetry={reload} />
                )}
                {ec2Data && suggestions.length === 0 && (
                  <tr>
                    <td colSpan={RESULT_COLS.length} className="px-4 py-10 text-center font-bold text-ink-body">
                      {types.length === 0
                        ? `No projects in the selected region (${selectedRegion}).`
                        : "No project types match your requirements."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
