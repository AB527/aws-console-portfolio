import type { Metadata } from "next"
import { notFound } from "next/navigation"
import s3Data from "@/data/s3.json"
import services from "@/data/services.json"
import site from "@/data/site.json"
import BucketDetail from "@/components/services/s3/BucketDetail"
import S3SubSidebar from "@/components/services/s3/S3SubSidebar"
import { objectFileUrl } from "@/lib/s3Files"

const s3Service = services.find((s) => s.id === "s3")

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
    <div className="bg-[#f2f3f3] min-h-[calc(100vh-56px)] flex flex-col">
      <div className="flex flex-1">
        <S3SubSidebar title={s3Service?.title} />
        <div className="flex-1 min-w-0">
          <BucketDetail
            bucket={{ ...bucket, objects: bucket.objects.map((o) => ({ ...o, url: objectFileUrl(o) })) }}
          />
        </div>
      </div>
    </div>
  )
}
