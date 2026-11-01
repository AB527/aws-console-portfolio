import type { Metadata } from "next"
import Breadcrumb from "@/components/layout/Breadcrumb"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.privacy }

const sections = [
  {
    id: "information-we-collect",
    heading: "1. Personal Information We Collect",
    body: "This portfolio does not collect personal information in the traditional sense. No forms, sign-up flows, or tracking pixels are used. Your browser's localStorage stores only UI preferences — region selection, widget layout, and visual mode. This data never leaves your device and is not accessible to any server.",
  },
  {
    id: "how-we-use",
    heading: "2. How We Use Personal Information",
    body: "The localStorage preferences are used solely to restore your console state on return visits — e.g., keeping your selected region or widget arrangement. No personal data is processed, profiled, or used for advertising or analytics.",
  },
  {
    id: "cookies",
    heading: "3. Cookies",
    body: "This site does not use tracking cookies, advertising cookies, or third-party analytics cookies. No cookie banners are required because no identifying cookies are set. The cookie preferences dialog is provided for transparency and educational purposes, mirroring the real AWS console UI.",
  },
  {
    id: "how-we-share",
    heading: "4. How We Share Personal Information",
    body: "No personal information is collected, and therefore none is shared. This site does not integrate with any data processors, analytics providers, ad networks, or third-party services that receive user data.",
  },
  {
    id: "data-retention",
    heading: "5. Data Retention",
    body: "localStorage data persists in your browser until you clear it. You can remove all stored preferences at any time via your browser's developer tools or by clearing site data in your browser settings.",
  },
  {
    id: "your-rights",
    heading: "6. Your Rights",
    body: "Since no personal data is collected or stored server-side, there is no data to access, correct, or delete on our end. Your preferences live entirely in your own browser. You are in full control.",
  },
  {
    id: "third-party",
    heading: "7. Third-Party Websites",
    body: "This portfolio links to external sites such as LinkedIn, GitHub, and Medium. Clicking those links takes you to third-party services with their own privacy policies. We are not responsible for the data practices of those sites.",
  },
  {
    id: "contact",
    heading: "8. Contact Information",
    body: "For any questions about this privacy notice, contact Atharva Bedekar at atharvabedekar527@gmail.com.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Notice" }]} />

        <div className="mt-4 mb-6">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Privacy Notice</h1>
          <p className="text-sm text-gray-500">
            <strong>Last Updated:</strong> June 13, 2026
          </p>
          <p className="text-sm text-gray-600 mt-3 max-w-3xl leading-relaxed">
            This Privacy Notice describes how Atharva Bedekar (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) handles information in connection with this portfolio site. We take privacy seriously and have designed this site to collect no personal information.
          </p>
        </div>

        <div className="flex gap-10 items-start">
          {/* Sticky sidebar TOC */}
          <aside className="w-[220px] shrink-0 sticky top-[56px] hidden lg:block">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Contents</p>
            <nav className="flex flex-col gap-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-[13px] text-[#0073bb] hover:underline leading-snug py-0.5"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="divide-y divide-gray-100">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="py-6 scroll-mt-14">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">{section.heading}</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
