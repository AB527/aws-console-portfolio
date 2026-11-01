import IAMSidebar from "@/components/services/iam/IAMSidebar"
import MobileServiceBar from "@/components/layout/MobileServiceBar"
import { serviceTitle } from "@/lib/serviceTitle"

export default function IAMLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileServiceBar title={serviceTitle("iam")} />
      <div className="flex min-h-[calc(100vh-56px)]">
        <IAMSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </>
  )
}
