import IAMSidebar from "@/components/services/iam/IAMSidebar"

export default function IAMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-48px)]">
      <IAMSidebar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
