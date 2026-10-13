import Link from "next/link"
import { readRows } from "@/components/studio/engine"
import { SECTION_GROUPS } from "@/components/studio/sections"
import type { Json } from "@/components/studio/json"
import { readDataFile } from "@/lib/studio"

export default async function StudioPage() {
  const files = [...new Set(SECTION_GROUPS.flatMap((group) => group.sections.map((section) => section.file)))]
  const loaded = await Promise.all(files.map(async (file) => [file, await readDataFile(file)] as const))
  const data = new Map<string, Json | undefined>(loaded)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-[30px] font-bold text-gray-900 dark:text-ink">Studio</h1>
        <p className="mt-1 text-sm text-ink-body">
          Add, edit and delete what the portfolio shows. These pages exist only while running the dev server.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {SECTION_GROUPS.map((group) => (
          <section key={group.title} className="bg-surface rounded-2xl border border-line p-5">
            <h2 className="text-[20px] leading-6 font-bold text-gray-900 dark:text-ink">{group.title}</h2>
            {group.note && <p className="mt-1 text-sm text-ink-body">{group.note}</p>}
            <ul className="mt-3 divide-y divide-line-subtle">
              {group.sections.map((section) => {
                const file = data.get(section.file)
                return (
                  <li key={section.id} className="flex items-baseline justify-between gap-4 py-2.5">
                    <div className="min-w-0">
                      <Link href={`/studio/${section.id}`} className="font-bold text-link hover:underline">
                        {section.title}
                      </Link>
                      <p className="mt-0.5 text-sm text-ink-body">{section.description}</p>
                    </div>
                    {section.kind === "list" && file !== undefined && (
                      <span className="shrink-0 text-sm text-ink-body">{readRows(file, section).length}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
