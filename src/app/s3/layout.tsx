import S3Sidebar from "@/components/services/s3/S3Sidebar"

export default function S3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-48px)]">
      <S3Sidebar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
