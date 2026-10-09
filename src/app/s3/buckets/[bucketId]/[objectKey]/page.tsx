import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import s3Data from "@/data/s3.json"
import regionsData from "@/data/regions.json"
import services from "@/data/services.json"
import site from "@/data/site.json"
import ObjectDetail from "@/components/services/s3/ObjectDetail"
import S3SubSidebar from "@/components/services/s3/S3SubSidebar"
import { objectFileUrl } from "@/lib/s3Files"

const s3Service = services.find((s) => s.id === "s3")
const regions = regionsData.groups.flatMap((g) => g.regions)

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

  const regionFull = regions.find((r) => r.id === bucket.region)?.full
  const regionLabel = regionFull ? `${regionFull} ${bucket.region}` : bucket.region

  return (
    <div className="bg-[#f2f3f3] min-h-[calc(100vh-56px)] flex flex-col">
      {/* Breadcrumb bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-200 text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0073bb" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
        <Link href="/s3/home" className="text-[#0073bb] hover:underline">
          Documents
        </Link>
        <span className="text-gray-400">›</span>
        <Link href="/s3/home" className="text-[#0073bb] hover:underline">
          Buckets
        </Link>
        <span className="text-gray-400">›</span>
        <Link href={`/s3/buckets/${bucket.id}`} className="text-[#0073bb] hover:underline">
          {bucket.name}
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-700 break-all">{obj.key}</span>
      </div>

      <div className="flex flex-1">
        <S3SubSidebar title={s3Service?.title} />
        <div className="flex-1 min-w-0">
          <ObjectDetail
            bucketName={bucket.name}
            region={bucket.region}
            regionLabel={regionLabel}
            owner={s3Data.owner}
            obj={{ ...obj, url: objectFileUrl(obj) }}
          />
        </div>
      </div>
    </div>
  )
}
