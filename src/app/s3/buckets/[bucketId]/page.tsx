import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import s3Data from "@/data/s3.json"
import services from "@/data/services.json"
import site from "@/data/site.json"
import BucketDetail from "@/components/services/s3/BucketDetail"
import S3SubSidebar from "@/components/services/s3/S3SubSidebar"

const s3Service = services.find((s) => s.id === "s3")

interface Props {
  params: Promise<{ bucketId: string }>
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
      {/* Breadcrumb bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-200 text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0073bb" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
        <Link href="/s3/home" className="text-[#0073bb] hover:underline">
          Amazon S3
        </Link>
        <span className="text-gray-400">›</span>
        <Link href="/s3/home" className="text-[#0073bb] hover:underline">
          Buckets
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-700">{bucket.name}</span>
      </div>

      <div className="flex flex-1">
        <S3SubSidebar title={s3Service?.title} />
        <div className="flex-1 min-w-0">
          <BucketDetail bucket={bucket} />
        </div>
      </div>
    </div>
  )
}
