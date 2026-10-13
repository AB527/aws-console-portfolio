import type { Metadata } from "next"

export const metadata: Metadata = { title: "Data Studio" }

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="px-4 lg:px-6 py-6 max-w-[1100px]">{children}</div>
}
