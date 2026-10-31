import type { Metadata } from "next"
import Breadcrumb from "@/components/layout/Breadcrumb"
import gettingStarted from "@/data/getting-started.json"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.gettingStarted }

export default function GettingStartedPage() {
  return (
    <div className="p-6 max-w-3xl">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Getting started" }]} />

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
    </div>
  )
}
