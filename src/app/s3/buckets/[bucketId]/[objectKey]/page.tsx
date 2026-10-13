import type { Metadata } from "next"
import { notFound } from "next/navigation"
import s3Data from "@data/s3.json"
import site from "@data/site.json"
import ObjectDetail from "@/components/services/s3/ObjectDetail"
import ServiceSidebar from "@/components/layout/ServiceSidebar"
import { objectFileUrls } from "@/lib/s3Files"
import HelpPanel from "@/components/layout/HelpPanel"

interface Props {
  params: Promise<{ bucketId: string; objectKey: string }>
}

export function generateStaticParams() {
  return s3Data.buckets.flatMap((b) => b.objects.map((o) => ({ bucketId: b.id, objectKey: o.key })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bucketId, objectKey } = await params
  const decoded = decodeURIComponent(objectKey)
  const obj = s3Data.buckets.find((b) => b.id === bucketId)?.objects.find((o) => o.key === decoded)
  return obj ? { title: site.detailTitles.s3.replace("%s", obj.key) } : {}
}

export default async function ObjectPage({ params }: Props) {
  const { bucketId, objectKey } = await params
  const bucket = s3Data.buckets.find((b) => b.id === bucketId)
  if (!bucket) notFound()

  const decoded = decodeURIComponent(objectKey)
  const obj = bucket.objects.find((o) => o.key === decoded)
  if (!obj) notFound()

  return (
    <div className="bg-[#f2f3f3] min-h-[calc(100vh-56px)] flex flex-col">
      <div className="flex flex-1">
        <ServiceSidebar serviceId="s3" />
        <div className="flex-1 min-w-0">
          <ObjectDetail bucketId={bucket.id} objectKey={obj.key} files={objectFileUrls()} />
        </div>
        <HelpPanel />
      </div>
    </div>
  )
}
