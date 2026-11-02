"use client"

import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

export default function GettingStartedContent() {
  const { data: gettingStarted, error, reload } = useData("getting-started")

  if (!gettingStarted) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl">
        <DataStatus label="guide" error={error} onRetry={reload} />
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{gettingStarted.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{gettingStarted.subtitle}</p>

      <div className="flex flex-col gap-0">
        {gettingStarted.sections.map((section, i) => (
          <div
            key={section.id}
            className={`bg-white border border-gray-200 px-6 py-5 ${
              i === 0 ? "rounded-t-2xl" : ""
            } ${i === gettingStarted.sections.length - 1 ? "rounded-b-2xl" : "border-b-0"}`}
          >
            <h2 className="text-base font-semibold text-gray-800 mb-2">{section.heading}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </>
  )
}
