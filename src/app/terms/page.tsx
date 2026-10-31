import type { Metadata } from "next"
import Breadcrumb from "@/components/layout/Breadcrumb"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.terms }

const sections = [
  {
    id: "general",
    heading: "1. General",
    body: "By accessing or using this portfolio site (the \"Site\"), you agree to be bound by these Terms of Use. This Site is a personal project by Atharva Bedekar and is intended solely for informational and demonstration purposes. If you do not agree to these terms, please do not use this Site.",
  },
  {
    id: "your-account",
    heading: "2. Your Use of the Site",
    body: "You may use this Site for personal, non-commercial purposes. You agree not to attempt to reverse-engineer, scrape in bulk, or misuse any part of this Site. The Site is provided \"as is\" and may be updated or taken down at any time without notice.",
  },
  {
    id: "intellectual-property",
    heading: "3. Intellectual Property",
    body: "The code, design, content, and written material on this Site are the property of Atharva Bedekar unless otherwise noted. The AWS Management Console aesthetic is referenced for creative and educational purposes only. This Site is not affiliated with, endorsed by, sponsored by, or in any way associated with Amazon Web Services, Inc. AWS, Amazon Web Services, and related marks are trademarks of Amazon.com, Inc. or its affiliates.",
  },
  {
    id: "links",
    heading: "4. Third-Party Links",
    body: "This Site contains links to external websites including LinkedIn, GitHub, and Medium. These links are provided for convenience. Atharva Bedekar has no control over the content, privacy policies, or practices of any third-party sites and accepts no responsibility for them.",
  },
  {
    id: "disclaimer",
    heading: "5. Disclaimer of Warranties",
    body: "This Site and its contents are provided on an \"as is\" and \"as available\" basis without any warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. The information presented reflects work and experience at the time of publishing and may not be current.",
  },
  {
    id: "limitation",
    heading: "6. Limitation of Liability",
    body: "To the fullest extent permitted by applicable law, Atharva Bedekar shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use this Site, even if advised of the possibility of such damages.",
  },
  {
    id: "indemnification",
    heading: "7. Indemnification",
    body: "You agree to indemnify and hold harmless Atharva Bedekar from any claims, losses, or damages (including reasonable legal fees) arising from your use of this Site or violation of these Terms.",
  },
  {
    id: "changes",
    heading: "8. Changes to These Terms",
    body: "These Terms of Use may be updated at any time without prior notice. The most current version will always be available at this URL. Continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.",
  },
  {
    id: "governing-law",
    heading: "9. Governing Law",
    body: "These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict-of-law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Chhattisgarh, India.",
  },
]

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} />

        <div className="mt-4 mb-6">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Terms of Use</h1>
          <p className="text-sm text-gray-500">
            <strong>Last Updated:</strong> June 13, 2026
          </p>
          <p className="text-sm text-gray-600 mt-3 max-w-3xl leading-relaxed">
            Please read these Terms of Use carefully before using this portfolio site. These terms govern your access to and use of the site operated by Atharva Bedekar.
          </p>
        </div>

        <div className="flex gap-10 items-start">
          {/* Sticky sidebar TOC */}
          <aside className="w-[220px] shrink-0 sticky top-[56px]">
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
