import MobileServiceBar from "@/components/layout/MobileServiceBar"
import { serviceTitle } from "@/lib/serviceTitle"

export default function S3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <MobileServiceBar title={serviceTitle("s3")} />
      <main className="min-w-0">{children}</main>
    </div>
  )
}
