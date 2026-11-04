"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useConsoleStore, type ConsoleSettings } from "@/store/useConsoleStore"
import {
  fieldOptions,
  firstVisibleRegion,
  sectionFields,
  type Field,
  type Section,
  type SettingKey,
  type SettingsDraft,
} from "@/lib/settings"
import settings from "@data/settings.json"
import SettingsShell from "./SettingsShell"

type Value = ConsoleSettings[SettingKey]

const INPUT = "w-full max-w-[800px] h-9 px-3 rounded-lg border border-line-strong bg-surface text-ink focus:outline-none focus:border-link"

function Control({
  field,
  value,
  hiddenRegions,
  onChange,
}: {
  field: Field
  value: Value
  hiddenRegions: string[]
  onChange: (value: Value) => void
}) {
  const options = fieldOptions(field, hiddenRegions)

  if (field.control === "toggle") {
    const on = value === true
    return (
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={field.label}
        onClick={() => onChange(!on)}
        className={`relative w-9 h-5 rounded-full transition-colors ${on ? "bg-[#006ce0]" : "bg-[#8c8c94]"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`} />
      </button>
    )
  }

  if (field.control === "select") {
    return (
      <select aria-label={field.label} value={String(value)} onChange={(e) => onChange(e.target.value as Value)} className={INPUT}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  }

  if (field.control === "radio") {
    return (
      <div className="flex flex-col gap-2">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 w-fit">
            <input
              type="radio"
              name={field.key}
              checked={value === o.value}
              onChange={() => onChange(o.value as Value)}
              className="w-4 h-4 accent-link"
            />
            {o.label}
          </label>
        ))}
      </div>
    )
  }

  // Checklist: the stored value lists what is hidden, so a ticked box means "not in the list"
  const hidden = Array.isArray(value) ? value : []
  const { labels } = settings
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 w-fit font-bold">
        <input type="checkbox" checked={hidden.length === 0} onChange={() => onChange([])} className="w-4 h-4 accent-link" />
        {labels.selectAll}
      </label>
      {options.map((o) => (
        <label key={o.value} className="flex items-center gap-2 w-fit">
          <input
            type="checkbox"
            checked={!hidden.includes(o.value)}
            onChange={() => onChange(hidden.includes(o.value) ? hidden.filter((id) => id !== o.value) : [...hidden, o.value])}
            className="w-4 h-4 accent-link"
          />
          {o.label}
        </label>
      ))}
      {hidden.length >= options.length && <p className="text-danger">{labels.minOne}</p>}
    </div>
  )
}

// Edit page for one settings card. Nothing changes until Save.
export default function SettingsEdit({ section }: { section: Section }) {
  const router = useRouter()
  const store = useConsoleStore()
  const fields = sectionFields(section)
  const [draft, setDraft] = useState<SettingsDraft>({})
  const { labels, tabs } = settings
  const back = (tabs.find((t) => t.id === section.tab) ?? tabs[0]).href

  const valueOf = (field: Field): Value => draft[field.key] ?? store[field.key]

  // A checklist with everything unticked would leave the console with nothing to show
  const valid = fields.every((field) => {
    const value = valueOf(field)
    return !Array.isArray(value) || value.length < fieldOptions(field, store.hiddenRegions).length
  })

  function save() {
    const patch: SettingsDraft = { ...draft }
    // Hiding the selected Region moves the console to one that is still visible
    const hiddenRegions = patch.hiddenRegions
    if (hiddenRegions?.includes(store.selectedRegion)) {
      const next = firstVisibleRegion(hiddenRegions)
      if (next === "ap-south-1" || next === "ap-south-17") patch.selectedRegion = next
    }
    store.applySettings(patch)
    router.push(back)
  }

  return (
    <SettingsShell
      title={section.editTitle}
      description={section.editDescription}
      infoTopic={section.helpTopic}
      breadcrumb={[{ label: settings.title, href: back }, { label: section.editTitle }]}
    >
      <div className="mt-5 flex flex-col gap-5">
        {section.groups.map((group) => (
          <section key={group.title} className="bg-surface rounded-2xl border border-line px-5 pt-4 pb-6">
            <h2 className="text-[20px] leading-6 font-bold">{group.title}</h2>
            <div className="mt-4 flex flex-col gap-5">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <p className="font-bold">
                    {field.label}
                    {field.badge && <span className="ml-2 text-xs text-link">{field.badge}</span>}
                  </p>
                  {field.hint && <p className="text-ink-muted max-w-[800px]">{field.hint}</p>}
                  <div className="mt-2">
                    <Control
                      field={field}
                      value={valueOf(field)}
                      hiddenRegions={store.hiddenRegions}
                      onChange={(value) => setDraft((d) => ({ ...d, [field.key]: value }))}
                    />
                  </div>
                  {field.note && <p className="mt-1 text-ink-muted">{field.note}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-end gap-6">
        <Link href={back} className="text-sm font-bold text-link hover:underline">
          {labels.cancel}
        </Link>
        <button
          type="button"
          onClick={save}
          disabled={!valid}
          className="h-8 px-5 rounded-full bg-[#ff9900] hover:bg-[#fa6f00] text-sm font-bold text-[#0f141a] disabled:bg-gray-200 dark:disabled:bg-line disabled:text-gray-400 dark:disabled:text-ink-disabled"
        >
          {section.saveLabel}
        </button>
      </div>
    </SettingsShell>
  )
}
