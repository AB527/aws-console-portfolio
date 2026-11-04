"use client"

import Link from "next/link"
import { useConsoleStore } from "@/store/useConsoleStore"
import { fieldSummary, sectionFields, sections } from "@/lib/settings"
import settings from "@data/settings.json"
import SettingsShell from "./SettingsShell"

const OUTLINE_BUTTON =
  "h-8 px-5 inline-flex items-center rounded-full border-2 border-link text-sm font-bold text-link hover:bg-surface-selected whitespace-nowrap"

// The Unified settings page: one tab of cards, each showing its current values and an Edit button
export default function SettingsHome({ tab: tabId }: { tab: string }) {
  const store = useConsoleStore()
  const { labels, tabs } = settings
  const tab = tabs.find((t) => t.id === tabId) ?? tabs[0]

  return (
    <SettingsShell title={settings.title} description={tab.description} infoTopic={settings.helpTopic}>
      <nav className="mt-4 flex border-b border-line">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            aria-current={t.id === tab.id ? "page" : undefined}
            className={`px-5 py-2 text-[16px] font-bold border-b-4 -mb-px ${
              t.id === tab.id ? "text-link border-link" : "text-ink-body border-transparent hover:text-link"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tab.resettable && (
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={store.resetUserSettings} className={OUTLINE_BUTTON}>
            {labels.resetAll}
          </button>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-5">
        {sections
          .filter((section) => section.tab === tab.id)
          .map((section) => (
            <section key={section.id} className="bg-surface rounded-2xl border border-line px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[20px] leading-6 font-bold">{section.title}</h2>
                <Link href={`/settings/${section.id}/edit`} className={OUTLINE_BUTTON}>
                  {labels.edit}
                </Link>
              </div>
              <p className="mt-1 text-ink-body">{section.description}</p>
              <dl className="mt-4 grid grid-cols-1 gap-y-4 md:grid-flow-col md:auto-cols-fr">
                {sectionFields(section).map((field, i) => (
                  <div key={field.key} className={i > 0 ? "md:border-l md:border-line md:pl-4" : "md:pr-4"}>
                    <dt className="font-bold">
                      {field.label}
                      {field.badge && <span className="ml-2 text-xs text-link">{field.badge}</span>}
                    </dt>
                    <dd className="mt-1">{fieldSummary(field, store[field.key], store.hiddenRegions)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
      </div>
    </SettingsShell>
  )
}
