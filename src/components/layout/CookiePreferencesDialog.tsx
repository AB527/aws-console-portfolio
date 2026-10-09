"use client"

import { useState } from "react"

interface CookiePreferencesDialogProps {
  onClose: () => void
}

const CATEGORIES = [
  {
    id: "essential",
    title: "Essential",
    description:
      "Essential cookies are necessary to provide our site and services and cannot be deactivated. They are usually set in response to your actions on the site, such as setting your privacy preferences, signing in, or filling in forms.",
    required: true,
  },
  {
    id: "performance",
    title: "Performance",
    description:
      "Performance cookies provide anonymous statistics about how customers navigate our site so we can improve site experience and performance. Approved third parties may perform analytics on our behalf, but they cannot use the data for their own purposes.",
    required: false,
  },
  {
    id: "functional",
    title: "Functional",
    description:
      "Functional cookies help us provide useful site features, remember your preferences, and display relevant content. Approved third parties may set these cookies to provide certain site features. If you do not allow these cookies, then some or all of these services may not function properly.",
    required: false,
  },
  {
    id: "advertising",
    title: "Advertising",
    description:
      "Advertising cookies may be set through our site by us or our advertising partners and help us deliver relevant marketing content. If you do not allow these cookies, you will experience less relevant advertising.",
    required: false,
  },
]

export default function CookiePreferencesDialog({ onClose }: CookiePreferencesDialogProps) {
  const [allowed, setAllowed] = useState<Record<string, boolean>>({
    essential: true,
    performance: true,
    functional: true,
    advertising: true,
  })

  function toggle(id: string) {
    if (id === "essential") return
    setAllowed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl max-h-[85vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Customize cookie preferences</h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            We use cookies and similar tools (collectively, &ldquo;cookies&rdquo;) for the following purposes.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{cat.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{cat.description}</p>
                </div>
                <label className="flex items-center gap-2 shrink-0 mt-0.5 cursor-pointer">
                  <span className="text-xs text-gray-500">Allowed</span>
                  <input
                    type="checkbox"
                    checked={allowed[cat.id]}
                    onChange={() => toggle(cat.id)}
                    disabled={cat.required}
                    className="w-4 h-4 accent-[#0073bb] cursor-pointer disabled:cursor-default"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 shrink-0">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Blocking some types of cookies may impact your experience of our sites. You may review and change your choices at any time by selecting Cookie Preferences in the footer of this site.
          </p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-white bg-[#ff9900] rounded hover:bg-[#e88a00] transition-colors font-medium"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  )
}
