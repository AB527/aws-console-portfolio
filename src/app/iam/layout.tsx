import ServiceSidebar from "@/components/layout/ServiceSidebar"
import ServiceTopBar from "@/components/layout/ServiceTopBar"
import ServiceBreadcrumb from "@/components/layout/ServiceBreadcrumb"

export default function IAMLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceTopBar>
        <ServiceBreadcrumb />
      </ServiceTopBar>
      <div className="flex min-h-[calc(100vh-56px)]">
        <ServiceSidebar serviceId="iam" />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </>
  )
}
