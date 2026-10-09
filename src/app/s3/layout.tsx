export default function S3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <main className="min-w-0">{children}</main>
    </div>
  )
}
