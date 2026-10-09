import CloudTrailShell from "@/components/services/cloudtrail/CloudTrailShell"

export default function CloudTrailLayout({ children }: { children: React.ReactNode }) {
  return <CloudTrailShell>{children}</CloudTrailShell>
}
