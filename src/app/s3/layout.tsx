import ServiceTopBar from "@/components/layout/ServiceTopBar"
import ServiceBreadcrumb from "@/components/layout/ServiceBreadcrumb"

export default function S3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <ServiceTopBar>
        <ServiceBreadcrumb />
      </ServiceTopBar>
      <main className="min-w-0">{children}</main>
    </div>
  )
}
