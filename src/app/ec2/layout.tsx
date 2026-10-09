import { Suspense } from "react"
import EC2Sidebar from "@/components/services/ec2/EC2Sidebar"
import { serviceTitle } from "@/lib/serviceTitle"

function SidebarFallback() {
  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <span className="text-[16px] font-bold text-gray-900">{serviceTitle("ec2")}</span>
      </div>
    </aside>
  )
}

export default function EC2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <Suspense fallback={<SidebarFallback />}>
        <EC2Sidebar />
      </Suspense>
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
