import type { Metadata } from "next"
import { notFound } from "next/navigation"
import s3Data from "@data/s3.json"
import site from "@data/site.json"
import BucketDetail from "@/components/services/s3/BucketDetail"
import ServiceSidebar from "@/components/layout/ServiceSidebar"
import { objectFileUrls } from "@/lib/s3Files"
import HelpPanel from "@/components/layout/HelpPanel"

interface Props {
  params: Promise<{ bucketId: string }>
}

export function generateStaticParams() {
  return s3Data.buckets.map((b) => ({ bucketId: b.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bucketId } = await params
  const bucket = s3Data.buckets.find((b) => b.id === bucketId)
  return bucket ? { title: site.detailTitles.s3.replace("%s", bucket.name) } : {}
}

export default async function BucketPage({ params }: Props) {
  const { bucketId } = await params
  const bucket = s3Data.buckets.find((b) => b.id === bucketId)
  if (!bucket) notFound()

  return (
    <div className="bg-page min-h-[calc(100vh-53px)] flex flex-col">
      <div className="flex flex-1">
        <ServiceSidebar serviceId="s3" />
        <div className="flex-1 min-w-0">
          <BucketDetail bucketId={bucket.id} files={objectFileUrls()} />
        </div>
        <HelpPanel />
      </div>
    </div>
  )
}
