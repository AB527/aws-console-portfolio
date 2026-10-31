import type { Metadata } from "next"
import { notFound } from "next/navigation"
import s3Data from "@/data/s3.json"
import site from "@/data/site.json"
import ObjectDetail from "@/components/services/s3/ObjectDetail"

interface Props {
  params: Promise<{ bucketId: string; objectKey: string }>
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
    <div className="p-6">
      <ObjectDetail bucketId={bucketId} bucketName={bucket.name} obj={obj} />
    </div>
  )
}
